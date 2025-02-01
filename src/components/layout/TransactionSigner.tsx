import type { FC } from "react";
import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useSignTypedData, } from "wagmi";
import { useWriteDb } from "../../hooks/useWriteDb";
import { useApiTypes } from "../../hooks/useApiTypes";

export const TransactionSigner: FC<{
  getMessage: () => Record<string, unknown>;
  onError: (message: string | undefined) => void;
  onSuccess: (hash: string) => void;
  buttonText: string;
  path?: number | "batch" | "credit";
  primaryType: string;
  disabled: boolean;
}> = ({ getMessage, onError, onSuccess, buttonText, path, primaryType, disabled }) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const {data: typesData, error: typesError}      = useApiTypes();
  const {signTypedDataAsync, error: signingError} = useSignTypedData();

  const { mutateAsync } = useWriteDb({
    method: "POST",
    path,
    type: primaryType,
  });

  useEffect(() => {
    if (typesError) {
      let message: string = "An error occurred.";
      if (typeof typesError === "string") {
        message = typesError;
      } else if (typesError instanceof Error) {
        message = typesError.message;
      }
      onError(message);
    }
  }, [typesError, onError]);

  const signTransaction = async (message: Record<string, unknown>) => {
    try {
      // Add comment indicating the action has been triggerd by the user through the frontend
      const data = {
        comment: "Action produced by user through Vrün front end",
        ...message,
      };
      const { types, domain } = typesData;
      const signature = await signTypedDataAsync({
        types,
        domain,
        primaryType,
        message: data,
      });
      if (signingError) {
        let message: string = "An error occurred during the signing process.";
        if (typeof signingError === "string") {
          message = signingError;
        } else if (signingError instanceof Error) {
          message = signingError.message;
        }
        onError(message);
        return;
      }

      const mutation = await mutateAsync({ signature, data });
      console.log(mutation);
      if (!mutation.ok) {
        onError(await mutation.text());
      } else {
        onSuccess(await mutation.text());
      }
    } catch (e) {
      let message: string = "An error occurred during the signing process.";
      if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      onError(message);
      console.warn("Error signing transaction:", message);
    }
  };

  const handler = () => {
    onError(undefined);
    const message: Record<string, unknown> = getMessage();
    if (message) {
      setIsPending(true);
      signTransaction(message).then(() => setIsPending(false));
    }
  };

  return (
    <Button
      className="btn-primary self-center"
      disabled={disabled || isPending}
      onClick={handler}
    >
      {isPending ? "Signing..." : buttonText}
    </Button>
  );
};
