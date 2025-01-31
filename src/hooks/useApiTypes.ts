import { API_URL, FEE_URL } from "../constants";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useApiTypes() {
  const chainId = useChainId();
  const url = `${API_URL}/${chainId}/types`;
  const queryKey = ["vrün", chainId, "types"];
  const queryFn = () => fetch(url).then((r) => r.json());
  return useQuery({ queryKey, queryFn });
}

export function useFeeApiTypes() {
  const chainId = useChainId();
  const url = `${FEE_URL}/${chainId}/types`;
  const queryKey = ["vrün", chainId, "types"];
  const queryFn = () => fetch(url).then((r) => r.json());
  return useQuery({ queryKey, queryFn });
}

export function useDeclaration() {
  const url = `${API_URL}/declaration`;
  const queryKey = ["vrün", "declaration"];
  const queryFn = () => fetch(url).then((r) => r.json());
  return useQuery({ queryKey, queryFn });
}
