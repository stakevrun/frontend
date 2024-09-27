import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChainId, useReadContracts } from "wagmi";
import { type ContractFunctionParameters, formatUnits } from "viem";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/layout/table";

const nullAddress = '0x'.padEnd(42, '0');

// work in progress
const Pricing: NextPage = () => {
  const chainId = useChainId();

  type pricesPerDayByTokenType = {[tokenAddress: `0x${string}`]: bigint};
  type pricesPerDayType = {[chainId: string]: pricesPerDayByTokenType};
  interface pricingRowType {tokenAddress: `0x${string}`, tokenChainId: number, price: bigint};
  interface pricesStateType {
    validUntil: number | "now",
    pricesPerDay: pricesPerDayType,
    pricingRowData: pricingRowType[],
    contractReads: ContractFunctionParameters[],
    tokenToIndex: {[key: string]: number},
  }

  const [prices, setPrices] = useState<pricesStateType | undefined>();

  const queryKey = ['vrün-fee', chainId, 'prices'];
  const url = `https://fee.vrün.com/${chainId}/prices`;
  const queryFn = () => fetch(url).then(async r => {
    if (r.status === 200) return r.json();
    else throw new Error(`${r.status} error fetching prices: ${await r.text()}`);
  });
  const { data: pricesData, error: pricesError } = useQuery({queryKey, queryFn});

  useEffect(() => {
    if (!pricesData) return;

    const { validUntil, pricesPerDay }:
          { validUntil: number | "now", pricesPerDay: pricesPerDayType } = pricesData;

    const pricingRowData =
      Object.entries(pricesPerDay).flatMap(
        ([tokenChainId, chainPrices]: [string, pricesPerDayByTokenType]) =>
        Object.entries(chainPrices).map(
          ([tokenAddress, price]: [string, bigint]) => (
            {
              tokenChainId: Number(tokenChainId),
              tokenAddress: tokenAddress as `0x${string}`,
              price,
            }
          )
        )
    );

    let currentIndex = 0;
    const tokenToIndex: {[key: string]: number} = {};

    const contractReads =
      pricingRowData.flatMap(
        ({tokenChainId, tokenAddress}) => {
          interface readTokenInput {functionName: string, outputType: string};
          const readToken = ({functionName, outputType}: readTokenInput) => ({
            chainId: tokenChainId,
            address: tokenAddress as `0x${string}`,
            abi: [{name: functionName, type: "function" as const, stateMutability: "view" as const, inputs: [], outputs: [{name: functionName, type: outputType}]}],
            functionName
          });
          if (tokenAddress == nullAddress) return [];
          tokenToIndex[`${tokenChainId}:${tokenAddress}`] = currentIndex;
          currentIndex += 3;
          return [
            readToken({functionName: "decimals", outputType: "uint8"}),
            readToken({functionName: "name", outputType: "string"}),
            readToken({functionName: "symbol", outputType: "string"}),
          ];
        }
    );

    setPrices({
      validUntil,
      pricesPerDay,
      pricingRowData,
      contractReads,
      tokenToIndex,
    });
  }, [chainId, pricesData]);

  const {data: results, error, status} = useReadContracts({contracts: prices?.contractReads});

  return (
    <div className="max-w-full md:px-10">
      <h1 className="my-16 text-xl self-center text-center md:text-2xl lg:text-3xl xl:text-4xl font-bold">Pricing</h1>
      {error ? <p>Error reading token contracts: {error.message}</p> :
       pricesError ? <p>Error reading prices api: {pricesError.message}</p> :
       prices && results ? (
        <Table className="px-6">
          <TableHead>
            <TableRow>
              <TableHeader>Payment Token Chain</TableHeader>
              <TableHeader className="hidden sm:table-cell">Payment Token</TableHeader>
              <TableHeader>Validator Day Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
          {prices.pricingRowData.map(({tokenChainId, tokenAddress, price}, i) => {
            const [tokenDecimals, tokenName, tokenSymbol] = tokenAddress == nullAddress ?
              [{result: 18}, {result: 'Ether'}, {result: 'ETH'}] :
              (() => {
                const index = prices.tokenToIndex[`${tokenChainId}:${tokenAddress}`] || 0;
                return results.slice(index, index + 3);
              })();
            return (
              <TableRow key={i}>
                <TableCell>{tokenChainId.toString()}</TableCell>
                <TableCell className="hidden sm:table-cell">{tokenName.result as string} {tokenAddress != nullAddress && `(${tokenAddress})`}</TableCell>
                <TableCell>{formatUnits(price, tokenDecimals.result as number)} {tokenSymbol.result as string}</TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      ) : <p>Reading payment token info... (status={status})</p>}
    </div>
  );
};

export default Pricing;
