import { FC, ReactNode } from "react";

import Head from "next/head";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAccount } from "wagmi";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const account = useAccount();

  return (
    <>
      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
          name="Vrün  | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div>Address: {account.address}</div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
