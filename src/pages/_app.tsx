import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
// import type { AppPropsWithLayout } from '../types'; // need this if we wind up using nested layouts

import Layout from "../components/layout/layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { holesky, mainnet } from "wagmi/chains";
import {
  lightTheme,
  darkTheme,
  RainbowKitProvider,
  WalletButton,
} from "@rainbow-me/rainbowkit";

import { useCreateConfig } from "../wagmi";

const client = new QueryClient();

import { Figtree } from "next/font/google";
const figtree = Figtree({
  subsets: ["latin"],
});

const customRainbowKitLightTheme = {
  ...lightTheme(),
  fonts: {
    body: figtree.style.fontFamily,
  },
  colors: {
    ...lightTheme().colors,
    connectButtonBackground: "#38bdf8",
    connectButtonText: "#283d4a",
  },
};
const customRainbowKitDarkTheme = {
  ...darkTheme(),
  fonts: {
    body: figtree.style.fontFamily,
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const {config, setMockAccount} = useCreateConfig();

  function handleMockInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target?.value && e.target.value.startsWith('0x'))
      setMockAccount(e.target.value as `0x${string}`);
    else
      setMockAccount(undefined);
  };

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${figtree.style.fontFamily};
        }
      `}</style>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            initialChain={
              holesky /*By default, initialChain is the first chain supplied to Wagmi (see wagmi.ts)*/
            }
            showRecentTransactions={true}
            theme={customRainbowKitLightTheme}
          >
            <Layout>
              <label>Mock account: <input type="text" onInput={handleMockInput}></input></label>
              <WalletButton wallet="mock" />
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
