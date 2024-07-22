import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { ethers } from "ethers";
import feeABI from "../json/feeABI.json";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../globalredux/store";
import { useAccount, useChainId } from "wagmi";
import NoConnection from "../components/noConnection";

const Admin: NextPage = () => {
  const currentChain = useChainId();

  const [isAdmin, setIsAdmin] = useState(false);

  const { address } = useAccount({
    onConnect: async ({ address }) => {
      console.log("Ethereum Wallet Connected!");
      if (address !== undefined) {
        try {
          setIsAdmin(await adminCheck(address));
        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during admin check:", error);
        }
      }
    },
  });

  const adminCheck = async (add: string) => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        const signerAddress = await browserProvider.getSigner().then(s => s.getAddress());
        const adminAddresses: string[] = [];
        // TODO: ensure adminAddresses exists, cache in redux?
        return adminAddresses.includes(signerAddress.toLowerCase());
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      console.log("Could not find window.ethereum");
      return false;
    }
  };

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
        <title>Vrün | Credits Adminstration</title>
        <meta
          content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
          name="Vrün  | Credits Administration"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      {address !== undefined ? (
        <>
          {isAdmin ? (
            <>
            <p>
            TODO: form to issue a credit here
            </p>
            </>
          ) : (
          <div className="flex flex-col w-auto gap-2 rounded-lg border  px-4 py-4 text-center items-center justify-center shadow-xl">
            <h2 className="text-2xl font-bold  sm:text-2xl">NOT ADMIN</h2>
            <p className="mt-4 text-gray-500 sm:text-l">
            You are not connected with a Vrün administrator account.
            </p>
          </div>
          )}
        </>
      ) : (
        <NoConnection />
      )}

      <Footer />
    </div>
  );
};

export default Admin;
