import { connectorsForWallets } from "@rainbow-me/rainbowkit";
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
} from "@rainbow-me/rainbowkit/wallets";
import { http, createConfig } from "wagmi";
import {
  arbitrum,
  // base,
  holesky,
  mainnet,
  // optimism,
  // polygon,
  sepolia,
} from "wagmi/chains";
import { NEXT_PUBLIC_PROJECT_ID, VRUN_CHAIN_CONFIG } from "./constants";

// Recommended for wagmi + TS (https://wagmi.sh/react/typescript#requirements)
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

const projectInfo = {
  appName: "Vrün",
  projectId: NEXT_PUBLIC_PROJECT_ID,
};

const walletGroups = [
  {
    groupName: "General",
    wallets: [injectedWallet, walletConnectWallet, safeWallet],
  },
  {
    groupName: "Specific",
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
    groupName: "Exchange",
    wallets: [
      coinbaseWallet,
      krakenWallet,
      binanceWallet,
      okxWallet,
      bybitWallet,
    ],
  },
];

const connectors = connectorsForWallets(walletGroups, projectInfo);

export const config = createConfig({
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
    [mainnet.id]: http(VRUN_CHAIN_CONFIG["1"].rpc),
    [holesky.id]: http(VRUN_CHAIN_CONFIG["17000"].rpc),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
