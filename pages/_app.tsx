import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {

  holesky,
  mainnet,

} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";



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
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'VrunStaking',
  projectId: '64fa04740ab4284806bd0df2ea67c791',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();


//comment test

function MyApp({ Component, pageProps }: AppProps<{
  session: Session;
}>) {
  return (


<WagmiConfig config={wagmiConfig}>
{/*<SessionProvider refetchInterval={0} session={pageProps.session}>
  <QueryClientProvider client={queryClient}>
  <RainbowKitSiweNextAuthProvider> */}
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>

      {/*
    </RainbowKitSiweNextAuthProvider>
  </QueryClientProvider>
</SessionProvider> */}
</WagmiConfig>
  );
}

export default MyApp;
