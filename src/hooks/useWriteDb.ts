import { useAccount } from "wagmi";
import { type Hex } from "viem";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from '../constants';

export function useWriteDb({
  path,
  method,
  type,
  data,
} : {
  path?: number | "batch" | "credit",
  method?: "POST" | "PUT",
  type: string,
  data: object
}) {
  const {chainId, address} = useAccount();
  const addPath = typeof path == 'undefined' ? '' : `/${path}`;
  const url = `${API_URL}/${chainId}/${address}${addPath}`;
  const mutationFn = async ({signature}: {signature: Hex}) => {
    const options = {
      method: method || "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({type, data, signature})
    };
    const res = await fetch(url, options);
    if (!([200, 201].includes(res.status)))
      throw new Error(`Failed (${res.status}) to ${method} API: ${await res.text()}`);
    return res;
  };
  return useMutation({
    mutationFn
  });
};
