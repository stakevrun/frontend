import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { FC, ReactNode } from "react";
import { useAccount } from "wagmi";

export const IfConnected: FC<{children: ReactNode}> = ({children}) => {
  const {status} = useAccount();
  return (
    status === 'connected' ? children :
      <section>
        <h2>Please connect your wallet</h2>
        <p>Connection status: {status}</p>
        <ConnectButton />
      </section>
  );
};
export default IfConnected;
