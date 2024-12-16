import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChainId, useReadContracts } from "wagmi";
import { type ContractFunctionParameters, formatUnits } from "viem";
import { FEE_URL, ETH_TOKEN_ADDRESS } from "../constants";

export function useVrunPrices() {
  const chainId = useChainId();

  type pricesPerDayByTokenType = {[tokenAddress: `0x${string}`]: bigint};
  type pricesPerDayType = {[chainId: string]: pricesPerDayByTokenType};
  interface pricingRowType {
    tokenDecimals: number,
    tokenName: string,
    tokenSymbol: string,
    tokenAddress: `0x${string}`,
    tokenChainId: number,
    price: bigint
  };
  interface pricesStateType {
    validUntil: number | "now",
    pricesPerDay: pricesPerDayType,
    pricingRowData: pricingRowType[],
    contractReads: ContractFunctionParameters[],
    tokenToIndex: {[key: string]: number},
  };
  interface readTokenInput {
    functionName: string,
    outputType: string
  };

  const [prices, setPrices] = useState<pricesStateType | undefined>();
  const [error, setError ] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractReads, setContractReads] = useState();

  const queryKey = ['vrün-fee', chainId, 'prices'];
  const url = `${FEE_URL}/${chainId}/prices`;
  const queryFn = () => fetch(url).then(async r => {
    if (r.status === 200) return r.json();
    else throw new Error(`${r.status} error fetching prices: ${await r.text()}`);
  });
  const {
    data: pricesData,
    error: pricesError,
    status: pricesStatus,
    isLoading: pricesIsLoading
  } = useQuery({queryKey, queryFn});
  const {
    data: contracts,
    error: readContractError,
    status: readContractStatus,
    isLoading: readContractsIsLoading
  } = useReadContracts({contracts: contractReads});

  useEffect(() => {
    setIsLoading(pricesIsLoading || readContractsIsLoading);
  }, [pricesIsLoading, readContractsIsLoading]);

  useEffect(() => {
    if(pricesError) {
      setError(`Error reading prices api: ${pricesError.message}`);
    }
    if(readContractError) {
      setError(`Error reading token contracts: {readContractError.message}`);
    }

    if (!pricesData) return;

    const { validUntil, pricesPerDay }: { validUntil: number | "now", pricesPerDay: pricesPerDayType } = pricesData;

    let currentIndex = 0;
    const tokenToIndex: {[key: string]: number} = {};

    setContractReads(Object.entries(pricesPerDay).flatMap(
      ([tokenChainId, chainPrices]: [string, pricesPerDayByTokenType]) => Object.entries(chainPrices).flatMap(
        ([tokenAddress, price]: [string, bigint]) => {
          const readToken = ({functionName, outputType}: readTokenInput) => ({
            chainId: tokenChainId,
            address: tokenAddress as `0x${string}`,
            abi: [{name: functionName, type: "function" as const, stateMutability: "view" as const, inputs: [], outputs: [{name: functionName, type: outputType}]}],
            functionName
          });
          if (tokenAddress == ETH_TOKEN_ADDRESS) return [];
          tokenToIndex[`${tokenChainId}:${tokenAddress}`] = currentIndex;
          currentIndex += 3;
          return [
            readToken({functionName: "decimals", outputType: "uint8"}),
            readToken({functionName: "name", outputType: "string"}),
            readToken({functionName: "symbol", outputType: "string"}),
          ];
        }
      )
    ));

    if (!contracts) return;

    const pricingRowData = Object.entries(pricesPerDay).flatMap(
      ([tokenChainId, chainPrices]: [string, pricesPerDayByTokenType]) =>
      Object.entries(chainPrices).map(
        ([tokenAddress, price]: [string, bigint]) => {
          const [tokenDecimals, tokenName, tokenSymbol] = tokenAddress == ETH_TOKEN_ADDRESS ?
            [{result: 18, status: "success"}, {result: 'Ether', status: "success"}, {result: 'ETH', status: "success"}] :
            (() => {
              const index = tokenToIndex[`${tokenChainId}:${tokenAddress}`] || 0;
              return contracts.slice(index, index + 3);
            })();

          return ({
            tokenDecimals,
            tokenName,
            tokenSymbol,
            tokenChainId: Number(tokenChainId),
            tokenAddress: tokenAddress as `0x${string}`,
            price: formatUnits(price, tokenDecimals.result as number),
          });
        }
      )
    );

    setPrices({
      validUntil,
      pricesPerDay,
      pricingRowData,
    });
  }, [chainId, pricesData, contracts, pricesError, readContractError]);

  return { prices, error, isLoading };
};
