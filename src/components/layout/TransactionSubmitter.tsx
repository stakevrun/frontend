import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { type Abi } from "abitype";
import { type FC, useEffect } from "react";
import { Button } from "@headlessui/react";
import { type ContractFunctionArgs, type TransactionReceipt } from "viem";

export const TransactionSubmitter: FC<{
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: ContractFunctionArgs; // I think this is right?
  buttonText: string;
  onSuccess?: (receipt: TransactionReceipt) => void;
  validate?: () => boolean;
}> = ({ address, abi, functionName, args, buttonText, onSuccess, validate }) => {
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
    if(!validate || validate()) {
      writeContractAsync({ address, abi, functionName, args }).then((hash) =>
        addRecentTransaction({ hash, description: functionName })
      );
    }
  };

  const hasError = () => {
    if ((receipt && isConfirmed && receipt.status != "success") || errorOnWrite || errorOnWait) {
      return true
    }

    return false
  };

  const errorMessage = () => {
    if (receipt && isConfirmed && receipt.status != "success") {
      return `${hash} ${receipt.status}`
    }
    if(errorOnWrite) {
      return `Error sending transaction: ${errorOnWrite.message}`
    }
    if(errorOnWait) {
      return `Error waiting for transaction confirmation: ${errorOnWait.message}`
    }
  };

  useEffect(() => {
    if (isConfirmed && onSuccess) onSuccess(receipt);
  }, [isConfirmed, onSuccess, receipt, errorOnWait, errorOnWrite]); // TODO: move to handler?

  // TODO: also log errors in console somehow
  // TODO: should this be a modal instead of div?
  // TODO: allow customisation on when it should be disabled (e.g. allow duplicate or not)
  return (
    <div className="flex flex-col max-w-md">
      <Button
        className="btn-primary self-end"
        disabled={isPending || (isWritten && !(errorOnWait || isConfirmed))}
        onClick={handler}
      >
        {buttonText}
      </Button>
      <div className={'whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4 ' + (hasError() ? 'visible' : 'invisible' )}>
        {errorMessage()}
      </div>
      <div className={'whitespace-pre-wrap break-words mt-4 border border-green-500 rounded p-4 ' + ((hash || receipt) && !hasError() ? 'visible' : 'invisible' )}>
        {hash && !receipt && <p>Submitted transaction with hash {hash}</p>}
        {receipt && receipt.status == "success" && <p>{hash} confirmed</p>}
      </div>
    </div>
  );
};
