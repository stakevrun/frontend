import { useAccount, useReadContracts } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { useRocketAddress } from "./useRocketAddress";
import { useValidatorPubkeys } from "./useValidatorPubkeys";
import { abi } from "../abi/miniManagerABI";

// TODO:
// - Use DAONodeTrustedSettingsValidator contract to find the scrub period and calculate the estimated time to wait for validator activation
// - Get beaconchain status values for validators

export function useValidatorData() {
  const [validatorData, setValidatorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPrelaunchPools, setHasPrelauncPools] = useState(false);
  const [hasPoolsToActivate, setHasPoolsToActivate] = useState(false);

  const { address } = useAccount();
  const {
    data: pubkeys,
    error: pubkeysError,
    isLoading: pubkeysLoading,
  } = useValidatorPubkeys();
  const {
    data: validatorManagerAddress,
    error: validatorManagerError,
    isLoading: managerLoading,
  } = useRocketAddress("rocketMinipoolManager");

  // https://etherscan.io/address/0x03d30466d199ef540823fe2a22cae2e3b9343bb0#readContract
  const validatorAddressABI = [
    {
      name: "canStake",
      stateMutability: "nonpayable",
      type: "function",
      inputs: [],
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
    },
    {
      name: "getStatus",
      stateMutability: "nonpayable",
      type: "function",
      inputs: [],
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    },
    {
      name: "getStatusTime",
      stateMutability: "nonpayable",
      type: "function",
      inputs: [],
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    },
  ];

  const validatorCalls = useMemo(() => {
    if (!pubkeys || !validatorManagerAddress || pubkeysLoading) return [];

    return pubkeys.map((key) => ({
      address: validatorManagerAddress,
      abi: abi,
      functionName: "getMinipoolByPubkey",
      args: [key.pubkey],
    }));
  }, [pubkeys, validatorManagerAddress, pubkeysLoading]);
  const {
    data: validatorAddresses,
    error: validatorAddressesError,
    isLoading: validatorAddressesLoading,
    refetch: validatorAddressesRefetch,
  } = useReadContracts({
    contracts: validatorCalls,
    enabled: !!validatorCalls.length,
  });
  useEffect(() => {
    if (
      validatorCalls.length &&
      !validatorAddresses &&
      !validatorAddressesLoading &&
      !validatorAddressesError
    ) {
      console.log("validatorCalls:", validatorCalls);
      validatorAddressesRefetch();
    }
  }, [validatorCalls, validatorAddressesLoading]);

  const statusCalls = useMemo(() => {
    if (!validatorAddresses || validatorAddressesLoading) return [];
    console.log("validatorAddresses:", validatorAddresses);
    return validatorAddresses
      .filter((addr) => {
        return (
          addr && addr.result != "0x0000000000000000000000000000000000000000"
        );
      }) // Exclude undefined addresses
      .map((address) => [
        {
          address: address.result,
          abi: validatorAddressABI,
          functionName: "getStatus",
        },
        {
          address: address.result,
          abi: validatorAddressABI,
          functionName: "getStatusTime",
        },
        {
          address: address.result,
          abi: validatorAddressABI,
          functionName: "canStake",
        },
      ])
      .flat();
  }, [validatorAddresses, validatorAddressesLoading]);
  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
    refetch: statusDataRefetch,
  } = useReadContracts({
    contracts: statusCalls,
    enabled: !!statusCalls.length,
  });
  useEffect(() => {
    if (statusCalls.length && !statusData && !statusLoading) {
      statusDataRefetch();
    }
  }, [statusCalls, statusLoading]);

  useEffect(() => {
    console.log("statusCalls:", statusCalls);
    console.log("pubkeys:", pubkeys);
    console.log("statusData:", statusData);
    if (!pubkeys || !statusData || !validatorAddresses) return;

    let filteredIndex = 0;
    const formattedData = pubkeys
      .map((pubkey, index) => {
        const validatorAddress = validatorAddresses[index].result;
        if (
          validatorAddress === "0x0000000000000000000000000000000000000000" ||
          validatorAddress === undefined
        ) {
          // a 0x000... address can be produced when a key is already generated for an vrun index,
          // but the contract call hasn't been initiated or has failed.
          // Undefined can be returned when a new validator creation is in process while updating this list.
          return;
        }

        console.log(validatorAddress);
        console.log(filteredIndex);

        const statusResult = statusData[filteredIndex * 3].result;
        const statusTimeResult = statusData[filteredIndex * 3 + 1].result;
        const canStake = statusData[filteredIndex * 3 + 2].result;

        filteredIndex++;

        const statusTime = statusTimeResult
          ? Number(statusTimeResult) * 1000
          : "";
        const statusDateTime = new Date(statusTime);
        const currentStatus =
          ["Initialised", "Prelaunch", "Staking", "Withdrawable", "Dissolved"][
            statusResult
          ] || "";

        setHasPrelauncPools(hasPrelaunchPools || currentStatus === "Prelaunch");
        setHasPoolsToActivate(hasPoolsToActivate || canStake);

        return {
          nodeAddress: address || "",
          address: validatorAddress.toLowerCase(),
          status: currentStatus,
          statusTime: statusDateTime.toLocaleString(),
          canStake: canStake,
          pubkey: pubkey.pubkey.toLowerCase(),
          index: pubkey.index,
        };
      })
      .filter((pool) => pool);

    console.log("formattedData:", formattedData);
    setValidatorData(formattedData);
  }, [statusData, validatorAddresses, address]);

  useEffect(() => {
    setLoading(
      pubkeysLoading ||
        managerLoading ||
        validatorAddressesLoading ||
        statusLoading,
    );
    setError(
      pubkeysError ||
        validatorManagerError ||
        validatorAddressesError ||
        statusError,
    );

    console.log(error);
  }, [
    pubkeysLoading,
    managerLoading,
    validatorAddressesLoading,
    statusLoading,
    pubkeysError,
    validatorManagerError,
    validatorAddressesError,
    statusError,
  ]);

  return {
    validatorData,
    hasPrelaunchPools,
    hasPoolsToActivate,
    loading,
    error,
  };
}
