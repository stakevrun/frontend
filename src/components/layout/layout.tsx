import type { FC, ReactNode } from "react";
import { useEffect } from "react";

import Head from "next/head";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import { Figtree } from "next/font/google";
const figtree = Figtree({
  subsets: ["latin"],
});

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log(process.env.HOLESKY_RPC);
  }, []);

  return (
    <div className={`${figtree.className} flex flex-col min-h-screen bg-vrun-neutral-1 dark:bg-vrun-9 dark:text-indigo-50`}>
      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Vrün is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
          name="Vrün | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Navbar />

      <div className="flex flex-col grow justify-between">
        <main className="flex flex-col justify-center items-center">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
