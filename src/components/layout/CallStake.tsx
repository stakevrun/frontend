import type { FC } from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { abi } from "../../abi/miniManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { TransactionSigner } from "../layout/TransactionSigner";

export const CallStake: FC<{
  onSubmit: (result: string | undefined, error: string | undefined, hasError: boolean) => void;
  pubkey: `0x${string}`;
  validatorAddress: `0x${string}`;
  index: number;
}> = ({ onSubmit, pubkey, validatorAddress, index }) => {
  const stakeAbi = useMemo(() => {
    return [
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
        stateMutability: "nonpayable",
      },
    ] as const;
  }, []);

  const [signData,  setSignData ] = useState<string>();
  const [signError, setSignError] = useState<string>();
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    data: writeContractData,
    error: writeContractError,
    isPending: writeContractPending,
    isSuccess: isWritten,
    writeContractAsync,
  } = useWriteContract();
  const {
    error: transactionReceiptError,
    isSuccess: transactionReceiptIsSuccess,
  } = useWaitForTransactionReceipt({ hash: writeContractData, query: { enabled: isWritten } });
  const {
    data: validatorManagerAddress,
    error: validatorManagerError,
  } = useRocketAddress("rocketMinipoolManager");
  const {
    data: withdrawalCredentials,
    error: withdrawalCredentialsError,
  } = useReadContract({
    address: validatorManagerAddress,
    abi,
    functionName: "getMinipoolWithdrawalCredentials",
    args: [validatorAddress],
  });

  const getMessage =  useCallback(() => {
    if(validatorManagerError || withdrawalCredentialsError) {
      return { message: undefined, error: "Could not load withdrawal credentials."};
    }
    if (validatorAddress && pubkey && withdrawalCredentials) {
      onSubmit("Waiting for message signature...", undefined, false);
      return {
        amountGwei: parseInt(parseUnits("31", 9).toString()), // 31 ETH in gwei
        withdrawalCredentials: withdrawalCredentials,
        pubkey,
      };
    } else {
      return { message: undefined, error: "Could not get all data" };
    }
  }, [withdrawalCredentials, withdrawalCredentialsError, validatorManagerError, validatorAddress, pubkey, onSubmit]);

  const writeContract = useCallback(async (data: any) => {
    onSubmit("Waiting for contract call approval...", undefined, false);
    try {
      const transactionHash = await writeContractAsync(data);
      onSubmit(
        `Transaction created with hash: ${transactionHash}`,
        undefined,
        false,
      );
    } catch (e) {
      let message: string = "";
      if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      throw message.split("\n", 2).join("\n"); // Only get the first line, don't need the full stacktrace
    }
  }, [onSubmit, writeContractAsync]);

  useEffect(() => {
    if (signError) {
      onSubmit(
        undefined,
        `An error occured while trying to sign the validator request: ${signError}`,
        true,
      );
    } else if (signData) {
      //onSubmit(signData, undefined, false);
      setIsPending(true);
      const result = JSON.parse(signData);

      const { signature, depositDataRoot } = result;

      const contractData = {
        abi: stakeAbi,
        address: validatorAddress as `0x${string}`,
        functionName: "stake",
        args: [signature as `0x${string}`, depositDataRoot as `0x${string}`],
      };

      writeContract(contractData)
        .catch((err) => {
          onSubmit(
            undefined,
            `An error occured while trying to sign the validator stake transaction: ${err}`,
            true,
          );
        });
    }
  }, [signData, signError, validatorAddress, writeContract, onSubmit, stakeAbi]);

  useEffect(() => {
      if(transactionReceiptError) {
        let message: string = "An error occurred waiting on the transaction confirmation.";
        if (typeof transactionReceiptError === "string") {
          message = transactionReceiptError;
        } else if (transactionReceiptError instanceof Error) {
          message = transactionReceiptError.message;
        }
        onSubmit(undefined, message, true);
      }
      if(transactionReceiptIsSuccess) {
        onSubmit("Validator stake called succesfully!", undefined, false);
      }
      setIsPending(false);
  }, [transactionReceiptError, transactionReceiptIsSuccess, onSubmit]);

  useEffect(() => {
    if(writeContractError) {
      onSubmit(undefined, `An error occured while trying to sign the validator stake action: ${writeContractError}`, true);
    }
  }, [writeContractError, onSubmit]);

  return (
    <TransactionSigner
      onError={setSignError}
      onSuccess={setSignData}
      getMessage={getMessage}
      buttonText={
        isWritten && !transactionReceiptIsSuccess ? "Confirming..." :
        isPending || writeContractPending ? "Pending..." :
        "Stake"
      }
      path={index}
      primaryType="GetDepositData"
      disabled={isPending || writeContractPending}
    />
  );
};
