import React, { useState, useEffect } from 'react'
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
import { FaCoins } from "react-icons/fa";
import BounceLoader from "react-spinners/BounceLoader";
import Modal from 'react-modal';
import { FaEthereum } from "react-icons/fa";
import styles from '../styles/Home.module.css';
import { TiTick } from "react-icons/ti";
import { BiSolidErrorAlt } from "react-icons/bi";
import { AiOutlineClose } from 'react-icons/ai'


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


    const [isInitialRender, setIsInitialRender] = useState(true);





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




        setIncrementer(0)
        setShowFormMakePayment(true)
        



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

                setIncrementer(1)

               
                getPayments();

             
              setIncrementerWithDelay(4, 700)

              setFeeETHInput("")
              

                console.log("Transaction successful:", receipt);
            } else {
                console.error("Transaction failed:", result);
                // Handle the failure if needed



                setPaymentErrorMessage(result)
                setIncrementer(5)


            }



        } catch (e: any) {

            if (e.reason) {
                setPaymentErrorMessage(e.reason.toString())

            }
            else if (e.error) {
                setPaymentErrorMessage(e.error["message"].toString())
            } else {

                setPaymentErrorMessage("Error: check you have input a valid ETH value.")

            }

            setIncrementer(5)



        }





    }



    const getPayments = async () => {



        type RowType = {
            payments: number; // Assuming payments are numbers for calculation
        }


        let paymentData: Array<RowType> = [];


        const payments: string = await fetch(`https://fee.vrün.com/${currentChain}/${address}/payments`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(async response => {

                var jsonObject = await response.json()

                console.log("Running Payments")




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



            const charges: number = await fetch(`https://fee.vrün.com/${currentChain}/${address}/${data.pubkey}/charges`, {
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




    useEffect(() => {


        if (paymentErrorMessage !== "") {


            const handleText = () => {
                setPaymentErrorMessage("")

            }


            const timeoutId = setTimeout(handleText, 6000);

            return () => clearTimeout(timeoutId);




        }

    }, [paymentErrorMessage])


    const setIncrementerWithDelay = (value: number, delay: number) => {
        setTimeout(() => {
          setIncrementer(value);
        }, delay);
      };




    const triggerConfetti = () => {
        confetti();
    };


    useEffect(() => {
        if (!isInitialRender && address !== undefined) {
            // This block will run after the initial render
            getPayments();
            getCharges();
        } else {
            // This block will run only on the initial render

            setIsInitialRender(false);
        }
    }, [currentChain, address]);



    const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)
    const [makePaymentErrorBoxText, setMakePaymentErrorBoxText] = useState("")





    



      const [showFormMakePayment, setShowFormMakePayment] = useState(false)
      const [showFormMakePaymentEffect, setShowFormMakePaymentEffect] = useState(false)
    
    
      useEffect(() => {
    
    
        setShowFormMakePaymentEffect(showFormMakePayment);
        if(showFormMakePayment === false) {
            setIncrementer(0)
        }
    
    
      }, [showFormMakePayment]);
    
    
      
      const [currentMakePaymentStatus1, setCurrentMakePaymentStatus1] = useState(0)
    
      const [currentMakePaymentStatus3, setCurrentMakePaymentStatus3] = useState(0)
      const [incrementer, setIncrementer] = useState(0)
    
    
      useEffect(() => {
    
        if (currentMakePaymentStatus3 === 3) {
    
          triggerConfetti();
        }
    
      }, [currentMakePaymentStatus3])
    
    
    
    
      useEffect(() => {
    
    
        if (incrementer === 1) {
    
          setCurrentMakePaymentStatus1(1)
    
    
        }  else if (incrementer === 4) {
          setCurrentMakePaymentStatus3(3)
        } else if (incrementer === 5) {
          setCurrentMakePaymentStatus3(4)
        }
    
    
    
        else {
    
          setCurrentMakePaymentStatus1(0)
        
          setCurrentMakePaymentStatus3(0)
    
    
    
        }
    
      }, [incrementer])
    








    return (
        <div style={{ backgroundColor: reduxDarkMode ? "#222" : "white", color: reduxDarkMode ? "white" : "#222" }} className="flex w-full h-auto flex-col">

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

                            <div className="w-full min-h-[92vh] h-auto flex flex-col items-center justify-center gap-[8vh] ">


                                <div className="w-full flex flex-col justify-center items-center gap-4 ">
                                    <h2 className="text-2xl lg:text-4xl font-bold ">Payments & Charges</h2>

                                </div>



                                <div className=' w-auto p-5 border  rounded-lg flex justify-start items-center shadow-xl'>
                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                                        <FaCoins className="text-yellow-500 text-xl" />

                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="block text-lg font-bold">

                                            <span className='text-2xl' style={reduxPayments - reduxCharges > 0 ? { color: reduxDarkMode ? "#fff" : "#222" } : { color: "red" }}>
                                                {reduxPayments - reduxCharges}
                                            </span> ETH


                                        </span>
                                        {reduxPayments - reduxCharges > 0 ? (
                                            <span className="block text-md lg:text-lg text-gray-500 ">Vrün Balance</span>
                                        ) : (
                                            <span className="block text-md lg:text-lg text-gray-500 ">in Arrears</span>

                                        )

                                        }

                                    </div>
                                </div>

                                <div className="flex items-center justiify-center w-auto h-full flex-col shadow-xl border rounded-lg gap-2  px-6 py-6 pt-[45px] text-center">


                                    <div className=" w-[85%] flex items-center flex-col justify-center gap-2">
                                        <h2 className=" text-xl lg:text-2xl  self-start font-bold mb-2">Add ETH Credit:</h2>

                                        <input

                                            className="w-full self-center bg-gray-100 text-xl py-7 px-3 rounded-xl shadow-lg border border-black-200 text-gray-500"
                                            type="text"
                                            placeholder='Enter ETH amount...'

                                            value={feeETHInput}
                                            onChange={handleETHInput}
                                        />

                                    </div>



                                    <div >
                                        <button className="bg-green-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={makePayment}>Pay ETH</button>

                                    </div>

                                </div>





                            </div>


                            <div className="w-full min-h-[92vh] h-auto flex flex-col items-center justify-center gap-8 ">
                                <div className="w-auto overflow-hidden shadow-xl border rounded-lg mb-10 ">


                                    <table className="w-full bg-white">
                                        <tbody>

                                            {reduxData.map((data, index) => (
                                                <tr key={index} style={data.statusResult === "Empty" ? { display: "none" } : { display: "block" }}>



                                                    <td className=" px-4 pl-10 w-[200px] ">

                                                    </td>

                                                    <td className="px-4 py-3 w-[200px]">

                                                    </td>

                                                    <td className="px-4 py-3 w-[180px]">

                                                    </td>

                                                    <td className="px-4 py-3 text-xs w-[180px]">



                                                    </td>

                                                    <td className="px-4 pr-10 py-3 w-[auto]">

                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>


                            </div>


                       


                            <Modal
                                isOpen={showFormMakePayment}
                                onRequestClose={() => setShowFormMakePayment(false)}
                                contentLabel="Unstake RPL Transaction Modal"
                                className={`${styles.modal} ${showFormMakePaymentEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
                                ariaHideApp={false}
                                style={{
                                    overlay: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: "999999999999999999999999999999999999",
                                        transition: "0.2s transform ease-in-out",
                                    },
                                    content: {
                                        width: 'auto',
                                        height: 'auto',
                                        minWidth: "280px",
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',

                                        color: 'black',
                                        backgroundColor: "#fff",
                                        border: "0",
                                        borderRadius: "20px",
                                        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)",
                                        overflow: "auto",
                                        WebkitOverflowScrolling: "touch", // For iOS Safari
                                        scrollbarWidth: "thin", // For modern browsers that support scrollbar customization
                                        scrollbarColor: "rgba(255, 255, 255, 0.5) #2d2c2c", // For modern browsers that support scrollbar customization
                                    },
                                }}
                            >
                                <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">

                                    <div className="flex items-start justify-center gap-3 w-full">

                                        <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">

                                            <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                                setShowFormMakePayment(false)
                                            }} />

                                        </div>
                                    </div>
                                    {currentMakePaymentStatus3 === 3 ? (


                                        <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Top-up Complete!</h3>

                                            <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                            <button onClick={() => { setShowFormMakePayment(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                        </div>




                                    ) : currentMakePaymentStatus3 === 4 ? (

                                        <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Top-up Failed!</h3>

                                            <p className='my-3 text-lg text-red-400 '>{paymentErrorMessage}</p>

                                            <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                            <button onClick={() => { setShowFormMakePayment(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                        </div>





                                    ) : (


                                        <>




                                            <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                                <h3 className="font-bold text-[30px]">Top-up Vrun Account</h3>
                                                <p className="text-[25px]">{feeETHInput} ETH</p>
                                            </div>

                                            <hr className="w-full my-3" />

                                            <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                                <div className='flex items-start justify-between gap-6 w-full'>
                                                    <div className="flex items-center justify-start gap-4">
                                                        <p> <FaCoins/></p>

                                                        <p className="text-left">Confirm Deposit </p>
                                                    </div>
                                                    <p className='self-end'>

                                                        {

                                                            currentMakePaymentStatus1 === 0 ? (
                                                                <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                            ) : (

                                                                <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                            )




                                                        }


                                                    </p>
                                                </div>










                                            </div>







                                        </>






                                    )}


                                </div>


                            </Modal>
                        
                        </>


                    ) : (<


                        NoRegistration onRegistrationResult={handleRegistrationResult} />


                    )
                    }
                </>
            ) : (<NoConnection />)
            }


            <Footer />

        </div >
    )
}

export default Payments