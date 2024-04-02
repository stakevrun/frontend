import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {

  holesky, mainnet

} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { Providers } from './globalredux/provider';


const holeskyRPCKey = process.env.HOLESKY_RPC
const mainnetRPCKey = process.env.MAINNET_RPC

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    //polygon,
    //optimism,
    //arbitrum,
   // base,
    //zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [holesky] : []),
  ],
  [ jsonRpcProvider({
    rpc: () => ({
      http: `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`,
    }),
  }),
  jsonRpcProvider({
    rpc: () => ({
      http: `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`,
    }),
  })
    ,publicProvider()]
);

//currentChain === 17000 ?   'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/'    :
// "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: '64fa04740ab4284806bd0df2ea67c791',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});


//comment test

function MyApp({ Component, pageProps }: AppProps) {
  return (
   <Providers>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
   
        <Component {...pageProps} />
  
      </RainbowKitProvider>
    </WagmiConfig>
    </Providers>

  );
}

export default MyApp;
