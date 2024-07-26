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
