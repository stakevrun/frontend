import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Navbar() {
  const { address, chainId, isConnected } = useAccount({});

  return (
    <header className="p-2 flex flex-row justify-around items-center">
      <ConnectButton />
      <div>Address: {address}</div>
      <div>Chain ID: {chainId}</div>
      <div>Connected: {isConnected.toString()}</div>
    </header>
  );
}
