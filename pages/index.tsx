import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link
  from 'next/link';
import { useAccount } from 'wagmi';
import Navbar from '../components/navbar';
import { useEffect } from 'react';
import Image from 'next/image';
import { MdBarChart } from "react-icons/md";
import Footer from '../components/footer';
import { FaEthereum } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { ImPower } from "react-icons/im";
import { BsSignStopFill } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa6";
import { GrSatellite } from "react-icons/gr";
import type { RootState } from '../globalredux/store';
import { useSelector, useDispatch } from 'react-redux';



const Home: NextPage = () => {

  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")
    }
  })


  useEffect(() => {

    console.log(address)

  }, [address])

  const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)






  return (
    <div style={{ backgroundColor: reduxDarkMode ? "#222" : "white", color: reduxDarkMode ? "white" : "#222", fontFamily: "Poppins" }} className="flex w-full h-auto flex-col">

      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
          name="Vrün  | Nodes & Staking"

        />


        <link href="/favicon.ico" rel="icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@700&family=Figtree:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;1,400;1,500&family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet"/>
      </Head>


      <Navbar />




      <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">


        <div className='h-auto w-full flex flex-col justify-center items-center xl:h-[92vh] xl:justify-start xl:pt-[10vh]'>
          <div className=" w-[75%] h-auto flex flex-col-reverse justify-center items-center xl:flex-row">


            <div className="w-full flex h-full items-center  flex-col justify-center lg:items-end p-4 gap-8 lg:w-[50%] ">

              <h1 className='text-4xl self-center text-center md:text-5xl  lg:text-6xl  xl:text-7xl  xl:self-start xl:text-left  font-bold'>
                Welcome to Vrün!
              </h1>

              <p className="text-md text-black-100  text-center lg:text-left md:text-lg self-center lg:text-xl  xl:text-2xl  lg:self-start">
                Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators.
              </p>

              <Link href="/createValidator" className=' self-center xl:self-start'>

                <button className="bg-blue-500 self-center xl:self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                  Create Validator
                </button>

              </Link>

            </div>

            <div className="w-full flex h-full items-center flex-col justify-center lg:items-end p-9 gap-6 lg:w-[50%]">


              <div className=" h-[200px] w-[200px] flex flex-col p-6 items-center justify-center text-blue-600 ml-[20px] bg-blue-100 rounded-full lg:h-[400px] lg:w-[400px]">
                <MdBarChart className="text-xl text-blue-500 mb-2" style={{ width: '100%', height: '100%' }} />

              </div>

            </div>

          </div>

        </div>

        <div className='h-auto w-full flex flex-col gap-[10vh] py-[10vh] justify-center items-center ' style={{ backgroundColor: "#8A2BE2" }}>

          <h2 className="text-2xl  md:text-3xl  lg:text-4xl  xl:text-5xl  self-center text-center  font-bold text-white">Resources & Documentation</h2>

          <div className="mx-auto h-auto w-[90%] lg:w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl md:h-[40rem] lg:max-w-5xl">

            <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gray-100">

              <div className={styles.grid}>
                <div className={styles.card} >
                  <div className="inline-flex   flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <FaMoneyBillWave className="text-3xl text-green-500  w-[70px]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-black">Stake RPL for your Minipools &rarr;</h2>
                    <p>We provide an onsite service for staking your RPL</p>

                    <Link href="/account" className='self-start mt-3'>

                      <button className="bg-blue-500 self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
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
                    <h2 className="text-black font-bold">New to Validators & Staking? &rarr;</h2>
                    <p>Learn how to interact with Ethereum and the beacon chain</p>
                    <a href="https://ethereum.org/en/developers/docs/" target='_blank' className='self-start mt-3'>
                      <button className="bg-blue-500 self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >

                        Get Started!

                      </button>
                    </a>

                  </div>
                </div>

                <div
                  className={styles.card}

                >
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <Image
                      width={70}
                      height={70}
                      alt="Rocket Pool Logo"
                      src={"/images/rocketPlogo.png"} />
                  </div>
                  <div>
                    <h2 className="text-black font-bold">Rocket Pool Docs &rarr;</h2>
                    <p>Learn about the under the hood functions which help to power Vrün!</p>

                    <a href="https://docs.rocketpool.net/overview/contracts-integrations" target='_blank' className='self-start mt-3'>
                      <button className="bg-blue-500 self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >

                        Go to Docs

                      </button>
                    </a>
                  </div>
                </div>

                <div className={styles.card} >
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">

                    <GrSatellite className="text-yellow-500 text-2xl" />

                  </div>
                  <div>
                    <h2 className="font-bold text-black text-lg mb-1">Swagger UI documentation &rarr;</h2>
                    <p className='mb-3'>Find in-depth information about Swagger UI and the various routes used.</p>
                    <a href="https://beaconcha.in/api/v1/docs/index.html" target='_blank' className='self-start mt-3'>
                      <button className="bg-blue-500 self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >

                        Go to Swagger

                      </button>
                    </a>
                  </div>
                </div>




              </div>

            </div>





          </div>

        </div>

        <div className='w-full h-auto py-7 flex items-center justify-center '>

          <div className="max-w-screen-xl w-full  px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Why stake with Vrün?</h2>

              <p className="mt-4 text-gray-500">
                Premium Validator management service powered by experts in Cryptography
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
                    Efficient and secure service, discreet management of secrets and 99% attestations guaranteed.

                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                  <ImPower className="text-yellow-600 text-2xl" />
                </span>

                <div>
                  <h2 className="text-lg font-bold">Live UI/UX Interface</h2>

                  <p className="mt-1 text-md text-gray-500">
                    Watch your Validators progress with the live interface. All actions, countdowns and updates are picked-up as they happen, allowing you to feel secure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                  <FaCoins className="text-yellow-500 text-xl" />
                </span>

                <div>
                  <h2 className="text-lg font-bold">Rewards</h2>

                  <p className="mt-1 text-md text-gray-500">
                    For a small fee of ETH each day, reap the lucrative rewards of the Rocket Pool Staking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>

                <div>
                  <h2 className="text-lg font-bold">Community Building</h2>

                  <p className="mt-1 text-md text-gray-500">
                    By staking with Vrun (and Rocket Pool), you are allowing small-time investors to reap rewards with the rETH token.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">

                <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                  <BsSignStopFill className="text-red-400 text-xl" />
                </span>


                <div>
                  <h2 className="text-lg font-bold">Stop at anytime</h2>

                  <p className="mt-1 text-md text-gray-500">
                    You may stop the charges to your account at any time with our Enable/Disable function. Able to be toggled  for each Validator in the <Link className="font-bold hover:text-blue-300 cursor-pointer" href={"/account"}> account page.</Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                  <FaEthereum className="text-2xl text-blue-500" />
                </span>



                <div>
                  <h2 className="text-lg font-bold">Made with Expertise</h2>

                  <p className="mt-1 text-md text-gray-500">
                    The core functionality of our service was produced by seasoned developers with many years experience with the EVM.
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
