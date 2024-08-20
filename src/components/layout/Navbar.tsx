import { ConnectButton } from "@rainbow-me/rainbowkit";
import ModeToggle from "../ModeToggle";
import { useAccount } from "wagmi";
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
import { SVGProps } from "react";
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
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
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
            <div className="flex flex-shrink-0 items-center">
              <Link className="flex flex-row gap-2" href="/">
                <Image
                  height={30}
                  width={30}
                  src={"/images/vrunlogo.png"}
                  alt="Vrun logo"
                  className="rounded-full"
                />
                <span className="invisible md:visible md:ml-6 content-center text-lg xl:text-2xl font-bold">
                  VRÜN
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {isConnected && (
                <>
                  <Link href="/account" className="content-center">
                    Account
                  </Link>
                  <Link href="/validators" className="content-center">
                    Validators
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="relative inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                <ConnectButton />
              </span>
              <span className="relative inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                <ModeToggle />
              </span>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
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
