import { useReadContract } from "wagmi";
import { abi } from "../../abi/rocketNodeManagerABI";
import { useRocketAddress } from "../../hooks/useRocketAddress";

export const RegistrationForm = ({isRegistered}) => {
  return (
    <p>placeholder: form to register with rocket pool, since isRegistered={isRegistered?.toString()} : {typeof isRegistered}</p>
  );
};

export const IfRegistered = ({children, address: accountAddress}) => {
  const {data: address} = useRocketAddress({contractName: 'rocketNodeManager'});
  const {data: isRegistered, error, isPending} = useReadContract({
    address, abi, functionName: 'getNodeExists', args: [accountAddress],
  });
  return (
    isPending ? <p>Fetching node registration status...</p> :
      error ? <p>Error reading getNodeExists: {error.message}</p> :
        isRegistered ? children :
          <RegistrationForm isRegistered={isRegistered} />
  );
};
