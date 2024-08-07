import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export function Navbar() {
  const { isConnected } = useAccount({});

  return (
    <header className="px-6 py-4 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-8">
        <Link href="/">Home</Link>
        {isConnected && <Link href="/account">Account</Link>}
      </div>
      <ConnectButton />
    </header>
  );
}
