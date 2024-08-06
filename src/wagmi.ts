import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  // arbitrum,
  // base,
  holesky,
  mainnet,
  // optimism,
  // polygon,
  // sepolia,
} from 'wagmi/chains';
import { NEXT_PUBLIC_PROJECT_ID, HOLESKY_RPC } from './constants';

// Recommended for wagmi + TS (https://wagmi.sh/react/typescript#requirements)
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: NEXT_PUBLIC_PROJECT_ID,
  chains: [
    mainnet,
    holesky,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
  ],
  transports: {
    [holesky.id]: http(HOLESKY_RPC),
  },
  ssr: true,
});
