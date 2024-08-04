import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Abi } from "abitype";
import { FC, useEffect } from "react";

export const TransactionSubmitter: FC<{
  address: `0x${string}`,
  abi: Abi,
  functionName: string,
  args: Array<any>, // TODO what is the correct type?
  buttonText: string,
  onSuccess?: ((receipt: any) => void) // TODO: use correct receipt type
}> = ({
  address, abi, functionName, args,
  buttonText, onSuccess
}) => {
  const {
    writeContract,
    data: hash,
    error: errorOnWrite,
    isPending,
    isSuccess: isWritten,
  } = useWriteContract();
  const {
    data: receipt,
    error: errorOnWait,
    isLoading,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({hash, query: {enabled: isWritten}});
  const handler = () => {
    writeContract({ address, abi, functionName, args });
  };
  useEffect(() => {
    if (isConfirmed && onSuccess) onSuccess(receipt);
  }, [isConfirmed, receipt]);
  // TODO: also log errors in console somehow
  // TODO: style the button better
  // TODO: should this be a modal instead of div?
  return (
    <div>
      <button
       className="border rounded"
       disabled={isPending || (isWritten && !(errorOnWait || isConfirmed))}
       onClick={handler}>{buttonText}</button>
      {hash && !receipt && <p>Submitted transaction with hash {hash}</p>}
      {receipt && receipt.status == 'success' && <p>{hash} confirmed</p>}
      {receipt && isConfirmed && receipt.status != 'success' && <p>{hash} {receipt.status}</p>}
      {errorOnWrite && <p>Error sending transaction: {errorOnWrite.message}</p>}
      {errorOnWait && <p>Error waiting for transaction confirmation: {errorOnWait.message}</p>}
    </div>
  )
};
