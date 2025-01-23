import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { abi } from "../../abi/miniManagerABI";
import { type FC, useEffect, useState } from "react";
import { TransactionSigner } from "../layout/TransactionSigner";
import { useRocketAddress } from "../../hooks/useRocketAddress";

export const CallStake: FC<{
  onSubmit: (result: String, error: String, hasError: bool) => void;
  pubkey: String;
  validatorAddress: String;
  index: Number;
}> = ({ onSubmit, pubkey, validatorAddress, index }) => {
  const { address, chainId } = useAccount();
  const {
    data: writeContractData,
    error: writeContractError,
    status: writeContractStatus,
    isPending: writeContractPending,
    writeContractAsync,
  } = useWriteContract();
  const {
    data: validatorManagerAddress,
    error: validatorManagerError,
    isLoading: managerLoading,
  } = useRocketAddress("rocketMinipoolManager");
  const {
    data: withdrawalCredentials,
    error: withdrawalCredentialsError,
    isLoading: withdrawalCredentialsIsLoading,
  } = useReadContract({
    address: validatorManagerAddress,
    abi,
    functionName: "getMinipoolWithdrawalCredentials",
    args: [validatorAddress],
  });

  const [signData, setSignData] = useState();
  const [signError, setSignError] = useState();
  const [isPending, setIsPending] = useState(false);

  const getMessage = () => {
    console.log("withdrawalCredentials:", withdrawalCredentials);
    console.log("validatorManagerAddress:", validatorManagerAddress);
    if (validatorAddress && pubkey && withdrawalCredentials) {
      onSubmit("Waiting for message signature...", null, false);
      return {
        amountGwei: parseInt(parseUnits("31", 9)), // 31 ETH in gwei
        withdrawalCredentials: withdrawalCredentials,
        pubkey,
      };
    } else {
      return { message: null, error: "Could not get all data" };
    }
  };

  const writeContract = async (message) => {
    onSubmit("Waiting for contract call approval...", null, false);
    try {
      const transactionHash = await writeContractAsync(message);
      console.log(transactionHash);
      onSubmit(
        `Transaction created with hash: ${transactionHash}`,
        null,
        false,
      );
    } catch (e) {
      console.warn("Error calling contract:", e, "With message:", message);
      throw e.message.split("\n", 2).join("\n"); // Only get the first line, don need the full stacktrace
    }
  };

  useEffect(() => {
    if (signError) {
      onSubmit(
        null,
        `An error occured while trying to sign the validator request: ${signError}`,
        true,
      );
    } else if (signData) {
      //onSubmit(signData, null, false);
      setIsPending(true);
      let result = JSON.parse(signData);

      console.log(result);
      const { signature, depositDataRoot } = result;

      const contractData = {
        abi: [
          {
            name: "stake",
            type: "function",
            inputs: [
              {
                name: "_validatorSignature",
                internalType: "bytes",
                type: "bytes",
              },
              {
                name: "_depositDataRoot",
                internalType: "bytes32",
                type: "bytes32",
              },
            ],
            outputs: [],
          },
        ],
        address: validatorAddress,
        functionName: "stake",
        args: [signature, depositDataRoot],
      };

      console.log("Will call contract with data: ", contractData);
      writeContract(contractData)
        .catch((err) => {
          onSubmit(
            null,
            `An error occured while trying to sign the validator stake transaction: ${err}`,
            true,
          );
        })
        .finally(() => setIsPending(false));
    }
  }, [signData, signError]);

  return (
    <TransactionSigner
      onError={setSignError}
      onSuccess={setSignData}
      getMessage={getMessage}
      buttonText="Stake"
      path={index}
      primaryType="GetDepositData"
      disabled={isPending || writeContractPending}
    />
  );
};
