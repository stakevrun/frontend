import type { AppProps } from "next/app";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
// import type { AppPropsWithLayout } from '../types'; // need this if we wind up using nested layouts

import Layout from "../components/layout/layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { holesky } from "wagmi/chains";
import {
  lightTheme,
  darkTheme,
  cssStringFromTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { Figtree } from "next/font/google";

const client = new QueryClient();
const figtree = Figtree({
  subsets: ["latin"],
});

const customRainbowKitLightTheme = {
  ...lightTheme({
    accentColor: "#8b5cf6",
  }),
  fonts: {
    body: figtree.style.fontFamily,
  },
  // colors: {
  // ...lightTheme().colors,
  // connectButtonBackground: "rgba(0, 0, 0, 0.5)",
  // connectButtonText: "white",
  // },
};

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
          <RainbowKitProvider
            initialChain={
              holesky /*By default, initialChain is the first chain supplied to Wagmi (see wagmi.ts)*/
            }
            showRecentTransactions={true}
            theme={customRainbowKitLightTheme}
          >
            {/* recommended by RainbowKit docs, but doesn't work */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  :root {
                    ${cssStringFromTheme(lightTheme)}
                  }

                  html .dark {
                    ${cssStringFromTheme(darkTheme)}
                `,
              }}
            />
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
