import { useBalance, useAccount, useWriteContract } from "wagmi";
import { parseEther, parseUnits, keccak256, concat, bytesToHex } from "viem";
import { TransactionSigner } from "./TransactionSigner";
import { type FC, useEffect } from "react";
import { FaServer } from "react-icons/fa";
import { Input } from "@headlessui/react";
import { useState } from "react";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { useReadDb } from "../../hooks/useReadDb";
import { useReadFee } from "../../hooks/useReadFee";
import { abi as depositABI } from "../../abi/depositABI";

export const AddValidatorForm: FC<{
  onSubmit: (result: String, error: String, hasError: bool) => void;
}> = ({ onSubmit }) => {
  interface MinipoolAddressData { expectedMinipoolAddress: string, salt: string };

  const {address, chainId} = useAccount();
  const {data: nextIndex, error: nextIndexError, refetch: nextIndexRefetch}                      = useReadDb({path: 'nextindex'});
  const {data: feeRecipient, error: feeRecipientError, refetch: feeRecipientRefetch}             = useReadFee({path: 'rp-fee-recipient'});
  const {data: balance, error: balanceError, isPending: balanceIsPending, status: balanceStatus} = useBalance({address, chainId, token: ''});
  const {data: writeContractData, error: writeContractError, status: writeContractStatus, writeContractAsync} = useWriteContract();

  const {data: minipoolBaseAddress,    error: minipoolBaseAddressError}    = useRocketAddress("rocketMinipoolBase");
  const {data: minipoolFactoryAddress, error: minipoolFactoryAddressError} = useRocketAddress("rocketMinipoolFactory");
  const {data: nodeDepositAddress,     error: nodeDepositAddressError}     = useRocketAddress("rocketNodeDeposit");
  const [rocketAddressesLoaded, setRocketAddresesLoaded] = useState(false);

  const [signData,  setSignData]  = useState();
  const [signError, setSignError] = useState();
  const [isPending, setIsPending] = useState(false);

  // Minipool creation params
  const [firstIndex,        setFirstIndex]        = useState();
  const [bondAmount,        setBondAmount]        = useState(8); // For now, we default to LEB8
  const [graffiti,          setGraffiti]          = useState("");
  const [minipoolAddresses, setMinipoolAddresses] = useState<MinipoolAddressData[]>(); // Should be set to a list of the generated minipool addresses and their used salts
  const [amountValidators,  setAmounValidators]   = useState(1); // For now, default to 1 and don't let the user decide yet
  const [maxValidators,     setMaxValidators]     = useState(0); // Based on current connected wallet available funds

  const getMessage = () => {
    if(minipoolAddresses && nextIndex.status === 200 && address) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const withdrawalAddresses = minipoolAddresses.map((item) => {
        return item.expectedMinipoolAddress
      });
      onSubmit("Waiting for message signature...", null, false);
      return {
        timestamp,
        firstIndex,
        amountGwei: parseInt(parseUnits('1', 9)), // 1 ETH in gwei
        feeRecipient: feeRecipient.value,
        graffiti,
        withdrawalAddresses
      };
    } else {
      return {message: null, error: "Could not get all data" };
    }
  };

  const writeContract = async (message) => {
    onSubmit("Waiting for contract call approval...", null, false);
    try {
      const transactionHash = await writeContractAsync(message);
      console.log(transactionHash);
      onSubmit(`Transaction created with hash: ${transactionHash}`, null, false);
    } catch (e) {
      console.warn("Error calling contract:", e, "With message:", message);
      throw e.message.split("\n", 2).join("\n"); // Only get the first line, don need the full stacktrace
    }
  };

  useEffect(() => {
    if(balance && bondAmount) {
      setMaxValidators(Math.floor(parseInt(balance.formatted) / bondAmount));
    }
  }, [balance, bondAmount]);

  useEffect(() => {
    if(minipoolBaseAddress && minipoolFactoryAddress && nodeDepositAddress) {
      setRocketAddresesLoaded(true);
    }
  }, [minipoolBaseAddress, minipoolFactoryAddress, nodeDepositAddress]);

  useEffect(() => {
    if(nextIndex && nextIndex.status === 200) {
      setFirstIndex(nextIndex.value);
    }
  }, [nextIndex]);

  useEffect(() => {
    if(address && chainId) {
      nextIndexRefetch();
      feeRecipientRefetch();
    }
  }, [address, chainId]);

  useEffect(() => {
    if(rocketAddressesLoaded) {
      setIsPending(true);
      let generatedAddresses = [];
      while(generatedAddresses.length < amountValidators) {
        console.debug(minipoolBaseAddress, minipoolFactoryAddress, nodeDepositAddress);
        const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
        console.debug("Using salt:", salt);
        const initHash = keccak256(`0x3d602d80600a3d3981f3363d3d373d3d3d363d73${minipoolBaseAddress.slice(2)}5af43d82803e903d91602b57fd5bf3`);
        console.debug("Init Hash:", initHash);
        const keccakedSalt = keccak256(concat([address, salt]));
        console.debug(`Creating new minipool address with values: '0xff', ${minipoolFactoryAddress}, ${keccakedSalt}, ${initHash}`);
        const newMinipoolAddress = keccak256(concat(['0xff', minipoolFactoryAddress, keccakedSalt, initHash]));
        const expectedMinipoolAddress = `0x${newMinipoolAddress.slice(-40)}`;
        console.debug("ExpectedMinipoolAddress:", expectedMinipoolAddress);
        generatedAddresses.push({expectedMinipoolAddress, salt});
      }
      setMinipoolAddresses(generatedAddresses);
      setIsPending(false);
    }
  }, [rocketAddressesLoaded, amountValidators, address]);

  useEffect(() => {
    if(signError) {
      onSubmit(null, `An error occured while trying to sign the validator request: ${signError}`, true);
    } else if(signData) {
      //onSubmit(signData, null, false);
      setIsPending(true);
      let result = JSON.parse(signData);

      // TODO: How do we know which minipoolAddresses and Salt are for which returned pubkey?
      // Currently we only create 1 at a time, but this should be validated when creating multiple minipools at once.
      Object.keys(result).forEach((validatorPubkey) => {
        const { signature, depositDataRoot } = result[validatorPubkey];

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
            minipoolAddresses[0].salt, // _salt
            minipoolAddresses[0].expectedMinipoolAddress, // _expectedMinipoolAddress
          ],
          value: parseEther(bondAmount.toString())
        };
        console.log("Will call contract with data: ", contractData);
        writeContract(contractData).catch((err) => {
          onSubmit(null, `An error occured while trying to sign the minipool deposit transaction: ${err}`, true);
        }).finally(() => setIsPending(false));
        //TODO: This will not wait for the function to actually finish since it's async.
        //Should check writeContractStatus to see if a transaction signature is already pending before processing the next key.
      });
      nextIndexRefetch();
    }
  }, [signData, signError]);

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
          <li>Fee Recipient Address: {feeRecipient.value}</li>
          <li>Withdrawal Address: {minipoolAddresses && minipoolAddresses.length ? minipoolAddresses[0].expectedMinipoolAddress : 'computing..'}</li>
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
          disabled={isPending}
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
