import { ConnectButton } from "@rainbow-me/rainbowkit";
import ModeToggle from "../ModeToggle";
import { useAccount } from "wagmi";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { isConnected } = useAccount({});

  return (
    <header className="bg-transparent px-6 py-4 mb-8 flex flex-row justify-between border-b">
      <div className="flex flex-row gap-8 items-center">
        <Link
          className="flex flex-row gap-2"
          href="/"
        >
          <Image
            height={30}
            width={30}
            src={"/images/vrunlogo.png"}
            alt="Vrun logo"
            className="rounded-full"
          />
          <span className="content-center text-lg xl:text-2xl font-bold">VRÜN</span>
        </Link>
        {isConnected && <Link href="/account" className="content-center">Account</Link>}
      </div>
      <ConnectButton />
      <ModeToggle />
    </header>
  );
}
