import type { FC } from "react";
import { useEffect, useState } from "react";
import { useReadFee } from "../../hooks/useReadFee";

export const CreditOverview: FC<{
  onError: (error: string) => void;
}> = ({ onError }) => {
  const [creditError, setCreditError] = useState<string | undefined>();
  const [currentBalance, setCurrentBalance] = useState<number | undefined>();
  const [hasError, setHasError] = useState<boolean>(false);

  const { data: creditData, isLoading: creditIsLoading } = useReadFee({ path: "credits" });

  useEffect(() => {
    if (creditError) {
      setHasError(true);
      onError(`${creditError}\n`);
    } else {
      setHasError(false);
    }
  }, [creditError, onError]);

  useEffect(() => {
    if (creditData) {
      if (creditData.status !== 200) {
        let errorMessage = "Something went wrong requesting your credit balance.";
        if (creditData.status === 404) {
          errorMessage = "You have not yet purchased any credits.";
        }
        if (creditError !== errorMessage) {
          setCreditError(errorMessage);
        }
        setCurrentBalance(undefined); // Reset balance if error occurs
      } else {
        setCreditError(undefined);
        setCurrentBalance(creditData.value || 0);
      }
    }
  }, [creditData, creditError]);

  return (
    <>
      {creditIsLoading ? (
        <div className="italic">Loading balance data...</div>
      ) : hasError ? (
        <div className="italic">Could not get your current balance</div>
      ) : currentBalance !== undefined ? (
        <div>{currentBalance.toString()} Days</div>
      ) : (
        <div>No credit balance available</div>
      )}
    </>
  );
};
