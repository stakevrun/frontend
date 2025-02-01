import type { FC } from "react";
import { TransactionSigner } from "./TransactionSigner";
import { FaServer } from "react-icons/fa";
import { Input } from "@headlessui/react";
import { useBalance, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, parseUnits, keccak256, concat, bytesToHex } from "viem";
import { useEffect, useState, useCallback } from "react";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { useReadDb } from "../../hooks/useReadDb";
import { useReadFee } from "../../hooks/useReadFee";
import { abi as depositABI } from "../../abi/depositABI";

export const AddValidatorForm: FC<{
  onSubmit: (result: string | undefined, error: string | undefined, hasError: boolean) => void;
}> = ({ onSubmit }) => {
  interface MinipoolAddressData {
    [expectedMinipoolAddress: `0x${string}`]: string;
  }

  const [signData,  setSignData ] = useState<string>();
  const [signError, setSignError] = useState<string>();
  const [isPending, setIsPending] = useState<boolean>(false);

  //-- Minipool creation params --
  const [firstIndex,        setFirstIndex       ] = useState<number>();
  const [graffiti,          setGraffiti         ] = useState<string>("");
  const [bondAmount,        setBondAmount       ] = useState<number>(8);
  const [amountValidators,  setAmounValidators  ] = useState<number>(1);
  const [maxValidators,     setMaxValidators    ] = useState<number>(0); // Based on current connected wallet available funds
  const [minipoolAddresses, setMinipoolAddresses] = useState<MinipoolAddressData>(); // Will be set to a map of the generated minipool addresses and their used salts

  // For now, we set these gefaults, they should be handled by input fields for the user to decide later.
  useEffect(() => {
    setBondAmount(8);
    setAmounValidators(1);
  }, []);
  //--

  const { address, chainId } = useAccount();
  const { data: nextIndex,    error: nextIndexError, refetch: nextIndexRefetch }                        = useReadDb({ path: "nextindex" });
  const { data: feeRecipient, error: feeRecipientError, refetch: feeRecipientRefetch }                  = useReadFee({ path: "rp-fee-recipient" });
  const { data: balance,      error: balanceError, status: balanceStatus, isPending: balanceIsPending } = useBalance({
    address,
    chainId: chainId as 1 | 17000 | 42161 | 11155111 | undefined
  });
  const {
    data: writeContractData,
    error: writeContractError,
    isPending: writeContractPending,
    isSuccess: isWritten,
    writeContractAsync,
  } = useWriteContract();
  const {
    error: transactionReceiptError,
    isSuccess: transactionReceiptIsSuccess,
  } = useWaitForTransactionReceipt({ hash: writeContractData, query: { enabled: isWritten } });

  const [rocketAddressesLoaded, setRocketAddresesLoaded] = useState(false);
  const { data: minipoolBaseAddress,    error: minipoolBaseAddressError }    = useRocketAddress("rocketMinipoolBase");
  const { data: minipoolFactoryAddress, error: minipoolFactoryAddressError } = useRocketAddress("rocketMinipoolFactory");
  const { data: nodeDepositAddress,     error: nodeDepositAddressError }     = useRocketAddress("rocketNodeDeposit");

  const getMessage = useCallback(() => {
    if(nextIndexError) {
      return { message: undefined, error: "Could not get next index for validator."};
    }
    if (minipoolAddresses && nextIndex && nextIndex.status === 200 && address && feeRecipient) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      onSubmit("Waiting for message signature...", undefined, false);
      return {
        timestamp,
        firstIndex,
        amountGwei: parseInt(parseUnits("1", 9).toString()), // 1 ETH in gwei
        feeRecipient: feeRecipient.value,
        graffiti,
        withdrawalAddresses: Object.keys(minipoolAddresses),
      };
    } else {
      return { message: undefined, error: "Could not get all data" };
    }
  }, [nextIndexError, onSubmit, minipoolAddresses, nextIndex, firstIndex, address, feeRecipient, graffiti]);

  const writeContract = useCallback(async (data: any) => {
    if(onSubmit && writeContractAsync) {
      onSubmit("Waiting for contract call approval...", undefined, false);
      try {
        const transactionHash = await writeContractAsync(data);
        onSubmit(
          `Transaction created with hash: ${transactionHash}`,
          undefined,
          false,
        );
      } catch (e) {
        console.warn("Error calling contract:", e, "With message:", data);
        let message: string;
        if (typeof e === "string") {
          message = e;
        } else if (e instanceof Error) {
          message = e.message;
        } else {
          message = "Error calling contract."
        }
        throw message.split("\n", 2).join("\n"); // Only get the first line, don need the full stacktrace
      }
    }
  }, [onSubmit, writeContractAsync]);

  useEffect(() => {
    if (balance && bondAmount) {
      setMaxValidators(Math.floor(parseInt(balance.formatted) / bondAmount));
    }
  }, [balance, bondAmount]);

  useEffect(() => {
    if (minipoolBaseAddress && minipoolFactoryAddress && nodeDepositAddress) {
      setRocketAddresesLoaded(true);
    }
  }, [minipoolBaseAddress, minipoolFactoryAddress, nodeDepositAddress]);

  useEffect(() => {
    if (minipoolBaseAddressError || minipoolFactoryAddressError || nodeDepositAddressError) {
      setRocketAddresesLoaded(false);
      onSubmit(undefined, "Error loading one or more contract addresses", true);
    }
  }, [onSubmit, minipoolBaseAddressError, minipoolFactoryAddressError, nodeDepositAddressError]);

  useEffect(() => {
    if (nextIndex && nextIndex.status === 200) {
      setFirstIndex(nextIndex.value);
    }
  }, [nextIndex]);

  useEffect(() => {
    if (address && chainId) {
      nextIndexRefetch();
      feeRecipientRefetch();
    }
  }, [address, chainId, nextIndexRefetch, feeRecipientRefetch]);

  useEffect(() => {
    if (rocketAddressesLoaded && amountValidators && address) {
      setIsPending(true);
      const generatedAddresses: MinipoolAddressData = {};
      while (Object.keys(generatedAddresses).length < amountValidators) {
        const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
        const initHash = keccak256(
          `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${minipoolBaseAddress?.slice(2)}5af43d82803e903d91602b57fd5bf3`,
        );
        const keccakedSalt = keccak256(concat([address, salt]));
        const newMinipoolAddress = keccak256(
          concat(["0xff", minipoolFactoryAddress as `0x${string}`, keccakedSalt, initHash]),
        );
        const expectedMinipoolAddress: `0x${string}` = `0x${newMinipoolAddress.slice(-40)}`;
        generatedAddresses[expectedMinipoolAddress] = salt;
      }
      setMinipoolAddresses(generatedAddresses);
      setIsPending(false);
    }
  }, [rocketAddressesLoaded, amountValidators, address, minipoolBaseAddress, minipoolFactoryAddress]);

  useEffect(() => {
    if (signError) {
      onSubmit(
        undefined,
        `An error occured while trying to sign the validator request: ${signError}`,
        true,
      );
    } else if (signData && minipoolAddresses && bondAmount) {
      //onSubmit(signData, undefined, false);
      setIsPending(true);
      const result = JSON.parse(signData);
      console.log(result);

      Object.keys(result).forEach((minipoolAddress: string) => {
        if (minipoolAddress in minipoolAddresses) {
          const { pubkey, signature, depositDataRoot } =
            result[minipoolAddress];

          const contractData = {
            abi: depositABI,
            address: nodeDepositAddress,
            functionName: "deposit",
            args: [
              parseEther(bondAmount.toString()), // _bondAmount
              parseEther("0.05"), // _minimumNodeFee
              pubkey, // _validatorPubkey
              signature, // _validatorSignature
              depositDataRoot, // _depositDataRoot
              minipoolAddresses[minipoolAddress as `0x${string}`], // _salt
              minipoolAddresses, // _expectedMinipoolAddress
            ],
            value: parseEther(bondAmount.toString()),
          };
          writeContract(contractData)
            .catch((err) => {
              onSubmit(
                undefined,
                `An error occured while trying to sign the minipool deposit transaction: ${err}`,
                true,
              );
            });
        } else {
          // Should never happen, but better to check anyway.
          onSubmit(
            undefined,
            "Signed result does not match local state. Could not continue...",
            true,
          );
          setIsPending(false);
        }
      });
      nextIndexRefetch();
    }
  }, [signData, signError, bondAmount, minipoolAddresses, nextIndexRefetch, nodeDepositAddress, onSubmit, writeContract]);

  useEffect(() => {
    if(writeContractError) {
      onSubmit(
        undefined,
        `An error occured while trying to sign the minipool deposit transaction: ${writeContractError}`,
        true,
      );
    }
  }, [onSubmit, writeContractError]);

  useEffect(() => {
      if(transactionReceiptError) {
        let message: string = "An error occurred waiting on the transaction confirmation.";
        if (typeof transactionReceiptError === "string") {
          message = transactionReceiptError;
        } else if (transactionReceiptError instanceof Error) {
          message = transactionReceiptError.message;
        }
        onSubmit(undefined, message, true);
      }
      if(transactionReceiptIsSuccess) {
        onSubmit("Validator stake called succesfully!", undefined, false);
      }
      setIsPending(false);
  }, [transactionReceiptError, transactionReceiptIsSuccess, onSubmit]);

  return (
    <div className="panel flex-col">
      <div className="flex flex-row mb-3 content-center">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
          <FaServer className="text-yellow-500 text-xl" />
        </div>
        <h2 className="text-lg self-center">Create new validator</h2>
      </div>
      <div className="w-full flex flex-col gap-4 justify-center content-center max-w-md">
        {balanceIsPending ? (
          <p>Validating connected wallet [{address}] ETH balance...</p>
        ) : balanceError ? (
          <p>Could not validate your balance: {balanceError.message}</p>
        ) : feeRecipientError || (feeRecipient && feeRecipient.status !== 200) ? (
          <p>Could not contact fee service, please try again later!</p>
        ) : balance && bondAmount && parseInt(balance.formatted) >= bondAmount ? (
          <>
            <p>
              You have sufficient funds to create {maxValidators} validator
              {maxValidators > 1 ? "s" : ""}!
            </p>
            <ul>
              <li>
                Bond: <span className="">LEB{bondAmount}</span>
              </li>
              <li>Fee Recipient Address: {feeRecipient?.value}</li>
              <li>
                Withdrawal Address
                {minipoolAddresses &&
                  Object.keys(minipoolAddresses).length > 1 &&
                  "es"}
                :
                {minipoolAddresses && Object.keys(minipoolAddresses).length
                  ? Object.keys(minipoolAddresses).map((address) => (
                      <>
                        <br />
                        {address}
                      </>
                    ))
                  : "computing.."}
              </li>
            </ul>
            Graffiti:
            <Input
              value={graffiti}
              className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
              name="graffiti"
              type="string"
              placeholder="Enter custom graffiti message"
              onChange={(e) => setGraffiti(e.target.value)}
              required
            />
            <TransactionSigner
              onError={setSignError}
              onSuccess={setSignData}
              getMessage={getMessage}
              buttonText={
                isWritten && !transactionReceiptIsSuccess ? "Confirming..." :
                  isPending || writeContractPending ? "Pending..." :
                  "Add Validator"
              }
              path={firstIndex}
              primaryType="AddValidators"
              disabled={isPending || writeContractPending}
            />
          </>
        ) : balance ? (
          <p>
            Balance not sufficient to create a LEB{bondAmount} validator. You
            only have {balance.formatted} {balance.symbol}
          </p>
        ) : (
          <p>No balance found. {balanceStatus}</p>
        )}
      </div>
    </div>
  );
};
