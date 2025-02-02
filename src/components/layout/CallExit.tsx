import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import { useWriteBeaconNode } from "../../hooks/useWriteBeaconNode";
import { TransactionSigner } from "../layout/TransactionSigner";

export const CallExit: FC<{
  onSubmit: (result: string | undefined, error: string | undefined, hasError: boolean) => void;
  pubkey: `0x${string}`;
  validatorIndex: number | undefined;
  index: number;
  epoch: number;
}> = ({ onSubmit, pubkey, validatorIndex, index, epoch }) => {
  const [data,      setData      ] = useState<string | undefined>();
  const [error,     setError     ] = useState<string>();
  const [isPending, setIsPending ] = useState<boolean>(false);

  const { mutateAsync } = useWriteBeaconNode({ method: "POST", path: "eth/v1/beacon/pool/voluntary_exits" });

  const getMessage =  useCallback(() => {
    onSubmit("Waiting for message signature...", undefined, false);
    return {
      pubkey,
      epoch,
      validatorIndex,
    };
  }, [pubkey, validatorIndex, onSubmit, epoch]);

  const broadcastExit = useCallback(async (data: any) => {
    onSubmit("Sending voluntary exit message...", undefined, false);
    try {
      const mutation = await mutateAsync(data);
      if (!mutation.ok) {
        setError(await mutation.text());
      } else {
        setData(undefined);
        onSubmit("Validator exit request success.", undefined, false);
        setIsPending(false);
      }
    } catch (e) {
      let message: string = "An unknown error occurred.";
      if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      setError(message);
      console.warn("Error signing transaction:", e);
    }
  }, [mutateAsync, onSubmit]);

  useEffect(() => {
    if (error) {
      onSubmit(
        undefined,
        `An error occured: ${error}`,
        true,
      );
    } else if (data) {
      setIsPending(true);
      const result = JSON.parse(data);

      console.log(result);

      broadcastExit(result)
        .catch((err) => {
          onSubmit(
            undefined,
            `An error occured while trying to broadcast the validator exit: ${err}`,
            true,
          );
        });
    }
  }, [data, error, broadcastExit, onSubmit]);

  return (
    <TransactionSigner
      onError={setError}
      onSuccess={setData}
      getMessage={getMessage}
      buttonText={
        isPending ? "Pending..." :
        "Exit Validator"
      }
      path={index}
      primaryType="GetPresignedExit"
      disabled={isPending}
    />
  );
};
