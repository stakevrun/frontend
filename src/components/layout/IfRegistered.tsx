import type { FC, ReactNode, ChangeEvent } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ReadContractReturnType, ReadContractErrorType } from "viem";
import { TransactionSubmitter } from "./TransactionSubmitter";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { useState } from "react";

export const RegistrationForm: FC<{
  isRegistered: boolean;
  rocketNodeManager: `0x${string}`;
  refetch: (options: {
    cancelRefetch?: boolean | undefined;
    throwOnError?: boolean | undefined;
  }) => Promise<UseQueryResult<ReadContractReturnType, ReadContractErrorType>>;
}> = ({ isRegistered, rocketNodeManager, refetch }) => {
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [error,            setError           ] = useState<boolean>(false);

  const handleSelectTimezone = (e: ChangeEvent) => {
    const element = e.currentTarget as HTMLInputElement;
    setSelectedTimezone(element.value || "");
  };

  const validate = () => {
    if (!selectedTimezone.trim()) {
      setError(true);
      return false;
    } else {
      setError(false);
      return true;
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="my-4 text-center">
        Placeholder: Rocket Pool logo, Register form heading
      </p>
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
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="timezone"
            type="text"
            list="timezones"
            placeholder="Region/City"
            onChange={handleSelectTimezone}
            value={selectedTimezone}
            aria-required="true"
            aria-invalid={error}
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
          (error ? " visible" : " invisible")
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
      isRegistered={isRegistered}
      refetch={refetch}
    />
  );
};
