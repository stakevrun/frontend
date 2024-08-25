import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { Abi } from "abitype";
import { FC, useEffect } from "react";
import { Button } from "@headlessui/react";
import { ContractFunctionArgs } from "viem";

export const TransactionSubmitter: FC<{
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: ContractFunctionArgs; // I think this is right?
  buttonText: string;
  onSuccess?: (receipt: any) => void; // TODO: use correct receipt type
}> = ({ address, abi, functionName, args, buttonText, onSuccess }) => {
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
    isLoading,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash, query: { enabled: isWritten } });

  const handler = () => {
    writeContractAsync({ address, abi, functionName, args }).then((hash) =>
      addRecentTransaction({ hash, description: functionName })
    );
  };

  useEffect(() => {
    if (isConfirmed && onSuccess) onSuccess(receipt);
  }, [isConfirmed, onSuccess, receipt]); // TODO: move to handler?

  // TODO: also log errors in console somehow
  // TODO: should this be a modal instead of div?
  // TODO: allow customisation on when it should be disabled (e.g. allow duplicate or not)
  return (
    <div>
      <Button
        className="btn-primary"
        disabled={isPending || (isWritten && !(errorOnWait || isConfirmed))}
        onClick={handler}
      >
        {buttonText}
      </Button>
      {hash && !receipt && <p>Submitted transaction with hash {hash}</p>}
      {receipt && receipt.status == "success" && <p>{hash} confirmed</p>}
      {receipt && isConfirmed && receipt.status != "success" && (
        <p>
          {hash} {receipt.status}
        </p>
      )}
      {errorOnWrite && <p>Error sending transaction: {errorOnWrite.message}</p>}
      {errorOnWait && (
        <p>Error waiting for transaction confirmation: {errorOnWait.message}</p>
      )}
    </div>
  );
};
