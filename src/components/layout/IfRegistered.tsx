import { useAccount, useReadContract, UseReadContractReturnType } from "wagmi";
import { type UseQueryResult } from "@tanstack/react-query";
import { type ReadContractReturnType, type ReadContractErrorType } from "viem";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { TransactionSubmitter } from "./TransactionSubmitter";
import { FC, ReactNode, ChangeEvent, useState } from "react";

export const RegistrationForm: FC<{
  isRegistered: boolean;
  rocketNodeManager: `0x${string}`;
  refetch: (options: {
    cancelRefetch?: boolean | undefined;
    throwOnError?: boolean | undefined;
  }) => Promise<UseQueryResult<ReadContractReturnType, ReadContractErrorType>>;
}> = ({ isRegistered, rocketNodeManager, refetch }) => {
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const handleSelectTimezone = (e: ChangeEvent) => {
    const element = e.currentTarget as HTMLInputElement;
    setSelectedTimezone(element.value || "");
  };
  return (
    <>
      <p>
        Debug Info: isRegistered={isRegistered?.toString()} :{" "}
        {typeof isRegistered}
      </p>
      <p>Placeholder: Rocket Pool logo, Register form heading</p>
      <label>
        <span className="pr-1">Node Timezone:</span>
        <input
          type="text"
          list="timezones"
          placeholder="Region/City"
          onChange={handleSelectTimezone}
          value={selectedTimezone}
        />
      </label>
      <datalist id="timezones">
        {Intl.supportedValuesOf("timeZone").map((timezone, index) => (
          <option key={index}>{timezone}</option>
        ))}
      </datalist>
      <TransactionSubmitter
        buttonText="Register"
        address={rocketNodeManager}
        abi={abi}
        functionName="registerNode"
        args={[selectedTimezone]}
        onSuccess={refetch}
      />
    </>
  );
};

export const IfRegistered: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const {address: accountAddress} = useAccount();

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
    args: accountAddress ? [accountAddress] : undefined, // satisfying type checker - is this ok?
  });
  
  if (!accountAddress) return <p>Error: no connected account</p> // return statements have to come after all hook calls in a component
  return addressError ? (
    <p>Error fetching rocketNodeManager address: {addressError.message}</p>
  ) : isPending ? (
    <p>Fetching node registration status...</p>
  ) : error ? (
    <p>Error reading getNodeExists: {error.message}</p>
  ) : isRegistered ? (
    <>
      <p>Debug Info: Registered with Rocket Pool.</p> {children}
    </>
  ) : (
    <RegistrationForm
      rocketNodeManager={address as `0x${string}`}
      isRegistered={isRegistered}
      refetch={refetch}
    />
  );
};
