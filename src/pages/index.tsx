import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@headlessui/react";
import {
  FaEthereum,
  FaMoneyBillWave,
  FaGithub,
  FaCoins,
} from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { MdOnlinePrediction } from "react-icons/md";
import { BsSignStopFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";

import { Hero } from "../components/home/Hero";

import styles from "../styles/Home.module.css"; // remove this once styles are translated into Tailwind

const Home: NextPage = () => {
  return (
    <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">
      <Hero />

      <div
        className="h-auto w-full flex flex-col gap-[10vh] py-[10vh] justify-center items-center "
        style={{ backgroundColor: "#8A2BE2" }}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-[80%] font-bold text-white">
          Resources & Documentation
        </h2>

        <div className="mx-auto h-auto w-[90%] lg:w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl lg:h-[40rem] lg:max-w-5xl">
          <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gray-100">
            <div className={styles.grid}>
                  <Link href="/account" className="self-start mt-3">
              <div className={styles.card}>
                <div className="inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                  <FaMoneyBillWave className="text-3xl text-green-500  w-[70px]" />
                </div>
                <div>
                  <h2 className="font-bold text-black">
                    Stake RPL for your Minipools &rarr;
                  </h2>
                  <p>We provide an onsite service for staking your RPL</p>

                    <Button className="btn-primary text-xs">
                      Stake RPL
                    </Button>
                </div>
              </div>
                  </Link>

              <div className={styles.card}>
                <div className="inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                  <FaEthereum className="text-3xl text-blue-500  w-[70px]" />
                </div>

                <div>
                  <h2 className="text-black font-bold">
                    New to Validators & Staking? &rarr;
                  </h2>
                  <p>
                    Learn how Vrün interacts with Ethereum and the beacon chain.
                  </p>
                  <Link href="/faqs">
                    <Button className="btn-primary text-xs">
                      Get started!
                    </Button>
                  </Link>
                </div>
              </div>

              <div className={styles.card}>
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                  <Image
                    width={70}
                    height={70}
                    alt="Rocket Pool Logo"
                    src={"/images/rocketPlogo.png"}
                  />
                </div>
                <div>
                  <h2 className="text-black font-bold">
                    Rocket Pool Docs &rarr;
                  </h2>
                  <p>
                    Learn about the under the hood functions which help to power
                    Vrün!
                  </p>

                  <a
                    href="https://docs.rocketpool.net/overview/contracts-integrations"
                    target="_blank"
                    className="self-start mt-3"
                  >
                    <Button className="btn-primary text-xs">
                      Go to Docs
                    </Button>
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                  <FaGithub className="text-yellow-500 text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-black text-lg mb-1">
                    Vrün GitHub documentation &rarr;
                  </h2>
                  <p className="mb-3">
                    Find in-depth information and routes for our API.
                  </p>
                  <a
                    href="https://github.com/stakevrun/db"
                    target="_blank"
                    className="self-start mt-3"
                  >
                    <Button className="btn-primary text-xs">
                      Go to Github
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-auto py-7 flex items-center justify-center ">
        <div className="max-w-screen-xl w-full  px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why stake with Vrün?
            </h2>

            <p className="mt-4 text-gray-500">
              Premium Validator management service powered by experts in
              Cryptography
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <VscActivateBreakpoints className="text-blue-300 text-2xl" />
              </span>

              <div>
                <h2 className="text-lg font-bold">Secure and reliable</h2>

                <p className="mt-1 text-md text-gray-500 ">
                  Our redundant global network of beacon and execution layer
                  nodes ensures high uptime, guaranteeing your staking
                  operations remain consistently operational and efficient.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <ImPower className="text-yellow-600 text-2xl" />
              </span>

              <div>
                <h2 className="text-lg font-bold">
                  Secure Key and Validator Management
                </h2>

                <p className="mt-1 text-md text-gray-500">
                  Our non-custodial service prioritizes security, keeping your
                  keys and validators safe with cutting-edge encryption and
                  management protocols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <FaCoins className="text-yellow-500 text-xl" />
              </span>

              <div>
                <h2 className="text-lg font-bold">Non-Custodial Service</h2>

                <p className="mt-1 text-md text-gray-500">
                  Experience full control and ownership of your assets with our
                  non-custodial staking solution. Your keys, your control,
                  always.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">No Accounts Necessary</h2>

                <p className="mt-1 text-md text-gray-500">
                  Seamlessly sign in with your wallet. No need for traditional
                  accounts, making the process swift and secure.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <FaEthereum className="text-2xl text-purple-500" />
              </span>

              <div>
                <h2 className="text-lg font-bold">
                  Affordable Staking Solutions
                </h2>

                <p className="mt-1 text-md text-gray-500">
                  Benefit from cost-effective staking without compromising on
                  quality or security. Enjoy staking with competitive pricing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <MdOnlinePrediction className="text-2xl text-blue-500" />
              </span>

              <div>
                <h2 className="text-lg font-bold">
                  Easy Setup, No Hardware Required
                </h2>

                <p className="mt-1 text-md text-gray-500">
                  Begin staking effortlessly. Our service eliminates the need
                  for specialized hardware, providing a hassle-free setup
                  experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <BsSignStopFill className="text-red-400 text-xl" />
              </span>

              <div>
                <h2 className="text-lg font-bold">
                  Full Control Over Your Validator Keys
                </h2>

                <p className="mt-1 text-md text-gray-500">
                  Maintain complete control over your validator keys. Stop or
                  migrate your staking operations anytime, ensuring flexibility
                  and autonomy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <Image
                  width={25}
                  height={25}
                  alt="Rocket Pool Logo"
                  src={"/images/rocketPlogo.png"}
                />
              </span>

              <div>
                <h2 className="text-lg font-bold">
                  Built by the Rocket Pool Community
                </h2>

                <p className="mt-1 text-md text-gray-500">
                  Our service is crafted by members of the Rocket Pool
                  community, ensuring deep integration and robust support within
                  the ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
