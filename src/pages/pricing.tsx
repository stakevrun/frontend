import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useChainId } from "wagmi";

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
  return (
    <div>
      <h1>Pricing</h1>
      {Object.keys(pricesPerDay).map((tokenChainId, idx) => {
        return (
          <p key={idx}>{tokenChainId}</p>
        )
      })}
    </div>
  );
};

export default Pricing;
