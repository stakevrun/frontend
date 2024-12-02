import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { FEE_URL } from '../constants';

export function useReadFee({
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
  const url = `${FEE_URL}/${chainId}/${address}/${path}${queryString}`;
  const queryFn = () =>
    fetch(url)
      .then(
        r => {
          if(r.status === 200) {
            return r.json().then((value) => {
              return {status: 200, value}
            });
          }
          if(r.status === 404) {
            return r.text().then((msg) => {
              console.log(msg);
              return msg === "Unknown route" ? {status: 500, value: msg} : {status: 404, value: undefined}
            });
          }
          else {
            return r.text().then((msg) => {
              throw new Error(`${r.status} error fetching ${url}: ${msg}`);
            });
          }
        }
      );
  return useQuery({
    queryKey,
    queryFn,
  });
};
