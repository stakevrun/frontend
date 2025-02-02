import type { AbiFunction } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { useRocketAddress } from "./useRocketAddress";
import { useValidatorPubkeys } from "./useValidatorPubkeys";
import { abi } from "../abi/miniManagerABI";
import isEqual from "lodash.isequal";

// TODO:
// - Use DAONodeTrustedSettingsValidator contract to find the scrub period and calculate the estimated time to wait for validator activation

export interface ValidatorData {
  nodeAddress: `0x${string}` | undefined;
  address: `0x${string}`;
  status: string;
  statusTime: string;
  canStake: boolean;
  pubkey: `0x${string}`;
  index: number;
}

export function useValidatorData() {
  const [validatorData,      setValidatorData     ] = useState<ValidatorData[]>([]);
  const [hasPrelaunchPools,  setHasPrelaunchPools  ] = useState<boolean>(false);
  const [hasPoolsToActivate, setHasPoolsToActivate] = useState<boolean>(false);

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
    query: { enabled: !!validatorCalls.length },
  });

  useEffect(() => {
    if (
      validatorCalls.length &&
      !validatorAddresses &&
      !validatorAddressesLoading &&
      !validatorAddressesError
    ) {
      validatorAddressesRefetch();
    }
  }, [
    validatorCalls.length,
    validatorAddressesLoading,
    validatorAddresses,
    validatorAddressesError,
    validatorAddressesRefetch,
  ]);

  const statusCalls = useMemo(() => {
    if (!validatorAddresses || validatorAddressesLoading) return [];

    // https://etherscan.io/address/0x03d30466d199ef540823fe2a22cae2e3b9343bb0#readContract
    const validatorAddressABI: AbiFunction[] = [
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

    return validatorAddresses
      .filter((addr) => {
        return (
          addr && String(addr.result) != "0x0000000000000000000000000000000000000000"
        );
      }) // Exclude undefined addresses
      .map((address) => [
        {
          address: String(address.result) as `0x${string}`,
          abi: validatorAddressABI,
          functionName: "getStatus",
        },
        {
          address: String(address.result) as `0x${string}`,
          abi: validatorAddressABI,
          functionName: "getStatusTime",
        },
        {
          address: String(address.result) as `0x${string}`,
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
    query: { enabled: !!statusCalls.length },
  });
  useEffect(() => {
    if (statusCalls.length && !statusData && !statusLoading) {
      statusDataRefetch();
    }
  }, [statusCalls, statusLoading, statusData, statusDataRefetch]);

  useEffect(() => {
    if (!pubkeys || !statusData || !validatorAddresses) return;

    let filteredIndex = 0;
    let newHasPrelaunchPools = false;
    let newHasPoolsToActivate = false;

    const formattedData = pubkeys
      .map((pubkey, index) => {
        const validatorAddress: string = String(validatorAddresses[index]?.result);
        if (
          validatorAddress === undefined ||
          validatorAddress === "0x0000000000000000000000000000000000000000"
        ) {
          // a 0x000... address can be produced when a key is already generated for an vrun index,
          // but the contract call hasn't been initiated or has failed.
          // Undefined can be returned when a new validator creation is in process while updating this list.
          return;
        }

        const statusResult = statusData?.[filteredIndex * 3]?.result as string | undefined;
        const statusTimeResult = statusData?.[filteredIndex * 3 + 1]
          ?.result as string | undefined;
        const canStake = statusData?.[filteredIndex * 3 + 2]?.result as boolean | undefined;

        filteredIndex++;

        const statusTime = statusTimeResult
          ? Number(statusTimeResult) * 1000
          : "";
        const statusDateTime = new Date(statusTime);
        const statusIndex = statusResult !== undefined ? Number(statusResult) : -1;
        const currentStatus =
          ["Initialised", "Prelaunch", "Staking", "Withdrawable", "Dissolved"][
            statusIndex
          ] || "";

        newHasPrelaunchPools = newHasPrelaunchPools || currentStatus === "Prelaunch";
        newHasPoolsToActivate = newHasPoolsToActivate || (canStake ?? false);

        return {
          nodeAddress: address,
          address: validatorAddress.toLowerCase(),
          status: currentStatus,
          statusTime: statusDateTime.toLocaleString(),
          canStake: canStake,
          pubkey: pubkey.pubkey.toLowerCase(),
          index: pubkey.index,
        };
      })
      .filter((pool): pool is ValidatorData => !!pool);

    // prevents update loop
    if (!isEqual(formattedData, validatorData)) {
      setHasPrelaunchPools(newHasPrelaunchPools);
      setHasPoolsToActivate(newHasPoolsToActivate);
      setValidatorData(formattedData);
    }
  }, [
    statusData,
    validatorAddresses,
    address,
    pubkeys,
    validatorData
  ]);

  const error = useMemo(() => {
    return pubkeysError || validatorManagerError || validatorAddressesError || statusError || undefined;
  }, [validatorAddressesError, validatorManagerError, statusError, pubkeysError]);

  const loading = useMemo(() => {
    return pubkeysLoading || managerLoading || validatorAddressesLoading || statusLoading || false;
  }, [pubkeysLoading, managerLoading, validatorAddressesLoading, statusLoading]);

  return {
    validatorData,
    hasPrelaunchPools,
    hasPoolsToActivate,
    loading,
    error,
  };
}
