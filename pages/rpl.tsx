import React, { useState, useEffect } from 'react'
import RPLBlock from '../components/RPL'
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAccount, useChainId } from 'wagmi';
import NoRegistration from '../components/noRegistration';
import NoConnection from '../components/noConnection';
import storageABI from "../json/storageABI.json"
import managerABI from "../json/managerABI.json"
import { ethers } from 'ethers';


const RPL: NextPage = () => {



    const { address } = useAccount({
        onConnect: async ({ address }) => {
            console.log("Ethereum Wallet Connected!")

            if (address !== undefined) {
                try {

                    const reg = await registrationCheck(address);
                    

                   

                } catch (error) {
                    // Handle any errors that occur during registration check
                    console.error("Error during registration check:", error);
                }
            }

        }
    })



    const [registrationResult, setRegistrationResult] = useState({ result: "" });
    const [isRegistered, setIsRegistered] = useState(true)
    const [isInitialRender, setIsInitialRender] = useState(true);

    const currentChain = useChainId();
    const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"


    const handleRegistrationResult = (result: any) => {
        setRegistrationResult(result);
        // Do whatever you need with the result here
    };


    const registrationCheck = async (add: string) => {

        if (typeof (window as any).ethereum !== "undefined") {

            console.log("Reg Spot 1")

            try {



                let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
                let signer = await browserProvider.getSigner()

                const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
                console.log("Storage Contract:" + storageContract)

                const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))

                const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)
                console.log("Rocket Node Manager:" + rocketNodeManager)
                const bool = await rocketNodeManager.getNodeExists(add)




                console.log("Bool:" + bool)

                setIsRegistered(bool);

                 console.log("Definitely running")

                return bool;

            } catch (error) {

                console.log(error)

                return false;

            }



        }
        else {

            console.log("Window not working")


            return false;

        }


    }



    useEffect(() => {
        if (!isInitialRender && address !== undefined) {
            // This block will run after the initial render
            registrationCheck(address)
        } else {
            // This block will run only on the initial render

            setIsInitialRender(false);
        }
    }, [currentChain, address]);




    return (

        <div className="flex w-full h-auto flex-col">

            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
                    name="Vrün  | Nodes & Staking"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>

            <Navbar />

            {address !== undefined ? (
                <>
                    {isRegistered ? (
                        <>

                            <div className="w-full h-auto pt-[10vh] lg:pt-[0vh] lg:h-[92vh] flex flex-col items-center justify-center gap-[4vh]">

                                <div className="w-full  h-auto  flex flex-col justify-center items-center">




                                    <RPLBlock />
                                </div>

                            </div>

                        </>


                    ) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
                    }
                </>
            ) : (<NoConnection />)}


            <Footer />
        </div>
    )
}

export default RPL