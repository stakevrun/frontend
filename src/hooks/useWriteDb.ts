import { useAccount } from "wagmi";
import { type Hex } from "viem";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from '../constants';

export function useWriteDb({
  path,
  method,
  type,
} : {
  path?: number | "batch" | "credit",
  method?: "POST" | "PUT",
  type: string,
}) {
  const {chainId, address} = useAccount();
  const addPath = typeof path == 'undefined' ? '' : `/${path}`;
  const url = `${API_URL}/${chainId}/${address}${addPath}`;

  const mutationFn = async ({signature, data}: {signature: Hex, data: object}) => {
    const options = {
      method: method || "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({type, data, signature})
    };
    return await fetch(url, options);
  };

  return useMutation({ mutationFn });
};
