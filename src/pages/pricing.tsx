import type { NextPage } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/layout/table";
import { useVrunPrices } from "../hooks/useVrunPrices";

const nullAddress = "0x".padEnd(42, "0");

// work in progress
const Pricing: NextPage = () => {
  const { prices, error, isLoading } = useVrunPrices();

  return (
    <div className="max-w-full md:px-10">
      <h1 className="my-16 text-xl self-center text-center md:text-2xl lg:text-3xl xl:text-4xl font-bold">
        Pricing
      </h1>
      {error ? (
        <p>{error}</p>
      ) : prices && !isLoading ? (
        <Table className="px-6">
          <TableHead>
            <TableRow>
              <TableHeader>Payment Token Chain</TableHeader>
              <TableHeader className="hidden sm:table-cell">
                Payment Token
              </TableHeader>
              <TableHeader>Validator Day Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices.pricingRowData.map(
              (
                {
                  tokenChainId,
                  tokenAddress,
                  price,
                  tokenName,
                  tokenSymbol,
                },
                i,
              ) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{tokenChainId.toString()}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {tokenName}{" "}
                      {tokenAddress != nullAddress && `(${tokenAddress})`}
                    </TableCell>
                    <TableCell>
                      {price} {tokenSymbol as string}
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      ) : (
        <p>Reading payment token info...</p>
      )}
    </div>
  );
};

export default Pricing;
