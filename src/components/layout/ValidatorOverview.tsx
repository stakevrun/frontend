import type { FC } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { CallStake } from "../layout/CallStake";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../layout/table";
import { useEffect, useState } from "react";
import { useValidatorData } from "../../hooks/useValidatorData";

export const ValidatorOverview: FC<{
  onError: (error: string) => void;
  showCols: string[];
}> = ({ onError, showCols }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error,    setError   ] = useState<string | undefined>();
  const [message,  setMessage ] = useState<string | undefined>();

  const {
    validatorData,
    hasPrelaunchPools,
    hasPoolsToActivate,
    loading: validatorDataLoading,
    error: validatorDataError,
  } = useValidatorData();

  useEffect(() => {
    if (validatorDataError) {
      let message: string = "An error occurred.";
      if (typeof validatorDataError === "string") {
        message = validatorDataError;
      } else if (validatorDataError instanceof Error) {
        message = validatorDataError.message;
      }
      onError(message);
    }
  }, [validatorDataError, onError]);

  const activateValidator = (
    result: string | undefined,
    error: string | undefined,
    hasError: boolean,
  ) => {
    setError(error);
    setHasError(hasError);
    setMessage(result);
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-4 justify-center mt-5">
        {message && (
          <div className="self-center whitespace-pre-wrap break-words mt-4 border border-blue-500 rounded p-4">
            {message}
          </div>
        )}
        {hasError && (
          <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
            {error}
          </div>
        )}
        {hasPoolsToActivate && (
          <div className="flex flex-row mb-3 items-center border border-orange-500 rounded p-4">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-ornage-600 bg-orange-100 rounded-full mr-6">
              <FaExclamationTriangle className="text-orange-500 text-xl" />
            </div>
            One or more validators are awaiting activation. Please activate them
            as soon as possible by using the corresponding Stake button!
          </div>
        )}
        {!hasPoolsToActivate && hasPrelaunchPools && (
          <div className="flex flex-row mb-3 items-center border border-orange-500 rounded p-4">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-ornage-600 bg-orange-100 rounded-full mr-6">
              <FaExclamationTriangle className="text-orange-500 text-xl" />
            </div>
            One or more validators are in Prelaunch state. Please check back
            within a day to process the activation as soon as possible.
          </div>
        )}
        {validatorDataLoading ? (
          <p>Loading validator data...</p>
        ) : validatorData.length === 0 ? (
          <p>No validator data available.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {(showCols.includes("pubkey") ||
                  showCols.includes("pubkeyShort")) && (
                  <TableHeader>Public Key</TableHeader>
                )}
                {showCols.includes("address") && (
                  <TableHeader>Address</TableHeader>
                )}
                {showCols.includes("index") && (
                  <TableHeader>Validator Index</TableHeader>
                )}
                {showCols.includes("vrunIndex") && (
                  <TableHeader>Vrün Index</TableHeader>
                )}
                {showCols.includes("status") && (
                  <TableHeader>Status</TableHeader>
                )}
                {showCols.includes("statusTime") && (
                  <TableHeader>Status Time</TableHeader>
                )}
                {showCols.includes("action") && (
                  <TableHeader>Action</TableHeader>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {validatorData.map((validator) => (
                <TableRow key={validator.index}>
                  {showCols.includes("pubkey") && (
                    <TableCell>
                      <a href={`/validators/${validator.pubkey}`}>
                        {validator.pubkey}
                      </a>
                    </TableCell>
                  )}
                  {!showCols.includes("pubkey") &&
                    showCols.includes("pubkeyShort") && (
                      <TableCell>
                        <a href={`/validators/${validator.pubkey}`}>
                          <abbr title={validator.pubkey}>
                            {validator.pubkey.substring(0, 7)}
                          </abbr>
                        </a>
                      </TableCell>
                    )}
                  {showCols.includes("address") && (
                    <TableCell>
                      <abbr title={validator.address}>
                        {validator.address.substring(0, 7)}
                      </abbr>
                    </TableCell>
                  )}
                  {showCols.includes("index") && (
                    <TableCell>{validator.index}</TableCell>
                  )}
                  {showCols.includes("vrunIndex") && (
                    <TableCell>{validator.index}</TableCell>
                  )}
                  {showCols.includes("status") && (
                    <TableCell>{validator.status}</TableCell>
                  )}
                  {showCols.includes("statusTime") && (
                    <TableCell>{validator.statusTime}</TableCell>
                  )}
                  {showCols.includes("action") && (
                    <TableCell>
                      {validator.canStake &&
                      validator.status === "Prelaunch" ? (
                        <CallStake
                          onSubmit={activateValidator}
                          pubkey={validator.pubkey}
                          validatorAddress={validator.address}
                          index={validator.index}
                        />
                      ) : validator.status === "Staking" ? (
                        <button>Exit</button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
