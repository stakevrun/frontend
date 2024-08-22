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
  cssStringFromTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";

const client = new QueryClient();

import { Figtree } from "next/font/google";
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
const customRainbowKitDarkTheme = {
  ...darkTheme(),
  fonts: {
    body: figtree.style.fontFamily,
  },
  // colors: {
  //   ...darkTheme().colors,
  //   connectButtonBackground: "linear-gradient(to right, #0284c7, #38bdf8)",
  // }
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
            // theme={{ lightMode: customRainbowKitLightTheme, darkMode: customRainbowKitDarkTheme }} // depends on prefers-color-scheme; doesn't work with Tailwind's selector approach
            theme={customRainbowKitLightTheme}
          >
            {/* recommended by RainbowKit docs, but doesn't work */}
            {/* <style
              dangerouslySetInnerHTML={{
                __html: `
                  :root {
                    ${cssStringFromTheme(lightTheme)}
                  }

                  html.dark {
                    ${cssStringFromTheme(darkTheme, {
                      extends: lightTheme,
                    })}
                  }
                `,
              }}
            /> */}
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
