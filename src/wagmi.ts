import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // arbitrum,
  // base,
  holesky,
  mainnet,
  // optimism,
  // polygon,
  // sepolia,
} from 'wagmi/chains';
import { NEXT_PUBLIC_PROJECT_ID } from './constants';

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
  ssr: true,
});