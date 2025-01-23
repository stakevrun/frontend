import { useAccount } from "wagmi";
import { useQueries, type QueryFunctionContext } from "@tanstack/react-query";
import { useReadDb } from "./useReadDb";
import { API_URL } from '../constants';

export function useValidatorPubkeys() {
  const {address, chainId} = useAccount();
  const {data: nextIndexData, error: nextIndexError} = useReadDb({path: 'nextindex'});
  const ids : Array<number> = Array.from(Array(nextIndexData?.value || 0).keys());
  const queryFn = ({queryKey} : QueryFunctionContext) => {
    const i = queryKey.at(-1);
    return fetch(`${API_URL}/${chainId}/${address}/pubkey/${i}`).then(
      r => r.status === 200 ? r.json() :
           r.text().then(t => { throw new Error(`${r.status} error fetching pubkey ${i}: ${t}`); })
    );
  };
  const results = useQueries({
    queries: ids.map(i => ({
      queryKey: ['vrün', chainId, address, 'pubkey', i],
      queryFn,
    }))
  });
  return {
    data: results.map((r, index) => { return {index: ids[index], pubkey: r.data}}),
    error: nextIndexError || results.find(r => r.error),
  };
};
