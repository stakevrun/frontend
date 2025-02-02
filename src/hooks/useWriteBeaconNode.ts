import { VRUN_CHAIN_CONFIG } from '../constants';
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";

export function useWriteBeaconNode({
  path,
  method,
}: {
  path?: string,
  method?: "POST" | "PUT";
}) {
  const { chainId } = useAccount();
  const addPath = typeof path == "undefined" ? "" : `/${path}`;
  const url = VRUN_CHAIN_CONFIG[chainId as keyof typeof VRUN_CHAIN_CONFIG].beacon_node_rpc;
  const uri = `${url}${addPath}`;

  const mutationFn = async (data: object) => {
    const options = {
      method: method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    console.log("Sending mutation to:", uri);
    console.log("With options:", options);
    return await fetch(uri, options);
  };

  return useMutation({ mutationFn });
}
