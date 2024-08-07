import { useAccount, useChainId } from "wagmi";
import { FC, ReactNode } from "react";

export const IfSigned: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const {address} = useAccount();
  const chainId = useChainId();
  return (
    <>
    <p>Todo: check that the account {address} on {chainId.toString()} has actually signed the ToS. Assuming so...</p>
    {children}
    </>
  );
};
