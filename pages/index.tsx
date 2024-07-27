import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Navbar from "../components/navbar";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { MdBarChart } from "react-icons/md";
import Footer from "../components/footer";
import { FaEthereum } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { ImPower } from "react-icons/im";
import { BsSignStopFill } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa6";
import { GrSatellite } from "react-icons/gr";
import type { RootState } from "../globalredux/store";
import { useAccount, useChainId } from "wagmi";
import { MdOnlinePrediction } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getData } from "../globalredux/Features/validator/valDataSlice";
import { FaDiscord } from "react-icons/fa";

const Home: NextPage = () => {
  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!");
    },
  });

  useEffect(() => {
    console.log("Address: " + address);
  }, [address]);

  const reduxDarkMode = useSelector(
    (state: RootState) => state.darkMode.darkModeOn
  );

  // const [isInitialRender, setIsInitialRender] = useState(true);
  const isInitialRender = useRef(true);

  const dispatch = useDispatch();

  const currentChain = useChainId();

  useEffect(() => {
    if (!isInitialRender.current && address !== undefined) {
      // This block will run after the initial render
      dispatch(getData([{ address: "NO VALIDATORS" }]));
    } else {
      // This block will run only on the initial render

      // setIsInitialRender(false);
      isInitialRender.current = false;

    }
  }, [currentChain, address]);

  return (
    <div
      style={{
        backgroundColor: reduxDarkMode ? "#222" : "white",
        color: reduxDarkMode ? "white" : "#222",
      }}
      className="flex w-full h-auto flex-col"
    >
      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
          name="Vrün  | Nodes & Staking"
        />

        <link href="/favicon.ico" rel="icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>

      <Navbar />

      <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">
        <div className="h-auto w-full flex flex-col justify-center items-center xl:h-[92vh] xl:justify-start py-[5vh] lg:py-[10vh] xl:pt-[10vh]">
          <div className=" w-[75%] h-auto flex flex-col-reverse justify-center items-center xl:flex-row">
            <div className="w-full flex h-full items-center  flex-col justify-center xl:items-end p-4 gap-8 lg:w-[50%] ">
              <h1 className="text-4xl self-center text-center md:text-5xl  lg:text-6xl  xl:text-7xl  xl:self-start xl:text-left font-bold">
                Welcome to Vrün!
              </h1>

              <p className="text-md text-black-100  text-center xl:text-left md:text-lg self-center lg:text-xl  xl:text-2xl  lg:self-start">
                Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking
                for Forward-Thinking Node Operators.
              </p>

              <Link
                href="/createValidator"
                className=" self-center xl:self-start"
              >
                <button className="bg-blue-500 self-center xl:self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                  Create Validator
                </button>
              </Link>

              <a
                href="https://discord.gg/eUhuZfnyVr"
                target="_blank"
                className="lg:text-2xl self-center xl:self-start gap-2 font-bold  flex items-center"
              >
                <FaDiscord />{" "}
                <span className="hover:text-gray-400">
                  join our Discord server!
                </span>
              </a>
            </div>

            <div className="w-full flex h-full items-center flex-col justify-center xl:items-end p-6 lg:w-[50%]">
              <div className=" h-[200px] w-[200px] flex flex-col p-6 items-center justify-center text-blue-600 ml-[20px] xl:h-[400px] xl:w-[400px]">
                <Image
                  src="/images/vrunlogo.png"
                  alt="Vrun logo"
                  width={400}
                  height={400}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-auto w-full flex flex-col gap-[10vh] py-[10vh] justify-center items-center "
          style={{ backgroundColor: "#8A2BE2" }}
        >
          <h2 className="text-2xl  md:text-3xl  lg:text-4xl  xl:text-5xl  max-w-[80%] self-center text-center  font-bold text-white">
            Resources & Documentation
          </h2>

          <div className="mx-auto h-auto w-[90%] lg:w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl lg:h-[40rem] lg:max-w-5xl">
            <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gray-100">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <FaMoneyBillWave className="text-3xl text-green-500  w-[70px]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-black">
                      Stake RPL for your Minipools &rarr;
                    </h2>
                    <p>We provide an onsite service for staking your RPL</p>

                    <Link href="/account" className="self-start mt-3">
                      <button className="bg-blue-500 text-xs self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Stake RPL
                      </button>
                    </Link>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className="inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <FaEthereum className="text-3xl text-blue-500  w-[70px]" />
                  </div>

                  <div>
                    <h2 className="text-black font-bold">
                      New to Validators & Staking? &rarr;
                    </h2>
                    <p>
                      Learn how Vrün interacts with Ethereum and the beacon
                      chain.
                    </p>
                    <Link href="/faqs">
                      <button className="bg-blue-500 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Get started!
                      </button>
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
                      Learn about the under the hood functions which help to
                      power Vrün!
                    </p>

                    <a
                      href="https://docs.rocketpool.net/overview/contracts-integrations"
                      target="_blank"
                      className="self-start mt-3"
                    >
                      <button className="bg-blue-500 text-xs self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Go to Docs
                      </button>
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
                      <button className="bg-blue-500 self-start text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Go to Github
                      </button>
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
                    Experience full control and ownership of your assets with
                    our non-custodial staking solution. Your keys, your control,
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
                    migrate your staking operations anytime, ensuring
                    flexibility and autonomy.
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
                    community, ensuring deep integration and robust support
                    within the ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
