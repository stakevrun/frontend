import type { TypedDataDomain, TypedData } from "viem";
import type { PricingRowType, PricesStateType } from "./useVrunPrices";
import { ETH_TOKEN_ADDRESS } from "../constants";
import { useAccount, useTransaction, useSignTypedData } from "wagmi";
import { useEffect, useState, useCallback } from "react";
import { useWriteFee } from "./useWriteFee";
import { useFeeApiTypes } from "./useApiTypes";
import { formatEther } from "viem";

export function useSignPaymentTransaction(
  transactionHash: `0x${string}` | undefined,
  prices: PricesStateType | undefined,
) {
  interface PaymentTransactionData extends Record<string, unknown> {
    nodeAccount: `0x${string}`,
    numDays: number,
    tokenAddress: `0x${string}`,
    tokenChainId: number,
    transactionHash: string,
  }

  const [error,                setError               ] = useState<string | undefined>();
  const [signedData,           setSignedData          ] = useState<PaymentTransactionData | undefined>();
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}` | undefined>();

  const primaryType = "Pay";
  const { address } = useAccount();

  const { data: typesData, error: typesError }               = useFeeApiTypes();
  const { signTypedDataAsync, error: signingError }          = useSignTypedData();
  const { data: transactionData, status: transactionStatus } = useTransaction({ hash: transactionHash });

  const { mutateAsync } = useWriteFee({ method: "POST", path: "pay", type: primaryType });

  const signTransaction = useCallback(async (types: TypedData, domain: TypedDataDomain, message: PaymentTransactionData) => {
    try {
      const signature = await signTypedDataAsync({
        types,
        domain,
        primaryType,
        message,
      });

      if(signature) {
        const mutation = await mutateAsync({ signature, data: message });
        if (!mutation.ok) {
          setError(await mutation.text());
        } else {
          setSignedData(message);
        }
      }
    } catch (e) {
      let message: string = "An unknown error occurred.";
      if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      setError(message);
      console.warn("Error signing transaction:", e);
    }
  }, [signTypedDataAsync, mutateAsync]);

  // use default ETH_TOKEN_ADDRESS for now. Should be selectable by user eventually
  useEffect(() => {
    setSelectedTokenAddress(ETH_TOKEN_ADDRESS);
  },[]);

  useEffect(() => {
    if(typesError) {
      let message: string = "An error occurred.";
      if (typeof typesError === "string") {
        message = typesError;
      } else if (typesError instanceof Error) {
        message = typesError.message;
      }
      setError(message);
    }
  },[typesError, setError]);

  useEffect(() => {
    if(signingError) {
      let message: string = "An signing error occurred.";
      if (typeof signingError === "string") {
        message = signingError;
      } else if (signingError instanceof Error) {
        message = signingError.message;
      }
      setError(message);
    }
  },[signingError, setError]);

  useEffect(() => {
    if (!transactionHash || !typesData || !transactionData || !prices || !selectedTokenAddress || !address) return;

    console.log("starting signing");
    // clear state
    setError(undefined);
    setSignedData(undefined);

    const { types, domain } = typesData;
    const getNumDays = () => {
      const foundContract = prices.pricingRowData.find((contract: PricingRowType) => {
        return (
          contract.tokenAddress === selectedTokenAddress &&
            contract.tokenChainId === domain.chainId
        );
      });

      if (foundContract) {
        return parseFloat(formatEther(transactionData.value)) / foundContract.price;
      } else {
        console.warn("No matching contract found.");
        return 0;
      }
    };

    if (!transactionData.value) {
      setError("Could not find value for provided transaction hash");
      return;
    }
    if (transactionData.from.toLowerCase() !== address.toLowerCase()) {
      setError(
        `The provided transaction hash does not belong to a transaction which is sent from the currently connected address (${address}). Please switch to the correct address (${transactionData.from}) to sign the transaction.`,
      );
      return;
    }
    if (transactionData.chainId !== domain.chainId) {
      setError(
        `The provided transaction hash does not belong to a transaction for the currently connected chain. Please switch to the same chain (${transactionData.chainId}) to sign the transaction.`,
      );
      return;
    }

    // TODO: get the right tokenAddress matching the selected token (hardcoded for ETH only atm)
    const message:  PaymentTransactionData = {
      nodeAccount: address,
      numDays: getNumDays(),
      tokenAddress: selectedTokenAddress,
      tokenChainId: domain.chainId,
      transactionHash: transactionHash,
    };

    signTransaction(types, domain, message);
  }, [
    typesData,
    transactionData,
    signTypedDataAsync,
    address,
    prices,
    transactionHash,
    selectedTokenAddress,
    signTransaction,
  ]);

  return { data: signedData, error, status: transactionStatus };
}
