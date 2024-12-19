import { type FC, type ReactNode, useEffect, useState } from "react";
import { useSignTypedData } from "wagmi";
import { FaInfoCircle } from "react-icons/fa";
import { Button, Input, Popover } from "@headlessui/react";
import { useReadFee } from "../../hooks/useReadFee";
import { useWriteFee } from "../../hooks/useWriteFee";
import { useFeeApiTypes } from "../../hooks/useApiTypes";
import type { UseQueryResult } from "@tanstack/react-query";

export const SignPaymentForm: FC<{
  setPayHash: (hash: String) => void;
  payHash: string;
}> = ({setPayHash, payHash}) => {

  const [isPending, setIsPending] = useState(false);
  const [signError, setSignError] = useState();
  const [value,     setValue]     = useState(payHash || "");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSignError(undefined);
    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const value = formData.get('transaction') as string;

    setPayHash(value);
    setIsPending(false);
  };

  useEffect(() => {
    setValue(payHash);
  }, [payHash]);

  return (
    <div className="panel flex-col">
      <form onSubmit={submit} className="w-full flex flex-col gap-4 justify-center content-center max-w-md">
        <h2 className="flex">
          <div className="grow">Sign transaction:</div>
          <div className="relative group">
            <FaInfoCircle className="text-xl text-yellow-500 cursor-pointer" />
            <div className="absolute hidden group-hover:block z-10 w-80 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-md -top-10 left-0">
              Sign transaction hash containing a transfer of ETH from your wallet to vrün's Safe wallet.
            </div>
          </div>
        </h2>
        <Input
          value={value}
          className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
          name="transaction"
          type="string"
          placeholder="Enter transaction hash"
          onChange={ e => setValue(e.target.value)}
          required
        />
        <Button type="submit" className="btn-primary self-center" disabled={isPending || payHash} >
          {isPending || payHash ? 'Signing...' : 'Sign Payment Transaction'}
        </Button>
      </form>
    </div>
  );
};
