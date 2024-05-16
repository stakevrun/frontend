import React, { useState } from 'react'
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ethers } from 'ethers';
import feeABI from "../json/feeABI.json"
import storageABI from "../json/storageABI.json"
import managerABI from "../json/managerABI.json"
import confetti from 'canvas-confetti';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../globalredux/store';
import { getPaymentsData } from "../globalredux/Features/payments/paymentSlice"
import { getChargesData } from "../globalredux/Features/charges/chargesSlice"
import { useAccount, useChainId } from 'wagmi';
import NoRegistration from '../components/noRegistration';
import NoConnection from '../components/noConnection';

const Payments: NextPage = () => {

    const reduxPayments = useSelector((state: RootState) => state.paymentsData.data)
    const reduxCharges = useSelector((state: RootState) => state.chargesData.data)
    const reduxData = useSelector((state: RootState) => state.valData.data);



    const dispatch = useDispatch()
    const currentChain = useChainId();
    const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"



    const [isRegistered, setIsRegistered] = useState(true)
    const [paymentErrorMessage, setPaymentErrorMessage] = useState("")
    const [feeETHInput, setFeeETHInput] = useState("")



    const { address } = useAccount({
        onConnect: async ({ address }) => {
            console.log("Ethereum Wallet Connected!")

            if (address !== undefined) {
                try {

                    const reg = await registrationCheck(address);
                    setIsRegistered(reg);

                    if (reg === true) {

                        getPayments();

                        getCharges();


                    }

                } catch (error) {
                    // Handle any errors that occur during registration check
                    console.error("Error during registration check:", error);
                }
            }

        }
    })


    const handleETHInput = (e: any) => {
        setFeeETHInput(e.target.value)
    }


    const makePayment = async () => {



        try {
            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()


            const feeAddress = "0x272347F941fb5f35854D8f5DbDcEdef1A515dB41";


            const FeeContract = new ethers.Contract(feeAddress, feeABI, signer);

            let result = await FeeContract.payEther({ value: ethers.parseEther(feeETHInput) });

            let receipt = await result.wait();

            // Check if the transaction was successful (status === 1)
            if (receipt.status === 1) {
                // If successful, setShowForm3(false)

                setFeeETHInput("")
                getPayments();

                alert("Success! There should be Confetti here and preloader over buttons!")
                triggerConfetti();

                console.log("Transaction successful:", receipt);
            } else {
                console.error("Transaction failed:", result);
                // Handle the failure if needed



                setPaymentErrorMessage(result)


            }



        } catch (e: any) {

            if (e.reason === "rejected") {
                setPaymentErrorMessage(e.reason.toString())

            }
            else {
                setPaymentErrorMessage(e.error["message"].toString())
            }





        }





    }


    const getPayments = async () => {



        type RowType = {
            payments: number; // Assuming payments are numbers for calculation
        }


        let paymentData: Array<RowType> = [];


        const payments: string = await fetch(`https://xrchz.net/stakevrun/fee/${currentChain}/${address}/payments`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(async response => {

                var jsonObject = await response.json()




                let balance = BigInt(0);
                for (const [tokenAddress, payments] of Object.entries(jsonObject)) {


                    const paymentsObject = Object(payments)

                    for (const { amount, timestamp, tx } of paymentsObject) {

                        balance += BigInt(amount);



                    }



                }




                return ethers.formatEther(balance);

            })
            .catch(error => {

                console.log(error);
                return "";
            });




        dispatch(getPaymentsData(Number(payments)))







    }



    const getCharges = async () => {






        let totalCharges = 0;





        for (const data of reduxData) {


            console.log("Deffo here...")



            const charges: number = await fetch(`https://xrchz.net/stakevrun/fee/${currentChain}/${address}/${data.pubkey}/charges`, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(async response => {

                    var jsonObject = await response.json()


                    console.log("An Object of Power:" + Object.entries(jsonObject))
                    let numDays = 0;



                    for (const object of jsonObject) {

                        console.log("Charges object:" + Object.entries(object));

                        numDays += object.numDays


                    }



                    return numDays;

                })
                .catch(error => {

                    console.log("Charges" + error);
                    return 0;
                });






            totalCharges += charges

        }




        let totalETH = totalCharges * 0.0001





        dispatch(getChargesData(totalETH))



    }

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


    const [registrationResult, setRegistrationResult] = useState({ result: "" });


    const handleRegistrationResult = (result: any) => {
        setRegistrationResult(result);
        // Do whatever you need with the result here
    };





    const triggerConfetti = () => {
        confetti();
    };









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

                        <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">



                            <div className='mb-2 flex flex-col justify-start items-start'>
                                <span className="block text-lg font-bold">

                                    <span style={reduxPayments - reduxCharges > 0 ? { color: "#222" } : { color: "red" }}>
                                        {reduxPayments - reduxCharges}
                                    </span> ETH


                                </span>
                                {reduxPayments - reduxCharges > 0 ? (
                                    <span className="block text-gray-500 ">Vrün Balance</span>
                                ) : (
                                    <span className="block text-gray-500 ">in Arrears</span>

                                )

                                }
                            </div>

                            <div className="flex relative w-full h-full flex-col shadow-xl border rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">

                                <h2 className="text-[20px] font-bold mb-2">Add ETH Credit</h2>

                                <input

                                    className="w-[60%] self-center border border-black-200 text-black-500"
                                    type="text"

                                    value={feeETHInput}
                                    onChange={handleETHInput}
                                />



                                <div >
                                    <button className="bg-green-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={makePayment}>Pay ETH</button>

                                </div>

                                {paymentErrorMessage !== "" &&
                                    <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">{paymentErrorMessage}</p>
                                }
                            </div>





                        </div>) : (<


                            NoRegistration onRegistrationResult={handleRegistrationResult} />


                    )
                    }
                </>
            ) : (<NoConnection />)}


            <Footer />

        </div>
    )
}

export default Payments