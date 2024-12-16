import { type FC, type ReactNode, useEffect, useState } from "react";
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { type TransactionReceipt, parseEther } from 'viem'
import { FaInfoCircle } from "react-icons/fa";
import { Button, Input, Popover } from "@headlessui/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { ETH_TOKEN_ADDRESS } from '../../constants';

export const PayForm: FC<{
  onSuccess?: (hash: String) => void;
  pricesError: boolean;
  pricesIsLoading: boolean;
  prices?: object;
}> = ({onSuccess, pricesError, pricesIsLoading, prices}) => {

  const [value,                setValue]                 = useState("");
  const [days,                 setDays]                  = useState(0);
  const [selectedTokenAddress, setSelectedTokenAddress ] = useState(ETH_TOKEN_ADDRESS); // Hardcoded for now, should be selectable by user

  const {data: hash, error: sendTransactionError, isPending, sendTransaction} = useSendTransaction();
  const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({ hash });
  const {address, chainId} = useAccount();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = '0x99E2b1FB1085C392b9091A5505b0Ac27979501F8';
    sendTransaction({ to, value: parseEther(value) });
  };

  const inputChanged = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if(prices) {
      setDays(value / prices.pricingRowData.find((contract) => {
          return contract.tokenAddress === selectedTokenAddress && contract.tokenChainId === chainId;
        }).price);
    }
  }, [value, prices, selectedTokenAddress]);

  useEffect(() => {
    console.log("prices");
    console.log(prices);
    if (isConfirmed && onSuccess) onSuccess(hash);
  }, [isConfirmed, onSuccess, hash, sendTransactionError, prices]);

  useEffect(() => {
    setValue("");
  }, [isConfirmed]);

  return (
    <div className="panel flex-col">
      <form onSubmit={submit} className="w-full flex flex-col gap-4 justify-center content-center max-w-md">
        <h2 className="flex">
          <div className="grow">Add ETH Credit:</div>
          <div className="relative group">
            <FaInfoCircle className="text-xl text-yellow-500 cursor-pointer" />
            <div className="absolute hidden group-hover:block z-10 w-80 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-md -top-10 left-0">
              Transfer ETH from your wallet to vrün's Safe wallet. You will be prompted to sign the transaction afterwards as well.
            </div>
          </div>
        </h2>
        {pricesError && <span>{pricesError.message} </span>}
        {!pricesError && !pricesIsLoading && (
        <>
        <Input
          value={value}
          className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
          name="amount"
          type="number"
          step="0.001"
          placeholder="Enter ETH amount"
          onChange={inputChanged}
          required
        />
        <div>{days} days</div>
        <Button type="submit" className="btn-primary self-center" disabled={value && (isPending || isConfirming || isConfirmed)}>
          {isPending || isConfirming ? 'Confirming...' : 'Buy Credits'}
        </Button>
        </>)}
        {pricesIsLoading && <div className="italic">Waiting for prices to load...</div>}
        {pricesError && <div className="italic">Error loading dayprices.</div>}
        {value && isConfirming && <div className="italic">Waiting for confirmation...</div>}
        {value && isConfirmed && <div className="italic">Transaction confirmed. Waiting for transaction signing</div>}
        {sendTransactionError && (
        <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
          {(sendTransactionError as BaseError).shortMessage || sendTransactionError.message}
        </div>
        )}
      </form>
    </div>
  );
};
