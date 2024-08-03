import { MAINNET_ROCKET_STORAGE, HOLESKY_ROCKET_STORAGE } from "constants";
import { useChainId, useReadContract } from "wagmi";
import { keccak256, stringToBytes } from "viem";
import { mainnet } from "wagmi/chains";
import { abi } from "../abi/rocketStorageABI";

export const useRocketStorage = () => {
  const chainId = useChainId();
  const chainName = chainId === mainnet.id ? 'mainnet' : 'holesky';
  const address = {
    'mainnet': MAINNET_ROCKET_STORAGE,
    'holesky': HOLESKY_ROCKET_STORAGE,
  }[chainName];
  return {address, abi};
};

export const useRocketAddress = ({contractName}) => {
  const {address, abi} = useRocketStorage();
  return useReadContract({
    address,
    abi,
    functionName: 'getAddress',
    args: [keccak256(stringToBytes(`contract.address${contractName}`))],
  });
};
