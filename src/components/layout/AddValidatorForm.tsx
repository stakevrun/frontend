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
  interface MinipoolAddressData {
    [expectedMinipoolAddress: string]: string;
  }

  const {address, chainId} = useAccount();
  const {data: nextIndex, error: nextIndexError, refetch: nextIndexRefetch}                      = useReadDb({path: 'nextindex'});
  const {data: feeRecipient, error: feeRecipientError, refetch: feeRecipientRefetch}             = useReadFee({path: 'rp-fee-recipient'});
  const {data: balance, error: balanceError, status: balanceStatus, isPending: balanceIsPending} = useBalance({address, chainId, token: ''});
  const {data: writeContractData, error: writeContractError, status: writeContractStatus, isPending: writeContractPending, writeContractAsync} = useWriteContract();

  const {data: minipoolBaseAddress,    error: minipoolBaseAddressError}    = useRocketAddress("rocketMinipoolBase");
  const {data: minipoolFactoryAddress, error: minipoolFactoryAddressError} = useRocketAddress("rocketMinipoolFactory");
  const {data: nodeDepositAddress,     error: nodeDepositAddressError}     = useRocketAddress("rocketNodeDeposit");
  const [rocketAddressesLoaded, setRocketAddresesLoaded] = useState(false);

  const [signData,  setSignData]  = useState();
  const [signError, setSignError] = useState();
  const [isPending, setIsPending] = useState(false);

  //-- Minipool creation params --
  const [firstIndex,        setFirstIndex]        = useState();
  const [graffiti,          setGraffiti]          = useState("");
  const [bondAmount,        setBondAmount]        = useState(8); // For now, we default to LEB8
  const [minipoolAddresses, setMinipoolAddresses] = useState<MinipoolAddressData>(); // Will be set to a map of the generated minipool addresses and their used salts
  const [amountValidators,  setAmounValidators]   = useState(1); // For now, default to 1 and don't let the user decide yet
  const [maxValidators,     setMaxValidators]     = useState(0); // Based on current connected wallet available funds

  const getMessage = () => {
    if (minipoolAddresses && nextIndex.status === 200 && address) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      onSubmit("Waiting for message signature...", null, false);
      return {
        timestamp,
        firstIndex,
        amountGwei: parseInt(parseUnits('1', 9)), // 1 ETH in gwei
        feeRecipient: feeRecipient.value,
        graffiti,
        withdrawalAddresses: Object.keys(minipoolAddresses),
      };
    } else {
      return { message: null, error: "Could not get all data" };
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
      let generatedAddresses = {};
      while (Object.keys(generatedAddresses).length < amountValidators) {
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
        generatedAddresses[expectedMinipoolAddress] = salt;
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

      Object.keys(result).forEach((minipoolAddress) => {
        if (minipoolAddress in minipoolAddresses) {
          const { pubkey, signature, depositDataRoot } = result[minipoolAddress];

          const contractData = {
            abi: depositABI,
            address: nodeDepositAddress,
            functionName: 'deposit',
            args: [
              parseEther(bondAmount.toString()), // _bondAmount
              parseEther('0.05'), // _minimumNodeFee
              pubkey, // _validatorPubkey
              signature, // _validatorSignature
              depositDataRoot, // _depositDataRoot
              minipoolAddresses[minipoolAddress], // _salt
              minipoolAddresse, // _expectedMinipoolAddress
            ],
            value: parseEther(bondAmount.toString()),
          };
          console.log("Will call contract with data: ", contractData);
          writeContract(contractData)
            .catch((err) => {
              onSubmit(null, `An error occured while trying to sign the minipool deposit transaction: ${err}`, true);
            })
            .finally(() => {
              // Wait till signature approval went through
              while (writeContractPending) {
                sleep(1);
              }
              setIsPending(false);
            });
        } else {
          // Should never happen, but better to check anyway.
          onSubmit(null, "Signed result does not match local state. Could not continue...", true);
          setIsPending(false);
        }
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
        ) : feeRecipientError || feeRecipient.status !== 200 ? (
          <p>Could not contact fee service, please try again later!</p>
        ) : balance && parseInt(balance.formatted) >= bondAmount ? (
          <>
            <p>
              You have sufficient funds to create {maxValidators} validator
              {maxValidators > 1 ? "s" : ""}!
            </p>
            <ul>
              <li>
                Bond: <span className="">LEB{bondAmount}</span>
              </li>
              <li>Fee Recipient Address: {feeRecipient.value}</li>
              <li>
                Withdrawal Address
                {minipoolAddresses && Object.keys(minipoolAddresses).length > 1 && "es"}:
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
              buttonText="Add Validator"
              path={firstIndex}
              primaryType="AddValidators"
              disabled={isPending}
            />
          </>
        ) : balance ? (
          <p>
            Balance not sufficient to create a LEB{bondAmount} validator. You only have {balance.formatted} {balance.symbol}
          </p>
        ) : (
          <p>No balance found. {balanceStatus}</p>
        )}
      </div>
    </div>
  );
};
