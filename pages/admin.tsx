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

  const datetimeNow = () =>
    (new Date()).toISOString().slice(0, "YYYY-MM-DDTHH:mm:ss".length);

  const [isAdmin, setIsAdmin] = useState(false);
  const [nodeAddressInput, setNodeAddressInput] = useState("");
  const [creditDaysInput, setCreditDaysInput] = useState(0);
  const [reasonInput, setReasonInput] = useState("");
  const [txHashInput, setTxHashInput] = useState("");
  const [datetimeInput, setDatetimeInput] = useState(datetimeNow());

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
        const adminAddresses: string[] = await fetch('https://api.vrün.com/admins').then(r => r.json());
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
            <div className="flex flex-col py-12 max-w-md gap-2 place-self-center">
              <input
                value={nodeAddressInput}
                className="mt-4 mb-2 border border-black-200"
                placeholder="address of account to credit"
                type="text"
                onChange={e => setNodeAddressInput(e.target.value)}
              />
              <label>
                <span className="mr-2">days to credit</span>
                <input
                  value={creditDaysInput}
                  className="border max-w-fit text-right"
                  type="number"
                  onChange={e => setCreditDaysInput(e.target.value)}
                />
              </label>
              <input
                value={reasonInput}
                type="text"
                className="mt-4 mb-2 border border-black-200"
                placeholder="reason for crediting account"
                onChange={e => setReasonInput(e.target.value)}
              />
              <div>
                <input
                  value={datetimeInput}
                  type="datetime-local"
                  onChange={e => setDatetimeInput(e.target.value)}
                />
                <button type="button" className="border"
                 onClick={() => setDatetimeInput(datetimeNow())}
                >reset to now</button>
              </div>
              <input
                value={txHashInput}
                type="text"
                className="mt-4 mb-2 border border-black-200"
                placeholder="optional transaction hash"
                onChange={e => setTxHashInput(e.target.value)}
              />
              <button
                type="button"
                className="rounded-full border border-blue-500"
              >Credit Account</button>
            </div>
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
