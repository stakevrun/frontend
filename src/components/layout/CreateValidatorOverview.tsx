import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useValidatorData } from "../../hooks/useValidatorData";
import { CallStake } from "../layout/CallStake";

export const CreateValidatorOverview: FC<{
  onError: (error: String) => void;
}> = ({ onError }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const {
    validatorData,
    hasPrelaunchPools,
    hasPoolsToActivate,
    loading: validatorDataLoading,
    error: validatorDataError,
  } = useValidatorData();

  useEffect(() => {
    if (validatorDataError) {
      onError(validatorDataError);
    }
  }, [validatorDataError]);

  const activateValidator = (result: String, error: String, hasError: bool) => {
    setError(error);
    setHasError(hasError);
    setMessage(result);
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-center max-w-md">
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
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Status</th>
              <th>Status time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {validatorData
              .filter((validator) => validator.status !== "Staking")
              .map((validator) => (
                <tr key={validator.index}>
                  <td>
                    <abbr title={validator.address}>
                      {validator.address.substring(0, 7)}
                    </abbr>
                  </td>
                  <td>{validator.status}</td>
                  <td>{validator.statusTime}</td>
                  <td>
                    {validator.canStake && validator.status === "Prelaunch" ? (
                      <CallStake
                        onSubmit={activateValidator}
                        pubkey={validator.pubkey}
                        validatorAddress={validator.address}
                        index={validator.index}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
