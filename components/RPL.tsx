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

const RPLBlock: NextPage = () => {


  const currentChain = useChainId();

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"
  const currentRPC = currentChain === 17000 ? 'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/' : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"


  const [stakeButtonBool, setStakeButtonBool] = useState(true)
  const [isRegistered, setIsRegistered] = useState(true)
  const [RPL, setRPL] = useState(BigInt(0));
  const [stakeRPL, setStakeRPL] = useState(BigInt(0));
  const [newMinipools, setNewMinipools] = useState(0)
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

    console.log(currentChain)

    if (address !== undefined) {
      handleCheckRPL(address);
      handleCheckStakeRPL(address)


    }

    fetchData();


  }, [currentChain, address])



  useEffect(() => {

    if (address !== undefined) {
      handleCheckRPL(address);
      handleCheckStakeRPL(address)


    }


  }, [])









  useEffect(() => {

    console.log("RPL changed")


  }, [RPL])






  const handleCheckRPL = async (add: string) => {


    if (typeof (window as any).ethereum !== "undefined") {



      try {






        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()

        const provider = new ethers.JsonRpcProvider(currentChain === 17000 ? 'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/' : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/");


        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);




        const tokenAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketTokenRPL"));


        console.log("THIS IS THE STORAGE ADDRESS:" + storageAddress)
        console.log("THIS IS THE TOKEN ADDRESS:" + tokenAddress)


        const rplTOKEN = new ethers.Contract(tokenAddress, tokenABI, signer)

        const amount = await rplTOKEN.balanceOf(add)


        console.log(typeof amount)


        setRPL(amount);





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

        const activeMinipools = await MinipoolManager.getNodeMinipoolCount(address);
        setDisplayActiveMinipools(activeMinipools);


        console.log(Number(ethers.formatEther(amount)))





        if (Number(ethers.formatEther(amount)) <  rplRequiredPerLEB8) {

          setNewMinipools(0)


        } else {

          let LEB8sPossible = amount / rplRequiredPerLEB8
          let possibleNewMinpools = LEB8sPossible - ethers.parseEther(activeMinipools.toString());



          console.log("LEB8sPossible:" + LEB8sPossible);


          console.log(" Possible New: " + possibleNewMinpools);
          // getNodeActiveMinipoolCount







          ///setNewMinipools(possibleNewMinpools)


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









  const handleApproveRPL = async () => {
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

        await approvalTx.wait();
        return NodeStakingAddress;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Metamask not available");
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
        if (address !== undefined) {
          handleCheckRPL(address);
          handleCheckStakeRPL(address);
          
        }
      } else {
        // Handle failed transaction
      }
    } catch (error) {
      console.log(error);
      alert(error)
      setStakeButtonBool(false)
    }
  };



  const [stakingMessage, setStakingMessage] = useState("")


  const handleStakeButtonClick = async () => {
    setStakingMessage("Processing approval to spend RPL...")
    setStakeButtonBool(false)
    
    const nodeAddress = await handleApproveRPL();
    if (nodeAddress) {


      setStakingMessage("Approval sucessful, now initiating Stake transaction...")

      const newStake = await handleStakeRPL(nodeAddress);
      setRPLinput("");

      setStakeButtonBool(true);
    } else {

      setRPLinput("");
      setStakeButtonBool(true);

    }
  };



  const handleUnstakeButtonClick = async () => {

    setStakeButtonBool(false);

    const newStake = await handleUnstakeRPL();
    setRPLinput("");
    setStakeButtonBool(true);

    console.log(newStake);



  }



  const handleUnstakeRPL = async () => {
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

          setStakeButtonBool(true);
        }
      } else {
        // Handle failed transaction

        setStakeButtonBool(true);
      }
    } catch (error: any) {
      console.log(error.message);




      let input: any = error

      setErrorBoxTest(input.reason.toString());

      setStakeButtonBool(true);

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







  return (
    <div className="flex flex-col  h-auto gap-2 text-center items-center justify-center rounded-lg border shadow border-b-4 border-black-100 px-2 py-8 ">
      <h2 className="text-2xl w-[90%] font-bold text-gray-900 sm:text-2xl">Stake RPL for your Minipool Deposits </h2>

      <p className="my-4 w-[80%] text-gray-500 sm:text-l">
        You have
        <span className='text-yellow-500 font-bold'> <RollingNumber n={Number(ethers.formatEther(RPL))} /> </span>
        unstaked RPL in your Wallet and
        <span className='text-green-500 font-bold'> <RollingNumber n={Number(ethers.formatEther(stakeRPL))} /> </span>
        staked RPL.
        You have
        <span className='text-green-500 font-bold' style={displayActiveMinipools >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> <RollingNumber n={Number(displayActiveMinipools)} /> </span>
        one active Minipool and are able to create <span className={`text-green-500 font-bold`} style={Math.floor(Number(ethers.formatEther(newMinipools))) < 1 ? { color: "red" } : { color: "rgb(34 197 94)" }}> <RollingNumber n={ Math.floor(Number(ethers.formatEther(newMinipools))) } /></span> new LEB8s (Minipools)


      </p>
      <input value={RPLinput} placeholder='RPL Value' className="border border-black-500 " style={stakeButtonBool ? { display: "block" } : { display: "none" }} type="text" onChange={handleRPLInputChange} />

      <div className='w-3/5 flex gap-2 items-center my-2 justify-center'>

        {!stakeButtonBool &&

          <div className="flex flex-col items-center justify-center gap-2">
            
            <p className="mb-2 font-bold text-blue-200">{stakingMessage}</p>

            <BounceLoader />
          </div>


        }


        <button onClick={handleStakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake RPL</button>
        <button onClick={handleUnstakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Unstake RPL</button>







      </div>

      {errorBoxText !== "" &&
        <div className='w-3/5 flex gap-2 items-center justify-center'>

          <p className="my-4 w-[80%] font-bold text-red-500 sm:text-l">{errorBoxText}</p>

        </div>


      }
    </div>

  )
}

export default RPLBlock