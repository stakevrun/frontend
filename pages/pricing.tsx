import type { NextPage } from "next";
import Head from "next/head";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import type { RootState } from "../globalredux/store";
import { useSelector, useDispatch } from "react-redux";
import { getData } from "../globalredux/Features/validator/valDataSlice";

const Pricing: NextPage = () => {
  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!");
    },
  });

  useEffect(() => {
    console.log(address);
  }, [address]);

  const currentChain = useChainId();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isInitialRender && address !== undefined) {
      // This block will run after the initial render
      dispatch(getData([{ address: "NO VALIDATORS" }]));
    } else {
      // This block will run only on the initial render

      setIsInitialRender(false);
    }
  }, [currentChain, address]);

  const reduxDarkMode = useSelector(
    (state: RootState) => state.darkMode.darkModeOn
  );

  return (
    <div
      style={{
        backgroundColor: reduxDarkMode ? "#222" : "white",
        color: reduxDarkMode ? "white" : "#222",
      }}
      className="flex w-full h-auto flex-col"
    >
      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
          name="Vrün  | Nodes & Staking"
        />

        <link href="/favicon.ico" rel="icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Catamaran:wght@700&family=Figtree:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;1,400;1,500&family=Roboto:wght@100;300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">
        <div className="flex flex-col justify-start items-start gap-4 w-[95%] lg:min-h-[92vh] p-4">
          <h1 className="text-2xl md:text-4xl self-center my-3 font-bold">
            Vrün Pricing
          </h1>

          {/* insert pricing info here */}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
