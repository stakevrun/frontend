import { ConnectButton } from "@rainbow-me/rainbowkit";
import ModeToggle from "../ModeToggle";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { mock } from "wagmi/connectors";
import Link from "next/link";
import Image from "next/image";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { SVGProps, useState } from "react";
import { Button } from "@headlessui/react";
import { usePathname } from "next/navigation";

function Bars3Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${props.className} size-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function XMarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${props.className} size-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export function Navbar() {
  const { isConnected } = useAccount({});
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const [mockInput, setMockInput] = useState<`0x${string}`>("0x");
  const handleMockInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.value && e.target.value.startsWith("0x"))
      setMockInput(e.target.value as `0x${string}`);
    else setMockInput("0x");
  };
  const handleMockButton = () => {
    if (isConnected) {
      console.log("Disconnecting manually");
      disconnect();
    } else {
      console.log(`Connecting manually to view ${mockInput}`);
      connect({ connector: mock({ accounts: [mockInput], features: {} }) });
    }
  };

  return (
    <Disclosure
      as="nav"
      className="bg-transparent text-xs sm:text-sm lg:text-base"
    >
      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-4 lg:px-6">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center lg:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="invisible lg:visible flex flex-shrink-0 items-center">
              <Link className="flex flex-row gap-2" href="/">
                <Image
                  height={30}
                  width={30}
                  src={"/images/vrunlogo.png"}
                  alt="Vrun logo"
                  className="rounded-full"
                />
                <span className="content-center text-lg xl:text-2xl font-bold">
                  VRÜN
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4 text-slate-700 dark:text-slate-300">
              {isConnected && (
                <>
                  <Link
                    href="/account"
                    className="content-center hover:text-sky-700 dark:hover:text-slate-100 mx-8"
                  >
                    Account
                  </Link>
                  <Link
                    href="/validators"
                    className="content-center hover:text-sky-700 dark:hover:text-slate-100"
                  >
                    Validators
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="relative inline-flex align-top items-center gap-x-1.5 my-1 p-1 text-xs font-semibold dark:bg-violet-500 rounded-2xl dark:shadow-[0px_0px_42px_-3px_#8b5cf6;]">
                <ConnectButton
                  accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
                />
              </span>
              <span className="relative inline-flex align-top items-center gap-x-1.5 my-1 py-2 px-3 text-xs font-semibold rounded-2xl">
                {isConnected || (
                <label>
                  Address:{" "}
                  <input
                    type="text"
                    onInput={handleMockInput}
                    className="border border-slate-400 rounded-md px-2 py-1 bg-transparent"
                  />
                </label>
                )}
                <Button className="btn-primary" onClick={handleMockButton}>
                  {isConnected ? "Stop Viewing" : "View Account"}
                </Button>
              </span>
              <span className="relative inline-flex align-top items-center gap-x-1.5 px-3 py-2">
                <ModeToggle />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TODO make visibility conditional on connected state, maybe replace with connect button*/}
      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <DisclosureButton key={"home"} as={Link} href={"/"} className="block">
            Home
          </DisclosureButton>
          <DisclosureButton
            key={"account"}
            as={Link}
            href={"/account"}
            className="block"
          >
            Account
          </DisclosureButton>
          <DisclosureButton
            key={"validators"}
            as={Link}
            href={"/validators"}
            className="block"
          >
            Validators
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
  {
    /* </Disclosure>
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
        {isConnected && (
          <>
          <Link href="/account" className="content-center">Account</Link>
          <Link href="/validators" className="content-center">Validators</Link>
          </>
        )}
      </div>
      <ConnectButton />
      <ModeToggle />
    </header> */
  }
}
