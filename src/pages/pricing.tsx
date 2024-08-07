import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useChainId, useReadContracts } from "wagmi";
import { type ContractFunctionParameters, formatUnits } from "viem";

// work in progress
const Pricing: NextPage = () => {
  const chainId = useChainId();
  const [validUntil, setValidUntil] = useState<number | "now" | undefined>();
  const [pricesPerDay, setPricesPerDay] = useState({}); // TODO: create type

  useEffect(() => {
    // TODO: error handling
    const getPricing = async () => {
      const { validUntil, pricesPerDay } = await fetch(
        `https://fee.vrün.com/${chainId}/prices`
      ).then((r) => {
        return r.json();
      });

      setValidUntil(validUntil);
      setPricesPerDay(pricesPerDay);
    };

    getPricing();
  }, [chainId]);

  interface pricingRowType {tokenAddress: string, tokenChainId: string, price: bigint};
  const pricingRowData: pricingRowType[] = Object.entries(pricesPerDay).flatMap(
    ([tokenChainId, chainPrices]) =>
    Object.entries(chainPrices).map( // TODO: type error here would be fixed by adding interface for pricesPerDay
      ([tokenAddress, price]) => ({tokenChainId, tokenAddress, price: price as bigint})
    )
  );

  const allReads: ContractFunctionParameters[] = pricingRowData.flatMap(
    ({tokenChainId, tokenAddress}) => {
      interface readTokenInput {functionName: string, outputType: string};
      const readToken = ({functionName, outputType}: readTokenInput) => ({
        chainId: tokenChainId,
        address: tokenAddress as `0x${string}`,
        abi: [{name: functionName, type: "function" as const, stateMutability: "view" as const, inputs: [], outputs: [{name: functionName, type: outputType}]}],
        functionName
      });
      return [
        readToken({functionName: "decimals", outputType: "uint8"}),
        readToken({functionName: "name", outputType: "string"}),
      ];
    }
  );

  const {data: results, error, status} = useReadContracts({contracts: allReads});

  return (
    <div>
      <h1>Pricing</h1>
      {error ? <p>Error reading token contracts: {error.message}</p> :
       results ? (
        <table>
          <thead>
            <tr>
              <th>Payment Token Chain</th>
              <th>Payment Token</th>
              <th>Validator Day Price</th>
            </tr>
          </thead>
          <tbody>
          {pricingRowData.map(({tokenChainId, tokenAddress, price}, i) => {
            const [tokenDecimals, tokenName] = results.slice(i * 2, 2);
            return (
              <tr>
                <td>{tokenChainId}</td>
                <td>{tokenName.result as string}({tokenAddress})</td>
                <td>{formatUnits(price, tokenDecimals.result as number)}</td>
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
