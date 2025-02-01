import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { useAccount } from "wagmi";
import { useQueries } from "@tanstack/react-query";
import { useReadDb } from "./useReadDb";
import { useState } from "react";

export function useValidatorPubkeys() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address, chainId } = useAccount();
  const { data: nextIndexData, error: nextIndexError } = useReadDb({
    path: "nextindex",
  });
  const ids: Array<number> = Array.from(
    Array(nextIndexData?.value || 0).keys(),
  );

  const queryFn = ({ queryKey }: QueryFunctionContext) => {
    setIsLoading(true);
    const i = queryKey.at(-1);
    return fetch(`${API_URL}/${chainId}/${address}/pubkey/${i}`).then((r) => {
      setIsLoading(false);
      return (r.status === 200
        ? r.json()
        : r.text().then((t) => {
            throw new Error(`${r.status} error fetching pubkey ${i}: ${t}`);
          }));
    });
  };

  const results = useQueries({
    queries: ids.map((i) => ({
      queryKey: ["vrün", chainId, address, "pubkey", i],
      queryFn,
    })),
  });

  return {
    data: results.map((r, index) => {
      return { index: ids[index], pubkey: r.data };
    }),
    error: nextIndexError || results.find((r) => r.error),
    isLoading: isLoading,
  };
}
