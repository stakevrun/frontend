import type { Abi } from "abitype";
import type { FC } from "react";
import type { ContractFunctionArgs, TransactionReceipt } from "viem";
import { Button } from "@headlessui/react";
import { useEffect, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export const TransactionSubmitter: FC<{
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: ContractFunctionArgs;
  buttonText: string;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (message: string | undefined) => void;
  validate?: () => boolean;
}> = ({ address, abi, functionName, args, buttonText, onError, onSuccess, validate }) => {
  const {
    writeContractAsync,
    data: hash,
    error: errorOnWrite,
    isPending,
    isSuccess: isWritten,
  } = useWriteContract();

  const addRecentTransaction = useAddRecentTransaction();

  const {
    data: receipt,
    error: errorOnWait,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash, query: { enabled: isWritten } });

  const handler = useCallback(async () => {
    if (!validate || validate()) {
      try {
        const hash = await writeContractAsync({ address, abi, functionName, args });
        addRecentTransaction({ hash, description: functionName });
      } catch (e) {
        let message: string = "";
        if (typeof e === "string") {
          message = e;
        } else if (e instanceof Error) {
          message = e.message;
        }
        if(onError) onError(message.split("\n", 2).join("\n")); // Only get the first line, don't need the full stacktrace
      }
    }
  }, [onError, writeContractAsync, addRecentTransaction, validate, address, abi, functionName, args]);

  useEffect(() => {
    if (errorOnWrite && onError) {
      onError(`Error sending transaction: ${errorOnWrite.message.split("\n", 2).join("\n")}`);
    }
    if (errorOnWait && onError) {
      onError(`Error waiting for transaction confirmation: ${errorOnWait.message.split("\n", 2).join("\n")}`);
    }
    if (receipt && isConfirmed && receipt.status != "success" && onError) {
      onError(`${hash} ${receipt.status}`);
    }
  }, [onError, errorOnWrite, errorOnWait, receipt, isConfirmed, hash]);

  useEffect(() => {
    if (isConfirmed && onSuccess) onSuccess(receipt);
  }, [isConfirmed, onSuccess, receipt]);

  return (
    <div className="flex flex-col max-w-md">
      <Button
        className="btn-primary self-end"
        disabled={isPending || (isWritten && !(errorOnWait || isConfirmed))}
        onClick={handler}
      >
        {buttonText}
      </Button>
    </div>
  );
};
