import { VRUN_CHAIN_CONFIG } from "../constants";
import { useChainId, useReadContract } from "wagmi";
import { keccak256, stringToBytes } from "viem";
import { abi } from "../abi/rocketStorageABI";

export const useRocketStorage = () => {
  const chainId = useChainId();
  const address = VRUN_CHAIN_CONFIG[chainId as keyof typeof VRUN_CHAIN_CONFIG].rocket_storage;
  return {address, abi};
};

export const useRocketAddress = (contractName: string) => {
  const {address, abi} = useRocketStorage();
  return useReadContract({
    address,
    abi,
    functionName: 'getAddress',
    args: [keccak256(stringToBytes(`contract.address${contractName}`))],
  });
};
