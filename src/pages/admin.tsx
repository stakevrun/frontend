import React, { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
// import { ethers, JsonRpcSigner } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { useAdminCheck } from "../hooks/useAdminCheck";
import { NoConnection } from "../components/layout/NoConnection";

const Admin: NextPage = () => {
  const currentChain = useChainId();
  // const signerRef = useRef<JsonRpcSigner>();

  const datetimeFromSeconds = (s: number) =>
    new Date(s * 1000).toISOString().slice(0, "YYYY-MM-DDTHH:mm".length);

  const secondsNow = () => Math.round(Date.now() / 1000);

  // const [isAdmin, setIsAdmin] = useState(false);
  const { address } = useAccount();
  const isAdmin = useAdminCheck(address);
  const [nodeAddressInput, setNodeAddressInput] = useState("");
  const [creditDaysInput, setCreditDaysInput] = useState(0);
  const [reasonInput, setReasonInput] = useState("");
  const [txHashInput, setTxHashInput] = useState("");
  const [tokenChainId, setTokenChainId] = useState(1);
  const [tokenAddress, setTokenAddress] = useState("");
  const [timestampInput, setTimestampInput] = useState(secondsNow());
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // useEffect(() => {
  //   async () => {
  //     if (address !== undefined) {
  //       try {
  //         setIsAdmin(await adminCheck(address));
  //       } catch (error) {
  //         console.error("Error during admin check:", error);
  //       }
  //     }
  //   };
  // }, [address]);

  // // TODO translate to wagmi/viem
  // const adminCheck = async (address: string) => {
  //   if (address !== undefined) {
  //     try {
  //       const browserProvider = new ethers.BrowserProvider(
  //         (window as any).ethereum
  //       );
  //       console.log("running admin check");
  //       const signer = await browserProvider.getSigner();
  //       const signerAddress = await signer.getAddress();
  //       signerRef.current = signer;
  //       const adminAddresses: string[] = await fetch(
  //         "https://api.vrün.com/admins"
  //       ).then((r) => r.json());
  //       adminAddresses.push(
  //         "0x9c2bA9B3d7Ef4f759C2fEb2E174Ef14F8C64b46e".toLowerCase()
  //       ); // TEST
  //       return adminAddresses.includes(signerAddress.toLowerCase());
  //     } catch (error) {
  //       console.log(error);
  //       return false;
  //     }
  //   } else {
  //     console.log("Could not find window.ethereum");
  //     return false;
  //   }
  // };

  
  const handleCreditAccount = () => {
    console.log("just kidding");
  }
  /*
  const handleCreditAccount = async () => {
    // signer.signTypedData(domain: TypedDataDomain, types: Record< string, Array< TypedDataField > >, value: Record< string, any >)⇒ Promise< string >
    const domain = {
      name: "vrün",
      version: "1",
      chainId: currentChain,
    };

    const types = {
      // Pay: [
      //   { type: "address", name: "nodeAccount" },
      //   { type: "uint256", name:  "numDays" },
      //   { type: "uint256", name: "tokenChainId" },
      //   { type: "address", name: "tokenAddress" },
      //   { type: "bytes32", name: "transactionHash" },
      // ]
      CreditAccount: [
        { type: "uint256", name: "timestamp" },
        { type: "address", name: "nodeAccount" },
        { type: "uint256", name: "numDays" },
        { type: "bool", name: "decreaseBalance" },
        { type: "uint256", name: "tokenChainId" },
        { type: "address", name: "tokenAddress" },
        { type: "bytes32", name: "transactionHash" },
        { type: "string", name: "reason" },
      ],
    };

    const data = {
      timestamp: timestampInput,
      nodeAccount: nodeAddressInput || "0x".padEnd(42, "0"),
      numDays: Math.abs(creditDaysInput),
      decreaseBalance: creditDaysInput < 0,
      tokenChainId,
      tokenAddress: tokenAddress || "0x".padEnd(42, "0"),
      transactionHash: txHashInput || "0x".padEnd(66, "0"),
      reason: reasonInput,
    };

    console.log("About to try signing this data:");
    console.log(data);

    let signature;
    try {
      signature = await signerRef.current?.signTypedData(domain, types, data);
    } catch (e: any) {
      console.warn(`signTypedData error: ${e}`);
      setErrorMessage(e.message);
    }

    const dataToPost = {
      type: "CreditAccount",
      data,
      signature,
    };
    await fetch(
      `https://api.vrün.com/${currentChain}/${nodeAddressInput}/credit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToPost),
        mode: "no-cors",
      }
    )
      .then(async (res) => {
        if (res.status !== 201)
          throw new Error(
            `Unexpected return status from POST: ${
              res.status
            }. Body: ${await res.text()}`
          );
        else {
          setSuccessMessage("Posted credit");
          console.log("Posted credit");
          setTimeout(() => setSuccessMessage(""), 5000);
        }
      })
      .catch((error) => {
        console.warn(`post credit error: ${error}`);
        setErrorMessage(error.message);
      });
  };
*/
  return (
    <div className="flex w-full h-auto flex-col">
      {address !== undefined ? (
        <>
          {isAdmin ? (
            <div className="flex flex-col py-12 max-w-md gap-2 place-self-center">
              <input
                value={nodeAddressInput}
                className="mt-4 mb-2 border border-black-200"
                placeholder="address of account to credit"
                type="text"
                onChange={(e) => setNodeAddressInput(e.target.value)}
              />
              <label>
                <span className="mr-2">days to credit</span>
                <input
                  value={creditDaysInput}
                  className="border max-w-fit text-right"
                  type="number"
                  onChange={(e) => setCreditDaysInput(Number(e.target.value))}
                />
              </label>
              <input
                value={reasonInput}
                type="text"
                className="mt-4 mb-2 border border-black-200"
                placeholder="reason for crediting account"
                onChange={(e) => setReasonInput(e.target.value)}
              />
              <div>
                <span className="px-5">
                  {datetimeFromSeconds(timestampInput)}
                </span>
                <input
                  value={timestampInput}
                  type="number"
                  onChange={(e) => {
                    const newTimestamp = Number(e.target.value);
                    setTimestampInput(newTimestamp);
                  }}
                />
                <button
                  type="button"
                  className="border"
                  onClick={() => setTimestampInput(secondsNow())}
                >
                  reset to now
                </button>
              </div>
              <label>
                <span className="mr-2">optional token chain id</span>
                <input
                  value={tokenChainId}
                  type="number"
                  className="mt-4 mb-2 border border-black-200"
                  onChange={(e) => setTokenChainId(Number(e.target.value))}
                />
              </label>
              <input
                value={tokenAddress}
                type="text"
                className="mt-4 mb-2 border border-black-200"
                placeholder="optional token address"
                onChange={(e) => setTokenAddress(e.target.value)}
              />
              <input
                value={txHashInput}
                type="text"
                className="mt-4 mb-2 border border-black-200"
                placeholder="optional transaction hash"
                onChange={(e) => setTxHashInput(e.target.value)}
              />
              <button
                type="button"
                className="rounded-full border border-blue-500"
                onClick={handleCreditAccount}
              >
                Credit Account
              </button>
              {errorMessage && <div>Error: {errorMessage}</div>}
              {successMessage && <div>{successMessage}</div>}
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
    </div>
  );
};

export default Admin;
