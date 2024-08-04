import { useReadContract } from "wagmi";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";
import { FC, ReactNode } from "react";

export const RegistrationForm: FC<{isRegistered: boolean}> = ({isRegistered}) => {
  return (
    <p>placeholder: form to register with rocket pool, since isRegistered={isRegistered?.toString()} : {typeof isRegistered}</p>
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
        isRegistered ? children :
          <RegistrationForm isRegistered={isRegistered} />
  );
};
