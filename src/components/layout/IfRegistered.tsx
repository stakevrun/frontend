import { useReadContract } from "wagmi";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { TransactionSubmitter } from "./TransactionSubmitter";
import { FC, ReactNode, useState } from "react";

export const RegistrationForm: FC<{isRegistered: boolean, rocketNodeManager: address}> = ({isRegistered, rocketNodeManager}) => {
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const handleSelectTimezone = (e) => {
    setSelectedTimezone(e.target.value || "");
  };
  return (
    <>
    <p>Debug Info: isRegistered={isRegistered?.toString()} : {typeof isRegistered}</p>
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
     {Intl.supportedValuesOf('timeZone').map(timezone => (
       <option>{timezone}</option>
     ))}
    </datalist>
    <TransactionSubmitter
       buttonText="Register"
       address={rocketNodeManager}
       abi={abi}
       functionName="registerNode"
       args={[selectedTimezone]}
    />
    </>
  );
};

export const IfRegistered: FC<{children: ReactNode, address: `0x${string}` | undefined}> = ({children, address: accountAddress}) => {
  const {data: address} = useRocketAddress('rocketNodeManager');
  const {data: isRegistered, error, isPending} = useReadContract({
    address, abi, functionName: 'getNodeExists', args: accountAddress ? [accountAddress] : undefined,
  });
  return (
    isPending ? <p>Fetching node registration status...</p> :
      error ? <p>Error reading getNodeExists: {error.message}</p> :
        isRegistered ? <><p>Debug Info: Registered with Rocket Pool.</p> {children}</> :
          <RegistrationForm rocketNodeManager={address} isRegistered={isRegistered} />
  );
};
