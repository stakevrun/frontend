import { type FC, type ReactNode, useEffect } from "react";
import { useState } from "react";
import { useSignTypedData } from "wagmi";
import { FaCoins } from "react-icons/fa";
import type { UseQueryResult } from "@tanstack/react-query";
import { Input, Button } from "@headlessui/react";
import { PayForm } from "../layout/PayForm";
import { SignPaymentForm } from "../layout/SignPaymentForm";
import { useSignPaymentTransaction } from "../../hooks/useSignPaymentTransaction";
import { useReadFee } from "../../hooks/useReadFee";
import { useVrunPrices } from "../../hooks/useVrunPrices";

const Payments = () => {
  const [creditError, setCreditError] = useState();
  const [payHash, setPayHash] = useState();
  const [paySuccess, setPaySuccess] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");

  const {data: creditData, isLoading: creditIsLoading, refetch: creditRefetch} = useReadFee({path: 'credits'});
  const {prices, isLoading: pricesIsLoading, error: pricesError} = useVrunPrices();
  const {data: signData, error: signError} = useSignPaymentTransaction(payHash, prices);

  useEffect(() => {
    if(creditError || pricesError || signError) {
      setHasError(true);
      setError(`${pricesError ? pricesError + "\n" : ""}${creditError ? creditError + "\n" : ""}${signError ? signError + "\n" : ""}`);
    }

    if(!creditError && !pricesError && !signError) {
      setHasError(false);
    }
  }, [creditError, pricesError, signError]);

  useEffect(() => {
    if (signError) {
      setPayHash("");
    } else {
      if (signData) {
        setPaySuccess(`Successfully added ${signData.numDays} days to your balance`);
        setPayHash("");
        creditRefetch();
      }
    }
  }, [signError, signData]);

  useEffect(() => {
    if(creditData) {
      if(creditData.status !== 200) {
        if(creditData.status === 404) {
          setCreditError("You have not yet purchased any credits.");
        } else {
          setCreditError("Something went wrong requesting your credit balance.");
        }
      }
      setCurrentBalance(creditData.value || 0)
    }
  }, [creditData]);

  return (
    <section className="grid gap-4 my-10 py-5">
      {!signError && paySuccess && (
      <div className="self-center whitespace-pre-wrap break-words mt-4 border border-green-500 rounded p-4">
        {paySuccess}
      </div>
      )}
      {hasError && (
      <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
        {error}
      </div>
      )}
      <div className="panel flex-col">
        <div className="flex flex-row mb-2">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <FaCoins className="text-yellow-500 text-xl" />
          </div>
          <h1>Vrün Balance</h1>
        </div>
        {creditIsLoading ? (
          <div className="italic">Loading balance data...</div>
        ) : creditError ? (
          <div className="italic">Could not get your current balance</div>
        ) : (
          <div>{currentBalance} Days</div>
        )}
      </div>
      <PayForm
        onSuccess={setPayHash}
        pricesError={pricesError}
        prices={prices}
        pricesIsLoading={pricesIsLoading}
      />
      <SignPaymentForm
        setPayHash={setPayHash}
        payHash={payHash}
      />
    </section>
  );
};

export default Payments;
