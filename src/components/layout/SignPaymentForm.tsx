import type { FC } from "react";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Button, Input } from "@headlessui/react";

export const SignPaymentForm: FC<{
  setPayHash: (hash: `0x${string}` | undefined) => void;
  payHash: string | undefined;
}> = ({ setPayHash, payHash }) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [value,     setValue    ] = useState<string | undefined>();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (!value) {
        throw new Error("Transaction hash is required");
      }

      setPayHash(value as `0x${string}`);
    } catch (error) {
      setPayHash(undefined);
      console.error("Sign error:", error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if(payHash && value !== payHash) {
      setValue(payHash);
    }
  }, [payHash, value]);

  return (
    <div className="panel flex-col">
      <form
        onSubmit={submit}
        className="w-full flex flex-col gap-4 justify-center content-center max-w-md"
      >
        <h2 className="flex">
          <div className="grow">Sign transaction:</div>
          <div className="relative group">
            <FaInfoCircle className="text-xl text-yellow-500 cursor-pointer" />
            <div className="absolute hidden group-hover:block z-10 w-80 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-md -top-10 left-0">
              Sign transaction hash containing a transfer of ETH from your
              wallet to vr&uuml;n&apos;s Safe wallet.
            </div>
          </div>
        </h2>
        <Input
          value={value ?? ""}
          className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
          name="transaction"
          type="string"
          placeholder="Enter transaction hash"
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="btn-primary self-center"
          disabled={isPending || payHash !== undefined}
        >
          {isPending || payHash ? "Signing..." : "Sign Payment Transaction"}
        </Button>
      </form>
    </div>
  );
};
