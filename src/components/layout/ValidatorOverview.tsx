import type { FC } from "react";
import type { ValidatorData } from "../../hooks/useValidatorData";
import { FaExclamationTriangle, FaCheckCircle, FaFunnelDollar } from "react-icons/fa";
import { FaTornado, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { ImExit, ImCross } from "react-icons/im";
import { CallStake } from "../layout/CallStake";
import { CallExit } from "../layout/CallExit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../layout/table";
import { useEffect, useState } from "react";
import { useValidatorData } from "../../hooks/useValidatorData";
import { useReadBeaconNode } from "../../hooks/useReadBeaconNode";
import { useCurrentEpoch, useDateFromEpoch } from "../../hooks/useEpoch";

/*
  pending_initialized - When the first deposit is processed, but not enough funds are available (or not yet the end of the first epoch) to get validator into the activation queue.
  pending_queued - When validator is waiting to get activated, and have enough funds etc. while in the queue, validator activation epoch keeps changing until it gets to the front and make it through (finalization is a requirement here too).
  active_ongoing - When validator must be attesting, and have not initiated any exit.
  active_exiting - When validator is still active, but filed a voluntary request to exit.
  active_slashed - When validator is still active, but have a slashed status and is scheduled to exit.
  exited_unslashed - When validator has reached regular exit epoch, not being slashed, and doesn't have to attest any more, but cannot withdraw yet.
  exited_slashed - When validator has reached regular exit epoch, but was slashed, have to wait for a longer withdrawal period.
  withdrawal_possible - After validator has exited, a while later is permitted to move funds, and is truly out of the system.
  withdrawal_done - (not possible in phase0, except slashing full balance) - actually having moved funds away
*/

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
                {showCols.includes("action") && (
                  <TableHeader>Action</TableHeader>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {validatorData.map((validator) => (
                <ValidatorInfo
                  key={validator.index}
                  onMessage={setMessage}
                  onError={setError}
                  onHasError={setHasError}
                  showCols={showCols}
                  validator={validator}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

const ValidatorInfo: FC<{
  onError: (error: string) => void;
  onHasError: (state: boolean) => void;
  onMessage: (message: string) => void;
  showCols: string[];
  validator: ValidatorData;
}> = ({ onError, onHasError, onMessage, showCols, validator }) => {
  interface BeaconValidatorDataType {
    pubkey: `0x${string}`;
    withdrawal_credentials: `0x${string}`;
    effective_balance: string;
    slashed: boolean;
    activation_eligibility_epoch: string;
    activation_epoch: string;
    exit_epoch: string;
    withdrawable_epoch: string;
  }
  const [status,         setStatus        ] = useState<string>();
  const [validatorData,  setValidatorData ] = useState<BeaconValidatorDataType>();
  const [validatorIndex, setValidatorIndex] = useState<number>();

  const {
    data: validatorBeaconInfo,
    error: readBeaconNodeError,
    isLoading: readBeaconNodeLoading,
    refetch: readBeaconNodeRefetch,
  } = useReadBeaconNode({path: `eth/v1/beacon/states/head/validators/${validator.pubkey}`});
  const { data: currentEpoch, error: currentEpochError } = useCurrentEpoch();

  const activateValidator = (
    result: string | undefined,
    error: string | undefined,
    hasError: boolean,
  ) => {
    if(error) {
      onError(error);
    }
    onHasError(hasError);
    if(result) {
      onMessage(result);
    }
  };

  const exitValidator = (
    result: string | undefined,
    error: string | undefined,
    hasError: boolean,
  ) => {
    if(error) {
      onError(error);
    }
    onHasError(hasError);
    if(result) {
      onMessage(result);
    }
    readBeaconNodeRefetch();
  };

  useEffect(() => {
    if(validatorBeaconInfo && !readBeaconNodeLoading) {
      setStatus(validatorBeaconInfo.value.data.status);
      setValidatorData(validatorBeaconInfo.value.data.validator);
      setValidatorIndex(parseInt(validatorBeaconInfo.value.data.index));
    }
  }, [validatorBeaconInfo, readBeaconNodeLoading]);

  useEffect(() => {
    if(readBeaconNodeError) {
      let message: string = "An error occurred retreiving beacon info.";
      if (typeof readBeaconNodeError === "string") {
        message = readBeaconNodeError;
      } else if (readBeaconNodeError instanceof Error) {
        message = readBeaconNodeError.message;
      }
      onError(message);
    }
  }, [readBeaconNodeError, onError]);

  useEffect(() => {
    if(currentEpochError) {
      onError(currentEpochError);
    }
  }, [currentEpochError, onError]);

  return (
    <>
    {readBeaconNodeLoading ? (
      <TableRow>
        <TableCell colSpan={showCols.length}>Loading...</TableCell>
      </TableRow>
    ) : (
      <TableRow>
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
        <TableCell>
          {validatorBeaconInfo && (
          <a href={`https://holesky.beaconcha.in/validator/${validatorIndex}`}>
            {validatorIndex}
          </a>
          )}
        </TableCell>
      )}
      {showCols.includes("vrunIndex") && (
        <TableCell>{validator.index}</TableCell>
      )}
      {showCols.includes("status") && (
        <TableCell>
        {status === "active_exiting" ? (
          <div className="flex flex-row items-center">
            <ImExit className="text-orange-500 me-1" />
            Exiting
          </div>
        ) : status === "exited_unslashed" ? (
          <div>
            <div className="flex flex-row items-center">
              <ImCross className="text-red-500 me-1" />
              Exited since
            </div>
            { validatorData &&
              <EpochDate
                onError={onError}
                onHasError={onHasError}
                epoch={validatorData.exit_epoch}
              />
            }
          </div>
        ) : validator.status === "Staking" ? (
          <div>
            <div className="flex flex-row items-center">
              <FaCheckCircle className="text-green-500 me-1" />
              {validator.status}
            </div>
            {validator.statusTime || ""}
          </div>
        ) : validator.status === "Dissolved" ? (
          <div>
            <div className="flex flex-row items-center">
              <FaTornado className="text-red-500 me-1" />
              {validator.status} since
            </div>
            {validator.statusTime || ""}
          </div>
        ) : (
          <div>
            {validator.status || ""}
            {validator.statusTime || ""}
          </div>
        )}
        </TableCell>
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
        ) : validator.status === "Dissolved" ? (
          <a className="flex flex-row items-center" href="https://docs.rocketpool.net/guides/node/rescue-dissolved">
            <FaArrowUpRightFromSquare className="text-blue-500 me-1"/>
            How-to Rescue
          </a>
        ) : status === "active_exiting" ? (
          <div className="flex flex-row items-center">
            <ImExit className="text-orange-500 me-1" /> Exiting
          </div>
        ) : status === "exited_unslashed" ? (
          <div>
            <div className="flex flex-row items-center">
              <FaFunnelDollar className="text-orange-500 me-1" /> Withdrawable at
            </div>
            { validatorData &&
              <EpochDate
                onError={onError}
                onHasError={onHasError}
                epoch={validatorData.withdrawable_epoch}
              />
            }
          </div>
        ) : validator.status === "Staking" && currentEpoch ? (
          <CallExit
            onSubmit={exitValidator}
            pubkey={validator.pubkey}
            validatorIndex={validatorIndex}
            index={validator.index}
            epoch={currentEpoch}
            />
        ) : (
          ""
        )}
        </TableCell>
      )}
      </TableRow>
    )}
    </>
  );
};

const EpochDate: FC<{
  onError: (error: string) => void;
  onHasError: (state: boolean) => void;
  epoch: string;
}> = ({ onError, onHasError, epoch}) => {
  const { data, error } = useDateFromEpoch({epoch: parseInt(epoch)});

  useEffect(() => {
    if(error) {
      onError(error);
      onHasError(true);
    }
  }, [error, onError, onHasError]);

  return (
    <span>{data && `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`}</span>
  );
};
