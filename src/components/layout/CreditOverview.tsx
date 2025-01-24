import { type FC, useEffect, useState } from "react";
import { useReadFee } from "../../hooks/useReadFee";
import { useVrunPrices } from "../../hooks/useVrunPrices";

export const CreditOverview: FC<{
  onError: (error: String) => void;
}> = ({ onError }) => {
  const [creditError,    setCreditError   ] = useState<String>();
  const [currentBalance, setCurrentBalance] = useState<Number>();
  const [hasError,       setHasError      ] = useState<Boolean>(false);

  const {prices, isLoading: pricesIsLoading, error: pricesError}               = useVrunPrices();
  const {data: creditData, isLoading: creditIsLoading, refetch: creditRefetch} = useReadFee({ path: "credits" });

  useEffect(() => {
    if (creditError || pricesError) {
      setHasError(true);
      onError(
        `${pricesError ? pricesError + "\n" : ""}${creditError ? creditError + "\n" : ""}`,
      );
    }

    if (!creditError && !pricesError) {
      setHasError(false);
    }
  }, [creditError, pricesError]);

  useEffect(() => {
    if (creditData) {
      setCreditError("");
      if (creditData.status !== 200) {
        if (creditData.status === 404) {
          setCreditError("You have not yet purchased any credits.");
        } else {
          setCreditError(
            "Something went wrong requesting your credit balance.",
          );
        }
      }
      setCurrentBalance(creditData.value || 0);
    }
  }, [creditData]);

  return (
    <>
      {creditIsLoading ? (
        <div className="italic">Loading balance data...</div>
      ) : creditError ? (
        <div className="italic">Could not get your current balance</div>
      ) : currentBalance && (
        <div>{currentBalance.toString()} Days</div>
      )}
    </>
  );
};
