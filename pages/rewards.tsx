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
import NodePeriodicRewardsTable from "../components/NodePeriodicRewardsTable"




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


<div className="flex flex-col items-center justify-center">
        <NodePeriodicRewardsTable sx={{width: "550px"}} nodeAddress={address} header={"Node rewards table"}/>
        </div>








            <Footer />
        </div>
    );
};

export default Faqs;
