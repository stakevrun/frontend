import type { FC, ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ReadContractReturnType, ReadContractErrorType } from "viem";
import { TransactionSubmitter } from "./TransactionSubmitter";
import { Input } from "@headlessui/react";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { useState, useCallback, useEffect } from "react";

export const RegistrationForm: FC<{
  rocketNodeManager: `0x${string}`;
  refetch: (options: {
    cancelRefetch?: boolean | undefined;
    throwOnError?: boolean | undefined;
  }) => Promise<UseQueryResult<ReadContractReturnType, ReadContractErrorType>>;
}> = ({rocketNodeManager, refetch }) => {
  const [selectedTimezone,   setSelectedTimezone  ] = useState<string>("");
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);
  const [hasError,           setHasError          ] = useState<boolean>(false);
  const [error,              setError             ] = useState<string>();

  useEffect(() => {
    if(error && error.length) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [error]);

  const validate = useCallback(() => {
    setError("");
    if (!selectedTimezone || selectedTimezone.length === 0) {
      setHasValidationError(true);
      return false;
    } else {
      return true;
    }
  }, [selectedTimezone]);

  useEffect(() => {
    if(selectedTimezone.length) {
      setHasValidationError(false);
    }
  }, [selectedTimezone]);

  return (
    <div className="w-full max-w-md">
        <div
          id="errmsg"
          className={
            "md:flex md:justify-end text-red-500" +
            (hasError ? " visible" : " invisible")
          }
        > {error} </div>
      <div className="md:flex md:items-center mt-6">
        <div className="md:w-1/3">
          <label
            htmlFor="timezone"
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            Node Timezone:
          </label>
        </div>
        <div className="md:w-2/3">
          <Input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="timezone"
            type="text"
            list="timezones"
            placeholder="Region/City"
            onChange={(e) => setSelectedTimezone(e.target.value.trim())}
            value={selectedTimezone}
            aria-required="true"
            aria-invalid={hasValidationError}
            aria-describedby="errmsg"
          />
        </div>
        <datalist id="timezones">
          {Intl.supportedValuesOf("timeZone").map((timezone, index) => (
            <option key={index}>{timezone}</option>
          ))}
        </datalist>
      </div>
      <div
        id="errmsg"
        className={
          "md:flex md:justify-end text-red-500 text-xs italic" +
          (hasValidationError ? " visible" : " invisible")
        }
      >
        Please select a valid region.
      </div>
      <div className="md:flex md:justify-end mt-3">
        <TransactionSubmitter
          validate={validate}
          buttonText="Register"
          address={rocketNodeManager}
          abi={abi}
          functionName="registerNode"
          args={[selectedTimezone]}
          onSuccess={() => refetch({})}
          onError={setError}
        />
      </div>
    </div>
  );
};

export const IfRegistered: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { address: accountAddress } = useAccount();
  const { data: address, error: addressError } =
    useRocketAddress("rocketNodeManager");

  const {
    data: isRegistered,
    error,
    isPending,
    refetch,
  } = useReadContract({
    address,
    abi,
    functionName: "getNodeExists",
    args: accountAddress && [accountAddress],
  });

  if (!accountAddress) return <p>Error: no connected account</p>;

  return addressError ? (
      <p>Error fetching rocketNodeManager address: {addressError.message}</p>
    ) : isPending ? (
      <p>Fetching node registration status...</p>
    ) : error ? (
      <p>Error reading getNodeExists: {error.message}</p>
    ) : isRegistered ? (
      children
    ) : (
      <RegistrationForm
        rocketNodeManager={address as `0x${string}`}
        refetch={refetch}
      />
    );
};
