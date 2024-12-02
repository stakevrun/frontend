import { useAccount, useTransaction, useSignTypedData } from "wagmi";
import { useEffect, useState, useRef } from "react";
import { useWriteFee } from "./useWriteFee";
import { useFeeApiTypes } from "./useApiTypes";
import { API_URL } from '../constants';
import { formatEther } from 'viem';

export function useSignPaymentTransaction(transactionHash: string, prices: object) {
  const [ error, setError ] = useState(null);
  const [ signedData, setSignedData ] = useState(null);

  const {data: typesData, error: typesError} = useFeeApiTypes();
  const {signTypedDataAsync, error: signingError} = useSignTypedData();
  const primaryType = "Pay";

  const {address, chainId} = useAccount();
  const {data: transactionData, status: transactionStatus} = useTransaction({hash: transactionHash});

  const { mutateAsync } = useWriteFee({method: 'POST', path: "pay", type: primaryType });

  useEffect(() => {
    if (!typesData || !transactionData || !prices) return;

    // clear state
    setError(null);
    setSignedData(null);

    const {types, domain} = typesData;
    const getNumDays = () => {
      return (formatEther(transactionData.value) /
      prices.pricingRowData.find((contract) => {
        return contract.tokenAddress === '0x0000000000000000000000000000000000000000' && contract.tokenChainId === domain.chainId;
      }).price);
    }

    if(!transactionData.value) {
      setError("Could not find value for provided transaction hash");
      return;
    }
    if(transactionData.from.toLowerCase() !== address.toLowerCase()) {
      setError(`The provided transaction hash does not belong to a transaction which is sent from the currently connected address (${address}). Please switch to the correct address (${transactionData.from}) to sign the transaction.`);
      return;
    }
    if(transactionData.chainId !== domain.chainId) {
      setError(`The provided transaction hash does not belong to a transaction for the currently connected chain. Please switch to the same chain (${transactionData.chainId}) to sign the transaction.`);
      return;
    }

    // TODO: compose the right values for message
    const message = {
      nodeAccount: address,
      numDays: getNumDays(),
      tokenAddress: '0x0000000000000000000000000000000000000000',
      tokenChainId: domain.chainId,
      transactionHash: transactionHash,
    }

    const signTransaction = async () => {
      try {
        const signature = await signTypedDataAsync({ types, domain, primaryType, message });
        if (signingError) return;

        const mutation = await mutateAsync({ signature, data: message });
        if (!mutation.ok) {
          setError(await mutation.text());
        } else {
          setSignedData(message);
        }
      } catch (e) {
        setError(e.message);
        console.warn("Error signing transaction:", e);
      }
    };

    signTransaction();
  }, [typesData, transactionData, signTypedDataAsync, address, prices, transactionHash]);

  return { data: signedData, error }
}
