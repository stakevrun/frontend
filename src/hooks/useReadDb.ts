import { useChainId, useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useReadDb({
  path,
  searchParams,
} : {
  path: string,
  searchParams?: Record<string, string>,
}) {
  const chainId = useChainId();
  const {address} = useAccount();
  const qs = searchParams && (new URLSearchParams(searchParams)).toString();
  const queryString = qs ? `?${qs}` : '';
  const queryKey = [chainId, address, path, queryString];
  const url = `https://api.vrün.com/${chainId}/${address}/${path}${queryString}`;
  const queryFn = () =>
    fetch(url)
      .then(
        r => r.status === 200 ? r.json().then(value => ({status: 200, value})) :
          r.status === 404 ? {status: 404} :
          r.text().then(msg => { throw new Error(`${r.status} error fetching ${url}: ${msg}`) }));
  return useQuery({
    queryKey,
    queryFn,
  });
};
