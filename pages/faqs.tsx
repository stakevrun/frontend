import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link
    from 'next/link';

import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
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
import { getData } from "../globalredux/Features/validator/valDataSlice"



const Faqs: NextPage = () => {

    const { address } = useAccount({
        onConnect: ({ address }) => {
            console.log("Ethereum Wallet Connected!")
        }
    })


    useEffect(() => {

        console.log(address)

    }, [address])

    const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)
    const dispatch = useDispatch()

    const currentChain = useChainId();
    const [isInitialRender, setIsInitialRender] = useState(true);


    
    useEffect(() => {
        if (!isInitialRender && address !== undefined) {
        // This block will run after the initial render
        dispatch(getData([{address: "NO VALIDATORS"}]))
      
        } else {
        // This block will run only on the initial render
        
                setIsInitialRender(false);
            }
        }, [currentChain, address]);






    return (
        <div style={{ backgroundColor: reduxDarkMode ? "#222" : "white", color: reduxDarkMode ? "white" : "#222" }} className="flex w-full h-auto flex-col">

            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
                    name="Vrün  | Nodes & Staking"

                />


                <link href="/favicon.ico" rel="icon" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@700&family=Figtree:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;1,400;1,500&family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
            </Head>


            <Navbar />




            <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">

                <div className="flex flex-col justify-start items-start gap-4 w-[95%] lg:min-h-[92vh] p-4">
                    <h1 className="text-2xl md:text-4xl self-center my-3 font-bold">Vrün FAQ</h1>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What is Ethereum Staking?</h2>
                        <p>Ethereum staking involves locking up your ETH to support network operations such as transaction validation and network security. In return, you earn rewards.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">How do Staking Rewards Work?</h2>
                        <p>Staking rewards are earned through attestations (validating transactions) and proposals (proposing new blocks). Both activities help secure the network and keep it decentralized.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What are the Risks of Staking?</h2>
                        <p>The primary risk of staking is slashing, where a portion of your staked ETH can be taken away if your validator acts maliciously or makes significant errors.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What is Rocket Pool?</h2>
                        <p>Rocket Pool is a permissionless Ethereum staking protocol catering to both ETH Stakers and Node Operators. It allows users to stake ETH with as little as 0.01 ETH and receive rETH, a liquid staking derivative token. Node operators can run validators with reduced collateral requirements, benefiting from additional commission and RPL rewards.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What are the Risks of Using Rocket Pool?</h2>
                        <p>In addition to general staking risks, using Rocket Pool introduces protocol risk, which includes potential vulnerabilities or bugs within the Rocket Pool protocol that could affect stakers.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What is Vrün?</h2>
                        <p>Vrün is a service for Rocket Pool Node Operators, enabling them to run Rocket Pool nodes without having to set up or manage their own hardware. We provide a secure, non-custodial, and user-friendly staking experience for Node Operators.</p>
                    </div>

                    <div className='mb-4'>
                        <h2 className="text-2xl font-bold mb-2">What are the Risks of Staking with Vrün?</h2>
                        <p>Vrün is entrusted with running, securing, and managing your validator keys. While we ensure high uptime and implement multiple checks to prevent slashing, there is a potential risk of slashed and exited validators due to actions taken by Vrün. To safeguard against the risk of our service becoming unavailable, we also provide encrypted pre-signed exit messages. This ensures you can always exit your validators if necessary, maintaining access and control over your staking operations.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">Why Choose Vrün?</h2>
                        <ul className="list-disc pl-6">
                            <li><span className="font-bold">Secure:</span> We prioritize the safety of your keys and validators.</li>
                            <li><span className="font-bold">Non-Custodial:</span> You maintain full control over your assets.</li>
                            <li><span className="font-bold">Easy Setup:</span> No hardware required, start staking quickly.</li>
                            <li><span className="font-bold">Affordable:</span> Cost-effective staking solutions.</li>
                            <li><span className="font-bold">Community-Built:</span> Developed by Rocket Pool community members, ensuring deep integration and support.</li>
                        </ul>
                    </div>
                </div>



            </div>




            <Footer />
        </div>
    );
};

export default Faqs;
