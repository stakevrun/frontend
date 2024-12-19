import { useBalance, useAccount, useWriteContract } from "wagmi";
import { type UseQueryResult } from "@tanstack/react-query";
import { type ReadContractReturnType, type ReadContractErrorType, parseEther, parseUnits, formatGwei, keccak256, concat, bytesToHex } from "viem";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { TransactionSigner } from "./TransactionSigner";
import { type FC, useEffect } from "react";
import { FaServer } from "react-icons/fa";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { useReadDb } from "../../hooks/useReadDb";
import depositABI from "../../abi/depositABI.json";

export const AddValidatorForm: FC<{
  onSubmit: (result: String, error: String, hasError: bool) => void;
}> = ({ onSubmit }) => {

  const {address, chainId} = useAccount();
  const {data: balance, error: balanceError, isPending: balanceIsPending, status: balanceStatus} = useBalance({address, chainId, token: ''});
  const {data: nextIndex, error: nextIndexError, refetch: nextIndexRefetch} = useReadDb({path: 'nextindex'});
  const {data: writeContractData, error: writeContractError, status: writeContractStatus, writeContractAsync} = useWriteContract();

  const {data: minipoolBaseAddress,    error: minipoolBaseAddressError}    = useRocketAddress("rocketMinipoolBase");
  const {data: minipoolFactoryAddress, error: minipoolFactoryAddressError} = useRocketAddress("rocketMinipoolFactory");
  const {data: nodeDepositAddress,     error: nodeDepositAddressError}     = useRocketAddress("rocketNodeDeposit");

  const [signData,            setSignData]            = useState();
  const [signError,           setSignError]           = useState();
  const [error,               setError]               = useState(false);
  const [isPending,           setIsPending]           = useState(false);
  const [firstIndex,          setFirstIndex]          = useState();
  const [bondAmount,          setBondAmount]          = useState(8); // For now, we default to LEB8
  const [graffiti,            setGraffiti]            = useState("");
  const [feeRecipient,        setFeeRecipient]        = useState(address); // For now we default to the current signed in wallet
  const [withdrawalAddresses, setWithdrawalAddresses] = useState([address]); // For now we default to the current signed in wallet
  const [maxValidators,       setMaxValidators]       = useState(0);

  const getMessage = () => {
    if(nextIndex.status === 200 && address) {
      const timestamp = Math.floor(Date.now() / 1000).toString();

      return {
        timestamp,
        firstIndex,
        amountGwei: parseInt(parseUnits('10', 8)),
        feeRecipient,
        graffiti,
        withdrawalAddresses,
      };
    } else {
      setError();
      return {message: null, error: "Could not get all data" };
    }
  };

  const writeContract = async (message) => {
    try {
      const mutation = await writeContractAsync(message);
      console.log(mutation);
      if (!mutation.ok) {
        setError(await mutation.text());
      } else {
        console.log(await mutation.text());
      }
    } catch (e) {
      setError(e.message);
      console.warn("Error calling contract:", e, "With message:", message);
    }
  };

  useEffect(() => {
    if(nextIndex && nextIndex.status === 200) {
      setFirstIndex(nextIndex.value);
    }
  }, [nextIndex]);

  useEffect(() => {
    if(onSubmit) {
      if(signError) {
        onSubmit(null, `An error occured while trying to sign the validator request: ${signError}`, true);
      } else if(signData) {
        //onSubmit(signData, null, false);
        if(minipoolBaseAddress && minipoolFactoryAddress && nodeDepositAddress) {
          setIsPending(true);
          let result = JSON.parse(signData);
          const validatorPubkey = Object.keys(result)[0];
          const { signature, depositDataRoot } = result[validatorPubkey];

          console.log(minipoolBaseAddress, minipoolFactoryAddress, nodeDepositAddress);
          const salt = crypto.getRandomValues(new Uint8Array(32));
          console.log("Using salt: ", salt);
          const initHash = keccak256(`0x3d602d80600a3d3981f3363d3d373d3d3d363d73${minipoolBaseAddress.slice(2)}5af43d82803e903d91602b57fd5bf3`);
          const keccakedHash = keccak256(initHash);
          const keccakedSalt = keccak256(concat([address, bytesToHex(salt)]));
          console.log(`Creating new minipool address with values: '0xff', ${minipoolFactoryAddress}, ${keccakedSalt}, ${initHash}`);
          const newMinipoolAddress = keccak256(concat(['0xff', minipoolFactoryAddress, keccakedSalt, initHash]));
          const expectedMinipoolAddress = `0x${newMinipoolAddress.slice(-40)}`;
          console.log(`ExpectedMinipoolAddress: ${expectedMinipoolAddress}`);

          const contractData = {
            abi: depositABI,
            address: nodeDepositAddress,
            functionName: 'deposit',
            args: [
              parseEther(bondAmount.toString()),  // _bondAmount
              parseEther('0.05'),// _minimumNodeFee
              validatorPubkey, // _validatorPubkey
              signature, // _validatorSignature
              depositDataRoot, // _depositDataRoot
              bytesToHex(salt), // _salt
              expectedMinipoolAddress, // _expectedMinipoolAddress
            ],
            value: parseEther(bondAmount.toString())
          };
          console.log("Will call contract with data: ", contractData);
          writeContract(contractData).then(() => setIsPending(false));
        }
      }
      nextIndexRefetch();
    }
  }, [signData, signError]);

  useEffect(() => {
    if(balance && bondAmount) {
      setMaxValidators(Math.floor(parseInt(balance.formatted) / bondAmount));
    }
  }, [balance, bondAmount]);

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
        <p>Could not validate your balance: {balanceError}</p>
      ) : balance && parseInt(balance.formatted) >= bondAmount ? (
      <>
        <p>You have sufficient funds to create {maxValidators} validator{maxValidators > 1 ? 's' : ''}!</p>
        <ul>
          <li>Bond: <span className="">LEB{bondAmount}</span></li>
          <li>Fee Recipient Address: {feeRecipient}</li>
          <li>Withdrawal Address: {address}</li>
        </ul>
        Graffiti:
        <Input
          value={graffiti}
          className="border border-slate-200 p-2 rounded-md bg-transparent data-[hover]:shadow"
          name="graffiti"
          type="string"
          placeholder="Enter custom graffiti message"
          onChange={ e => setGraffiti(e.target.value)}
          required
        />
        <TransactionSigner
          onError={setSignError}
          onSuccess={setSignData}
          getMessage={getMessage}
          buttonText="Add Validator"
          path={firstIndex}
          primaryType="AddValidators"
          isPending={isPending}
        />
      </>
      ) : balance ? (
        <p>Balance not sufficient to create a LEB{bondAmount} validator. You only have {balance.formatted} {balance.symbol}</p>
      ) : (
        <p>No balance found. {balanceStatus}</p>
      )}
      </div>
    </div>
  );
};
