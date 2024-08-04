import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export function Navbar() {
  const { address, chainId, isConnected } = useAccount({});

  return (
    <header className="p-2 flex flex-row justify-around items-center">
      <Link href="/">Home</Link>
      {isConnected && <Link href="/account">Account</Link>}
      <ConnectButton />
      {/* debug/sanity check */}
      <div>Address: {address}</div>
      <div>Chain ID: {chainId}</div>
      <div>Connected: {isConnected.toString()}</div>
    </header>
  );
}
