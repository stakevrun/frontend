import Link from "next/link";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { FaMoneyBillWave, FaGithub, FaEthereum } from "react-icons/fa";

import styles from "../../styles/Home.module.css"; // remove this once styles are translated into Tailwind

const Resources = () => {
  return (
    <div className="h-auto w-full flex flex-col gap-[10vh] py-[10vh] justify-center items-center bg-purple-600">
      <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-[80%] font-bold text-white">
        Resources & Documentation
      </h2>

      <div className="mx-auto h-auto w-[90%] lg:w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl lg:h-[40rem] lg:max-w-5xl">
        <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gray-100">
          <div className="flex flex-col items-center justify-center max-w-3xl w-full sm:flex-row sm:flex-wrap">
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

                  <Button className="btn-primary text-xs">Stake RPL</Button>
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
                  <Button className="btn-primary text-xs">Get started!</Button>
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
                  <Button className="btn-primary text-xs">Go to Docs</Button>
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
                  <Button className="btn-primary text-xs">Go to Github</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
