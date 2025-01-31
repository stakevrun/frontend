import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import { PayForm } from "../layout/PayForm";
import { SignPaymentForm } from "../layout/SignPaymentForm";
import { CreditOverview } from "../layout/CreditOverview";
import { useSignPaymentTransaction } from "../../hooks/useSignPaymentTransaction";
import { useVrunPrices } from "../../hooks/useVrunPrices";

const Payments = () => {
  const [paymentsRefreshKey, setPaymentsRefreshKey] = useState<number>(1);
  const [creditError,        setCreditError       ] = useState<string>();
  const [payHash,            setPayHash           ] = useState<`0x${string}` | undefined>();
  const [paySuccess,         setPaySuccess        ] = useState<string>();
  const [hasError,           setHasError          ] = useState<boolean>(false);
  const [error,              setError             ] = useState<string>("");

  const {prices, isLoading: pricesIsLoading, error: pricesError} = useVrunPrices();
  const {data: signData, error: signError}                       = useSignPaymentTransaction(payHash, prices);

  useEffect(() => {
    if (creditError || pricesError || signError) {
      setPayHash(undefined);
      setHasError(true);
      setError(
        `${pricesError ? pricesError + "\n" : ""}${creditError ? creditError + "\n" : ""}${signError ? signError + "\n" : ""}`,
      );
    }

    if (!creditError && !pricesError && !signError) {
      setHasError(false);
      setError("");
    }
  }, [creditError, pricesError, signError]);

  useEffect(() => {
    if (payHash && signData) {
      setPaySuccess(
        `Successfully added ${signData.numDays} days to your balance`,
      );
      setPayHash(undefined);
      setPaymentsRefreshKey(paymentsRefreshKey + 1); // Force re-render of credit overview to display our new balance
    }
  }, [signData, paymentsRefreshKey, payHash]);

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
        <div className="flex flex-row mb-3">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <FaCoins className="text-yellow-500 text-xl" />
          </div>
          <h2 className="text-lg self-center">Vr&uuml;n Balance</h2>
        </div>
        <CreditOverview key={paymentsRefreshKey} onError={setCreditError} />
      </div>
      <PayForm
        key={paymentsRefreshKey}
        onSuccess={setPayHash}
        pricesError={pricesError}
        prices={prices}
        pricesIsLoading={pricesIsLoading}
      />
      <SignPaymentForm key={payHash} setPayHash={setPayHash} payHash={payHash} />
    </section>
  );
};

export default Payments;
