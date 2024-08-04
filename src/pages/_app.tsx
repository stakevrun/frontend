import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
// import type { AppPropsWithLayout } from '../types'; // need this if we wind up using nested layouts

import Layout from '../components/layout/layout';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { holesky, mainnet } from "wagmi/chains";
import { lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';

import { config } from '../wagmi';

const client = new QueryClient();

import { Figtree } from "next/font/google";
const figtree = Figtree({
  subsets: ["latin"],
});

const customRainbowKitTheme: Theme = {
  ...lightTheme(),
  fonts: {
    body: figtree.style.fontFamily,
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <style jsx global>{`
      html {
        font-family: ${figtree.style.fontFamily};
      }
    `}</style>
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider initialChain={holesky} theme={customRainbowKitTheme}> {/*By default, initialChain is the first chain supplied to Wagmi (see wagmi.ts)*/}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  );
}

export default MyApp;
