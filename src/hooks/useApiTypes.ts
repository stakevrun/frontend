import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useApiTypes() {
  const chainId = useChainId();
  const url = `https://api.vrün.com/${chainId}/types`;
  const queryKey = ['vrün', chainId, 'types'];
  const queryFn = () => fetch(url).then(r => r.json());
  return useQuery({queryKey, queryFn});
};

export function useDeclaration() {
  const url = `https://api.vrün.com/declaration`;
  const queryKey = ['vrün', 'declaration'];
  const queryFn = () => fetch(url).then(r => r.json());
  return useQuery({queryKey, queryFn});
};
