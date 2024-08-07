import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useChainId, useReadContracts } from "wagmi";
import { type ContractFunctionParameters, formatUnits } from "viem";

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

  useEffect(() => {
    // TODO: error handling
    const getPricing = async () => {
      const { validUntil, pricesPerDay }: { validUntil: number | "now", pricesPerDay: pricesPerDayType } = await fetch(
        `https://fee.vrün.com/${chainId}/prices`
      ).then((r) => {
        return r.json();
      });

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
      })
    };

    getPricing();
  }, [chainId]);

  const {data: results, error, status} = useReadContracts({contracts: prices?.contractReads});

  return (
    <div>
      <h1>Pricing</h1>
      {error ? <p>Error reading token contracts: {error.message}</p> :
       prices && results ? (
        <table>
          <thead>
            <tr>
              <th>Payment Token Chain</th>
              <th>Payment Token</th>
              <th>Validator Day Price</th>
            </tr>
          </thead>
          <tbody>
          {prices.pricingRowData.map(({tokenChainId, tokenAddress, price}) => {
            const [tokenDecimals, tokenName, tokenSymbol] = tokenAddress == nullAddress ?
              [{result: 18}, {result: 'Ether'}, {result: 'ETH'}] :
              (() => {
                const index = prices.tokenToIndex[`${tokenChainId}:${tokenAddress}`];
                return results.slice(index, index + 3);
              })();
            return (
              <tr>
                <td>{tokenChainId.toString()}</td>
                <td>{tokenName.result as string} {tokenAddress != nullAddress && `(${tokenAddress})`}</td>
                <td>{formatUnits(price, tokenDecimals.result as number)} {tokenSymbol.result as string}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      ) : <p>Reading payment token info... (status={status})</p>}
    </div>
  );
};

export default Pricing;
