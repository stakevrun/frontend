import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { VRUN_CHAIN_CONFIG } from '../constants';

export function useReadBeaconNode({
  path,
  searchParams,
} : {
  path: string,
  searchParams?: Record<string, string>,
}) {
  const {address, chainId} = useAccount();
  const qs = searchParams && (new URLSearchParams(searchParams)).toString();
  const queryString = qs ? `?${qs}` : '';
  const queryKey = ["vrün", chainId, address, path, queryString];
  const url = VRUN_CHAIN_CONFIG[chainId as keyof typeof VRUN_CHAIN_CONFIG].beacon_node_rpc;
  const uri = `${url}/${path}${queryString}`;
  const queryFn = () =>
    fetch(uri)
      .then(
        r => r.status === 200 ? r.json().then(value => ({status: 200, value})) :
          r.status === 404 ? {status: 404, value: undefined} :
          r.text().then(msg => { throw new Error(`${r.status} error fetching ${uri}: ${msg}`) }));
  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: 20 * 1000 // milliseconds
  });
};
