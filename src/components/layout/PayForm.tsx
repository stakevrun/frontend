import type { FC } from "react";
import type { BaseError } from "wagmi";
import type { PricesStateType, PricingRowType } from "../../hooks/useVrunPrices";
import { FaInfoCircle } from "react-icons/fa";
import { Button, Input } from "@headlessui/react";
import { ETH_TOKEN_ADDRESS } from "../../constants";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";

export const PayForm: FC<{
  onSuccess?: (hash: `0x${string}` | undefined) => void;
  pricesError: string | undefined;
  pricesIsLoading: boolean;
  prices?: PricesStateType;
}> = ({ onSuccess, pricesError, pricesIsLoading, prices }) => {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}`>();
  const [value,                setValue               ] = useState<string | undefined>();
  const [days,                 setDays                ] = useState<number>(0);

  const { chainId } = useAccount();
  const { data: hash, error: sendTransactionError, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(value) {
      const to = "0x99E2b1FB1085C392b9091A5505b0Ac27979501F8";
      sendTransaction({ to, value: parseEther(value) });
    }
  };

  useEffect(() => {
    // Hardcoded for now, should be selectable by user
    setSelectedTokenAddress(ETH_TOKEN_ADDRESS);

    if (prices && prices.pricingRowData && chainId && value) {
      const foundContract = prices.pricingRowData.find((contract: PricingRowType) => {
        return (
          contract.tokenAddress === selectedTokenAddress &&
          contract.tokenChainId === chainId
        );
      });

      if (foundContract) {
        setDays(parseFloat(value) / foundContract.price);
      } else {
        console.warn("No matching contract found.");
        setDays(0);
      }
    }
  }, [value, prices, selectedTokenAddress, chainId]);

  useEffect(() => {
    if (isConfirmed && onSuccess) {
      onSuccess(hash);
      setValue(undefined);
    }
  }, [isConfirmed, onSuccess, hash]);

  useEffect(() => {
    if (sendTransactionError) {
      onSuccess?.(undefined);
      setValue(undefined);
      console.error("Transaction error:", sendTransactionError);
    }
  }, [sendTransactionError, onSuccess]);

  return (
    <div className="panel flex-col">
      <form
        onSubmit={submit}
        className="w-full flex flex-col gap-4 justify-center content-center max-w-md"
      >
        <h2 className="flex">
          <div className="grow">Add ETH Credit:</div>
          <div className="relative group">
            <FaInfoCircle className="text-xl text-yellow-500 cursor-pointer" />
            <div className="absolute hidden group-hover:block z-10 w-80 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-md -top-10 left-0">
              Transfer ETH from your wallet to vr&uuml;n&apos;s Safe wallet. You will be
              prompted to sign the transaction afterwards as well.
            </div>
          </div>
        </h2>
        {pricesError && <span>{pricesError} </span>}
        {!pricesError && !pricesIsLoading && (
          <>
            <Input
              value={value ?? ""}
              className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
              name="amount"
              type="number"
              step="0.001"
              min="0"
              placeholder="Enter ETH amount"
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <div>{days} days</div>
            <Button
              type="submit"
              className="btn-primary self-center"
              disabled={value !== undefined && (isPending || isConfirming || isConfirmed)}
            >
              {isPending || isConfirming ? "Confirming..." : "Buy Credits"}
            </Button>
          </>
        )}
        {pricesIsLoading && (
          <div className="italic">Waiting for prices to load...</div>
        )}
        {pricesError && <div className="italic">Error loading dayprices.</div>}
        {value && isConfirming && (
          <div className="italic">
            Waiting for confirmation, please give it a bit...
          </div>
        )}
        {value && isConfirmed && (
          <div className="italic">
            Transaction confirmed. Waiting for transaction signing
          </div>
        )}
        {sendTransactionError && (
          <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
            {(sendTransactionError as BaseError).shortMessage ||
              sendTransactionError.message}
          </div>
        )}
      </form>
    </div>
  );
};
