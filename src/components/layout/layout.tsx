import { FC, ReactNode } from "react";

import Head from "next/head";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAccount } from "wagmi";

import { Figtree } from "next/font/google";
const figtree = Figtree({
  subsets: ["latin"],
});

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { address, chainId, isConnected } = useAccount({});

  return (
    <div className={`${figtree.className} min-h-screen`}>
      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
          name="Vrün  | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Navbar />
      <div>Address: {address}</div>
      <div>Chain ID: {chainId}</div>
      <div>Connected: {isConnected.toString()}</div>
      <main
        className="flex-1 flex flex-col justify-center items-center"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
