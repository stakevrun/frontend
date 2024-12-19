import { type FC, type ReactNode, useEffect, useState } from "react";
import { type Hash } from "viem";
import { type SignTypedDataReturnType, useAccount, useSignTypedData } from "wagmi";
import { FaInfoCircle } from "react-icons/fa";
import { Button, Input, Popover } from "@headlessui/react";
import { useReadDb } from "../../hooks/useReadDb";
import { useWriteDb } from "../../hooks/useWriteDb";
import { useApiTypes } from "../../hooks/useApiTypes";
import type { UseQueryResult } from "@tanstack/react-query";

export const TransactionSigner: FC<{
  getMessage: () => { Object, String? };
  onError: (hash: String) => void;
  onSuccess: (hash: String) => void;
  buttonText: string;
  path: string;
  primaryType: string;
  disabled: boolean;
}> = ({getMessage, onError, onSuccess, buttonText, path, primaryType, disabled}) => {

  const [isPending, setIsPending] = useState<boolean>(false);

  const {address, chainId}                        = useAccount();
  const {data: typesData, error: typesError}      = useApiTypes();
  const {signTypedDataAsync, error: signingError} = useSignTypedData();

  const {mutateAsync} = useWriteDb({method: 'POST', path, type: primaryType });

  const signTransaction = async (message) => {
    try {
      // Add comment indicating the action has been triggerd by the user through the frontend
      const data = { comment: "Action produced by user through Vrün front end", ...message };
      const {types, domain} = typesData;
      const signature = await signTypedDataAsync({ types, domain, primaryType, message: data });
      if (signingError) return;

      const mutation = await mutateAsync({ signature, data });
      console.log(mutation);
      if (!mutation.ok) {
        onError(await mutation.text());
      } else {
        onSuccess(await mutation.text());
      }
    } catch (e) {
      onError(e.message);
      console.warn("Error signing transaction:", e);
    }
  };

  const handler = () => {
    onError(undefined);
    const message = getMessage();
    if(message) {
      setIsPending(true);
      console.log("Message");
      console.log(message);
      signTransaction(message).then(() => setIsPending(false));
    }
  };

  return (
    <Button
      className="btn-primary self-center"
      disabled={disabled || isPending}
      onClick={handler}
    >
      {isPending ? 'Signing...' : buttonText}
    </Button>
  );
};
