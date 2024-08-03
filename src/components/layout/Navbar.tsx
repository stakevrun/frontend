import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Navbar() {
  const { address, chainId, isConnected } = useAccount({});

  return (
    <header className="p-2 flex flex-row justify-around items-center">
      <a className="ring rounded hover:bg-sky-200" href="/">Home</a>
      <ConnectButton />
      {isConnected && <a className="ring rounded hover:bg-sky-200" href="/account">Account</a>}
      {/*all these are probably unnecessary: they are in ConnectButton already*/}
      <div>Address: {address}</div>
      <div>Chain ID: {chainId}</div>
      <div>Connected: {isConnected.toString()}</div>
    </header>
  );
}
