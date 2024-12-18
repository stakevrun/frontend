import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from '../constants';

export function useReadDb({
  path,
  searchParams,
} : {
  path: string,
  searchParams?: Record<string, string>,
}) {
  const {address, chainId} = useAccount();
  const qs = searchParams && (new URLSearchParams(searchParams)).toString();
  const queryString = qs ? `?${qs}` : '';
  const queryKey = ['vrün', chainId, address, path, queryString];
  const url = `${API_URL}/${chainId}/${address}/${path}${queryString}`;
  const queryFn = () =>
    fetch(url)
      .then(
        r => r.status === 200 ? r.json().then(value => ({status: 200, value})) :
          r.status === 404 ? {status: 404, value: undefined} :
          r.text().then(msg => { throw new Error(`${r.status} error fetching ${url}: ${msg}`) }));
  return useQuery({
    queryKey,
    queryFn,
  });
};
