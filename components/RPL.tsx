import React, { useState, useEffect } from 'react'
import { NextPage } from 'next';
import RollingNumber from './rollingNumber';
import { ethers } from 'ethers';
import storageABI from "../json/storageABI.json"
import managerABI from "../json/managerABI.json"
import tokenABI from "../json/tokenABI.json"
import stakingABI from "../json/stakingABI.json"
import networkABI from "../json/networkABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import { useAccount, useChainId } from 'wagmi';
import BounceLoader from "react-spinners/BounceLoader";
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { FaSignature } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import styles from '../styles/Home.module.css';
import { TiTick } from "react-icons/ti";
import { BiSolidErrorAlt } from "react-icons/bi";
import confetti from 'canvas-confetti';
import { getData } from "../globalredux/Features/validator/valDataSlice"
import { useSelector, useDispatch } from 'react-redux';



const RPLBlock: NextPage = () => {


  const currentChain = useChainId();

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"
  const currentRPC = currentChain === 17000 ? 'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/' : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"


  const [stakeButtonBool, setStakeButtonBool] = useState(true)
  const [isRegistered, setIsRegistered] = useState(true)
  const [RPL, setRPL] = useState(BigInt(0));
  const [stakeRPL, setStakeRPL] = useState(BigInt(0));
  const [newMinipools, setNewMinipools] = useState(BigInt(0))
  const [RPLinput, setRPLinput] = useState("")
  const [displayActiveMinipools, setDisplayActiveMinipools] = useState(0)
  const [registrationResult, setRegistrationResult] = useState({ result: "" });
  const [errorBoxText, setErrorBoxTest] = useState("");

  const { address } = useAccount({


    onConnect: async ({ address }) => {


      if (address !== undefined) {
        try {


          await handleCheckRPL(address);
          await handleCheckStakeRPL(address)




        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during registration check:", error);
        }
      }
    }
  })




  const handleRegistrationResult = (result: any) => {
    setRegistrationResult(result);
    // Do whatever you need with the result here
  };






  const fetchData = async () => {

    console.log("triggered")
    // Your async code here
    try {



      if (address !== undefined) {
        const result = await registrationCheck(address);

        setIsRegistered(result)


      }
      // Example async function call
      // Do something with the result
    } catch (error) {
      // Handle errors
    }
  };


  useEffect(() => {





    console.log("Receiving result")

    console.log(registrationResult);


    fetchData(); // Call the async function


  }, [registrationResult]);



  const registrationCheck = async (add: string) => {

    if (typeof (window as any).ethereum !== "undefined") {

      console.log("Reg Spot 1")

      try {



        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        const provider = new ethers.JsonRpcProvider(currentRPC);
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







  useEffect(() => {

    if (address !== undefined) {
      handleCheckRPL(address);
      handleCheckStakeRPL(address)


    }


  }, [])









  useEffect(() => {

    console.log("RPL changed")


  }, [RPL])



  const [RPLCheckRun, setRPLCheckRun] = useState(false)
  const [stakeRPLCheckRun, setStakeRPLCheckRun] = useState(false)

  const [isInitialRender, setIsInitialRender] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {

    console.log(currentChain)

    if (!isInitialRender) {
     
   

      dispatch(getData([{address: "NO VALIDATORS"}]))

      if (isRegistered && address !== undefined) {
        handleCheckRPL(address);
        handleCheckStakeRPL(address)


      }

      fetchData();

    } else {

      setIsInitialRender(false)

    }



  }, [currentChain, address])





  const handleCheckRPL = async (add: string) => {


    if (typeof (window as any).ethereum !== "undefined") {



      try {






        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()



        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);




        const tokenAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketTokenRPL"));


        console.log("THIS IS THE STORAGE ADDRESS:" + storageAddress)
        console.log("THIS IS THE TOKEN ADDRESS:" + tokenAddress)


        const rplTOKEN = new ethers.Contract(tokenAddress, tokenABI, signer)

        const amount = await rplTOKEN.balanceOf(add)


        console.log(ethers.formatEther(amount))


        setRPL(amount);


        setRPLCheckRun(true)


        console.log("Unstaked RPL amount:" + amount);


        return amount;

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


  const handleCheckStakeRPL = async (add: string) => {

    if (typeof (window as any).ethereum !== "undefined") {



      try {






        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()



        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);






        const NodeStakingAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeStaking"))

        const rocketNodeStaking = new ethers.Contract(
          NodeStakingAddress, // Replace with your staking contract address
          stakingABI, // Replace with your staking contract ABI
          signer
        );






        const amount = await rocketNodeStaking.getNodeRPLStake(add)


        console.log(typeof amount)


        setStakeRPL(amount);




        console.log("Stake RPL amount:" + amount);

        const rocketNetworkPrices = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNetworkPrices"));
        const rocketNetworkContract = new ethers.Contract(rocketNetworkPrices, networkABI, signer)

        const rplPrice = await rocketNetworkContract.getRPLPrice()
        const rplRequiredPerLEB8 = ethers.parseEther('2.4') / rplPrice


        console.log("rplRequiredPerLEB8: " + rplRequiredPerLEB8)



        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer);



        const activeMinipools = await MinipoolManager.getNodeStakingMinipoolCount(address);


        setDisplayActiveMinipools(activeMinipools);


        console.log(Number(ethers.formatEther(amount)))





        if (Number(ethers.formatEther(amount)) < Number(rplRequiredPerLEB8)) {

          setNewMinipools(BigInt(0))
          setStakeRPLCheckRun(true)


        } else {

          let LEB8sPossible = amount / rplRequiredPerLEB8
          let possibleNewMinpools = LEB8sPossible;



          console.log("LEB8sPossible:" + LEB8sPossible);


          console.log(" Possible New: " + possibleNewMinpools);








          setNewMinipools(possibleNewMinpools)

          setStakeRPLCheckRun(true)


        }


        return amount;

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



  function isValidPositiveNumber(str: string) {
    // Convert the string to a number
    const num = Number(str);

    // Check if the conversion results in a valid number and if the number is greater than zero
    if (!isNaN(num) && num > 0) {
      return true;
    } else {
      return false;
    }
  }









  const handleApproveRPL = async () => {


    const run = isValidPositiveNumber(RPLinput)

    if (run === true) {
      if (typeof (window as any).ethereum !== "undefined") {
        try {
          let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
          let signer = await browserProvider.getSigner();

          const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
          const NodeStakingAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeStaking"))
          console.log("Node Staking Address:" + NodeStakingAddress);

          const tokenAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketTokenRPL"));
          const address = await signer.getAddress();
          const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

          const val = ethers.parseEther(RPLinput);

          const approvalTx = await tokenContract.approve(NodeStakingAddress, val);
          console.log("Approval transaction:", approvalTx.hash);
          setStakingMessage("Approval confirmed! Processing... ")
          setIncrementer(1)

          await approvalTx.wait();
          return NodeStakingAddress;
        } catch (e: any) {


          if (e.reason !== undefined) {
            setErrorBoxTest(e.reason.toString());


          } else if (e.error) {
            setErrorBoxTest(e.error["message"].toString())
          } else {
            setErrorBoxTest("An Unknown error occured.")

          }
          setIncrementer(5)
          setStakeButtonBool(true)
        }
      } else {
        console.log("Metamask not available");

      }
    } else {
      setIncrementer(5)
      setStakeButtonBool(true)
      setErrorBoxTest("You must enter a valid number.")
    }
  };


  const [preloader, setPreloader] = useState(true)

  const handleStakeRPL = async (NodeStakingAddress: any) => {

    try {
      if (!NodeStakingAddress) return; // Ensure NodeStakingAddress is provided



      let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
      let signer = await browserProvider.getSigner();

      const rocketNodeStaking = new ethers.Contract(NodeStakingAddress, stakingABI, signer);
      const val = ethers.parseEther(RPLinput);

      const tx = await rocketNodeStaking.stakeRPL(val);
      console.log("Stake transaction:", tx.hash);

      setStakingMessage("Stake confirmed via wallet! Processing... ")

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);


      if (receipt.status === 1) {

        setIncrementer(2)

        setRPLinput("");

        setStakeButtonBool(true)
        setIncrementerWithDelay(4, 700)


      } else {
        setIncrementer(5)
        setStakeButtonBool(true)
        // Handle failed transaction
      }
    } catch (e: any) {


      if (e.reason !== undefined) {
        setErrorBoxTest(e.reason.toString());


      } else if (e.error) {
        setErrorBoxTest(e.error["message"].toString())
      } else {
        setErrorBoxTest("An Unknown error occured.")

      }
      setIncrementer(5)
      setStakeButtonBool(true)

    }
  };





  const [stakingMessage, setStakingMessage] = useState("")


  const handleStakeButtonClick = async () => {

    try {

      setIncrementer(0)
      setShowFormStakeRPL(true);
      setStakeButtonBool(false)
      setStakingMessage("Processing approval to spend RPL...")


      const nodeAddress = await handleApproveRPL();
      if (nodeAddress) {
        setIncrementer(1)


        setStakingMessage("Approval sucessful, now initiating Stake transaction...")

        const newStake = await handleStakeRPL(nodeAddress);


        if (address !== undefined) {
          handleCheckRPL(address);
          handleCheckStakeRPL(address);
        }




      } else {
        setIncrementer(5)

        setRPLinput("");
        setStakeButtonBool(true)


      }
    }
    catch (e: any) {
      if (e.reason !== undefined) {
        setErrorBoxTest(e.reason.toString());


      } else if (e.error["message"]) {
        setErrorBoxTest(e.error["message"].toString())
      } else {
        setErrorBoxTest("An Unknown error occured.")

      }
      setIncrementer(5)
      setStakeButtonBool(true)
    }
  };



  const handleUnstakeButtonClick = async () => {


    try {

      setIncrementer(0)
      setShowFormStakeRPL(true);
      setStakeButtonBool(false)



      const newStake = await handleUnstakeRPL();



      console.log(newStake);

    } catch (e: any) {

      if (e.reason !== undefined) {
        setErrorBoxTest(e.reason.toString());


      } else if (e.error["message"]) {
        setErrorBoxTest(e.error["message"].toString())
      } else {
        setErrorBoxTest("An Unknown error occured.")

      }
      setIncrementer(5)
      setStakeButtonBool(true)

    }



  }






  const handleUnstakeRPL = async () => {



    const run = isValidPositiveNumber(RPLinput)

    if (run === true) {

      try {


        let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        let signer = await browserProvider.getSigner();

        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const NodeStakingAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeStaking"))
        console.log("Node Staking Address:" + NodeStakingAddress);

        const rocketNodeStaking = new ethers.Contract(NodeStakingAddress, stakingABI, signer);
        const val = ethers.parseEther(RPLinput);

        console.log("Here is ok")
        const tx = await rocketNodeStaking.withdrawRPL(val);
        console.log("Withdrawal transaction:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        if (receipt.status === 1) {
          if (address !== undefined) {
            handleCheckRPL(address);
            handleCheckStakeRPL(address);
            setIncrementer(1)
            setIncrementerWithDelay(4, 700)
            setRPLinput("");
            setStakeButtonBool(true)


          }
        } else {
          // Handle failed transaction

          setIncrementer(5)
          setStakeButtonBool(true)
        }
      } catch (e: any) {




        if (e.reason !== undefined) {
          setErrorBoxTest(e.reason.toString());


        } else if (e.error["message"]) {
          setErrorBoxTest(e.error["message"].toString())
        } else {
          setErrorBoxTest("An Unknown error occured.")

        }
        setIncrementer(5)
        setStakeButtonBool(true)

      }
    } else {
      setIncrementer(5)
      setStakeButtonBool(true)


      setErrorBoxTest("You must enter a valid number");



    }




  };







  useEffect(() => {


    if (errorBoxText !== "") {


      const handleText = () => {
        setErrorBoxTest("")

      }


      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);




    }

  }, [errorBoxText])









  const handleRPLInputChange = (e: any) => {

    setRPLinput(e.target.value)

  }


  const [currentStakeStatus1, setCurrentStakeStatus1] = useState(0)
  const [currentStakeStatus2, setCurrentStakeStatus2] = useState(0)
  const [currentStakeStatus3, setCurrentStakeStatus3] = useState(0)
  const [incrementer, setIncrementer] = useState(0);



  const setIncrementerWithDelay = (value: number, delay: number) => {
    setTimeout(() => {
      setIncrementer(value);
    }, delay);
  };


  useEffect(() => {


    if (incrementer === 1) {

      setCurrentStakeStatus1(1)
      setCurrentStakeStatus2(1)

    } else if (incrementer === 2) {
      setCurrentStakeStatus2(2)



    } else if (incrementer === 4) {
      setCurrentStakeStatus3(3)
    } else if (incrementer === 5) {
      setCurrentStakeStatus3(4)
    }



    else {

      setCurrentStakeStatus1(0)
      setCurrentStakeStatus2(0)
      setCurrentStakeStatus3(0)



    }

  }, [incrementer])






  const [showFormStakeRPL, setShowFormStakeRPL] = useState(false)
  const [showFormEffectStakeRPL, setShowFormEffectStakeRPL] = useState(false)


  useEffect(() => {


    setShowFormEffectStakeRPL(showFormStakeRPL);


  }, [showFormStakeRPL]);



  const triggerConfetti = () => {
    confetti();
  };



  useEffect(() => {

    if (currentStakeStatus3 === 3) {

      triggerConfetti();
    }

  }, [currentStakeStatus3])


  const [stakeTruth, setStakeTruth] = useState(true)



  useEffect(() => {

    setRPLinput("")

  }, [stakeTruth])



  const setMaxUnstakedRPL = async () => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()



    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);


    const NodeStakingAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeStaking"))

    const rocketNodeStaking = new ethers.Contract(
      NodeStakingAddress, // Replace with your staking contract address
      stakingABI, // Replace with your staking contract ABI
      signer
    );

    const tokenAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketTokenRPL"));




    const rplTOKEN = new ethers.Contract(tokenAddress, tokenABI, signer)


    let amount;


    if(stakeTruth) {
      amount = await rplTOKEN.balanceOf(address)
    } else {

      amount = await rocketNodeStaking.getNodeRPLStake(address)

    }

   



    console.log(amount)

    setRPLinput(ethers.formatEther(amount))


  }









  const [showFormUnstakeRPL, setShowFormUnstakeRPL] = useState(false)
  const [showFormEffectUnstakeRPL, setShowFormEffectUnstakeRPL] = useState(false)


  useEffect(() => {


    setShowFormEffectUnstakeRPL(showFormUnstakeRPL);


  }, [showFormUnstakeRPL]);



  const [currentUnstakeStatus1, setCurrentUnstakeStatus1] = useState(0)
  const [currentUnstakeStatus2, setCurrentUnstakeStatus2] = useState(0)
  const [currentUnstakeStatus3, setCurrentUnstakeStatus3] = useState(0)


  useEffect(() => {

    if (currentUnstakeStatus3 === 3) {

      triggerConfetti();
    }

  }, [currentUnstakeStatus3])




  useEffect(() => {


    if (incrementer === 1) {

      setCurrentUnstakeStatus1(1)


    } else if (incrementer === 4) {
      setCurrentUnstakeStatus3(3)
    } else if (incrementer === 5) {
      setCurrentUnstakeStatus3(4)
    }



    else {

      setCurrentUnstakeStatus1(0)
      setCurrentUnstakeStatus2(0)
      setCurrentUnstakeStatus3(0)



    }

  }, [incrementer])









  return (
    <div className="flex flex-col w-auto  h-auto gap-4 px-8 text-center items-center justify-center rounded-xl  border shadow-xl  border-black-100  py-4 ">
      <h2 className="text-2xl w-[90%] font-bold  sm:text-2xl"> RPL Interface</h2>

      {RPLCheckRun && stakeRPLCheckRun ?

        (<div className="flex flex-col w-auto px-3  items-center justify-center gap-1 shadow-lg text-md my-3 py-3 px-3 rounded-lg border">
          <label className="flex flex-col font-bold items-center justify-center gap-1">Unstaked RPL:
            <span className='text-yellow-500 font-bold'> {ethers.formatEther(RPL)} </span>

          </label>

          <label className="flex flex-col items-center font-bold justify-center gap-1">
            Staked RPL:
            <span style={Number(ethers.formatEther(stakeRPL)) >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }} className='font-bold'> {ethers.formatEther(stakeRPL)} </span>
          </label>
          <label className="flex flex-col font-bold items-center justify-center gap-1">
            Active Minipools:
            <span className='text-green-500 font-bold' style={displayActiveMinipools >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> {Number(displayActiveMinipools)} </span>

          </label>

          <label className="flex flex-col font-bold items-center justify-center gap-1">
            Total Possible Minipools:


            <span className={`text-green-500 font-bold`} style={Math.floor(Number(ethers.formatEther(newMinipools))) < 1 ? { color: "red" } : { color: "rgb(34 197 94)" }}> {Math.floor(Number(ethers.formatEther(newMinipools)))} </span>
          </label>
        </div>) : (

          <div className="w-auto h-[auto] gap-2  flex flex-col items-center justify-center p-8 px-[6vh]">


            <h3>Please wait while we retrieve your RPL balances...</h3>

            <BounceLoader />

          </div>

        )}

      <div className="flex flex-col gap-2 items-center justify-center">
        <input value={RPLinput} placeholder='RPL Value' className="self-center  w-[80%] bg-gray-100 text-lg py-4 px-3 rounded-xl shadow-lg border border-black-200 text-gray-500" style={stakeButtonBool ? { display: "block" } : { display: "none" }} type="text" onChange={handleRPLInputChange} />
        <button onClick={() => { setMaxUnstakedRPL() }} className="bg-black mt-2 text-sm hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md" >MAX</button>

      </div>


      <div className="flex items-center justify-center w-full gap-4 mt-1">
        
          <label className="flex items-center justify-center gap-1">
            <input
              type="radio"
              name="optIn"
              checked={stakeTruth === true}
              onChange={() => setStakeTruth(true)}
            />
            Stake
          </label>
          <label className="flex items-center justify-center gap-1">
            <input
              type="radio"
              name="optIn"
              checked={stakeTruth === false}
              onChange={() => setStakeTruth(false)}
            />
            Unstake
          </label>
        </div>

      <div className='w-3/5 flex gap-2 items-center my-1 justify-center'>


      


       {stakeTruth? (<button onClick={handleStakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake RPL</button>) :
        (<button onClick={handleUnstakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Unstake RPL</button>)

      }





      </div>






      <Modal
        isOpen={showFormStakeRPL}
        onRequestClose={() => setShowFormStakeRPL(false)}
        contentLabel="Create Validator Modal"
        shouldCloseOnOverlayClick={false}
        className={`${styles.modal} ${showFormEffectStakeRPL ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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


          {currentStakeStatus3 === 3 ? (


            <div className='w-full flex items-center flex-col gap-2 justify-center'>
              <h3 className="font-bold text-[30px]">RPL Staked</h3>

              <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
              <button onClick={() => { setShowFormStakeRPL(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
            </div>




          ) : currentStakeStatus3 === 4 ? (

            <div className='w-full flex items-center flex-col gap-2 justify-center'>
              <h3 className="font-bold text-[30px]">RPL Stake Failed!</h3>

              <p className='my-3 text-lg text-red-400 '>{errorBoxText}</p>

              <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
              <button onClick={() => { setShowFormStakeRPL(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
            </div>





          ) : (


            <>




              <div className='w-full flex items-start flex-col gap-2 justify-center'>
                <h3 className="font-bold text-[30px]">Stake RPL</h3>
                <p className="text-[25px]">{RPLinput} RPL</p>
              </div>

              <hr className="w-full my-3" />

              <div className='flex flex-col gap-3 items-center justify-center w-full'>


                <div className='flex items-start justify-between gap-6 w-full'>
                  <div className="flex items-center justify-start gap-4">
                    <p> <FaEthereum /></p>

                    <p className="text-left">Approve spending of RPL </p>
                  </div>
                  <p className='self-end'>

                    {

                      currentStakeStatus1 === 0 ? (
                        <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                      ) : (

                        <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                      )




                    }


                  </p>
                </div>



                <div className='flex items-start justify-between gap-6 w-full'>
                  <div className="flex items-center justify-start gap-4">
                    <p><HiOutlinePaperAirplane /></p>

                    <p className="text-left" >Stake RPL</p>
                  </div>
                  <p className='self-end'>

                    {

                      currentStakeStatus2 === 0 ? (
                        <p></p>

                      ) : currentStakeStatus2 === 1 ? (

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




      <Modal
        isOpen={showFormUnstakeRPL}
        onRequestClose={() => setShowFormUnstakeRPL(false)}
        contentLabel="Unstake RPL Transaction Modal"
        shouldCloseOnOverlayClick={false}
        className={`${styles.modal} ${showFormEffectStakeRPL ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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


          {currentUnstakeStatus3 === 3 ? (


            <div className='w-full flex items-center flex-col gap-2 justify-center'>
              <h3 className="font-bold text-[30px]">RPL Staked</h3>

              <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
              <button onClick={() => { setShowFormUnstakeRPL(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
            </div>




          ) : currentUnstakeStatus3 === 4 ? (

            <div className='w-full flex items-center flex-col gap-2 justify-center'>
              <h3 className="font-bold text-[30px]">RPL Unstake Failed!</h3>

              <p className='my-3 text-lg text-red-400 '>{errorBoxText}</p>

              <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
              <button onClick={() => { setShowFormUnstakeRPL(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
            </div>





          ) : (


            <>




              <div className='w-full flex items-start flex-col gap-2 justify-center'>
                <h3 className="font-bold text-[30px]">Unstake RPL</h3>
                <p className="text-[25px]">{RPLinput} RPL</p>
              </div>

              <hr className="w-full my-3" />

              <div className='flex flex-col gap-3 items-center justify-center w-full'>


                <div className='flex items-start justify-between gap-6 w-full'>
                  <div className="flex items-center justify-start gap-4">
                    <p> <FaEthereum /></p>

                    <p className="text-left">Unstake RPL </p>
                  </div>
                  <p className='self-end'>

                    {

                      currentUnstakeStatus1 === 0 ? (
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
    </div>

  )
}

export default RPLBlock