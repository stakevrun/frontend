import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  walletConnectWallet,
  safeWallet,
  frameWallet,
  ledgerWallet,
  rabbyWallet,
  metaMaskWallet,
  mewWallet,
  rainbowWallet,
  argentWallet,
  oneInchWallet,
  braveWallet,
  uniswapWallet,
  binanceWallet,
  bybitWallet,
  coinbaseWallet,
  krakenWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi';
import { mock } from 'wagmi/connectors';
import {
  arbitrum,
  // base,
  holesky,
  mainnet,
  // optimism,
  // polygon,
  sepolia,
} from 'wagmi/chains';
import { NEXT_PUBLIC_PROJECT_ID, HOLESKY_RPC } from './constants';
import { useState } from 'react';

// Recommended for wagmi + TS (https://wagmi.sh/react/typescript#requirements)
// TODO update for useCreateConfig
/*
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
*/

const projectInfo = {
  appName: 'Vrün',
  projectId: NEXT_PUBLIC_PROJECT_ID
};

const walletGroups = [
  {
    groupName: 'General',
    wallets: [ injectedWallet, walletConnectWallet, safeWallet ],
  },
  {
    groupName: 'Specific',
    wallets: [
      frameWallet,
      metaMaskWallet,
      rabbyWallet,
      braveWallet,
      mewWallet,
      rainbowWallet,
      oneInchWallet,
      uniswapWallet,
      ledgerWallet,
      argentWallet,
    ],
  },
  {
    groupName: 'Exchange',
    wallets: [ coinbaseWallet, krakenWallet, binanceWallet, okxWallet, bybitWallet ],
  }
];

export function useCreateConfig() {
  const [mockAccount, setMockAccount] = useState<`0x${string}` | undefined>();

  const mockWallet = (account: `0x${string}`) => () => {
    console.log('creating mock wallet...');
    return (
      {
        id: 'mock',
        iconUrl: '',
        iconBackground: '#222',
        name: 'Track Wallet (view-only)',
        createConnector:
          () => mock({
            accounts: [ account ],
            features: {
              reconnect: true,
              connectError: false,
            },
          })
      }
    );
  };


  const connectors = connectorsForWallets(
    mockAccount ?
      [{groupName: 'View only', wallets: [mockWallet(mockAccount)]}].concat(walletGroups) :
      walletGroups,
    projectInfo
  );

  const config = createConfig({
    chains: [
      mainnet,
      holesky,
      // polygon,
      // optimism,
      arbitrum,
      // base,
      sepolia,
    ],
    connectors,
    transports: {
      [mainnet.id]: http(),
      [holesky.id]: http(HOLESKY_RPC),
      [arbitrum.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
  });

  return {config, setMockAccount};
};
