import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/navbar';
import type { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import NoConnection from '../components/noConnection';
import { ethers } from 'ethers';
import NoRegistration from '../components/noRegistration';
import BounceLoader from "react-spinners/BounceLoader";
import { mainnet } from 'viem/chains';
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther, TransactionReceipt } from 'viem';
import Head from 'next/head';
import miniManagerABI from "../json/miniManagerABI.json"
import storageABI from "../json/storageABI.json"
import managerABI from "../json/managerABI.json"
import Modal from 'react-modal';
import daoABI from "../json/daoABI.json"
import distributorABI from "../json/distributorABI.json"
import feeABI from "../json/feeABI.json"
import tokenABI from "../json/tokenABI.json"
import stakingABI from "../json/stakingABI.json"
import networkABI from "../json/networkABI.json"
import factoryABI from "../json/factoryABI.json"
import depositABI from "../json/depositABI.json"
import { AiOutlineClose } from 'react-icons/ai'
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { FaEthereum } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { FaSignature } from "react-icons/fa";
import { FaGripLinesVertical } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import confetti from 'canvas-confetti';
import { BiSolidErrorAlt } from "react-icons/bi";
import type { RootState } from '../globalredux/store';
import { useSelector, useDispatch } from 'react-redux';
import RollingNumber from '../components/rollingNumber';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Footer from '../components/footer';

import { getData } from "../globalredux/Features/validator/valDataSlice"


//https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4

const CreateValidator: NextPage = () => {


const dispatch = useDispatch()




  const [NodeStakingAddress, setNodeStakingAddress] = useState("")

  const router = useRouter();
  const [minipoolDepositInput, setMinipoolDepositInput] = useState("")

  const [errorBoxText2, setErrorBoxTest2] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0)

  const [stakingMessage, setStakingMessage] = useState("")












  // BEGINNING RPL FUNCTIONS


  const currentChain = useChainId();

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"



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
          getMinipoolTruth();
          checkIndex();

          const reg = await registrationCheck(address);
          setIsRegistered(reg);
          if (reg === true) {

            await handleCheckRPL(address);
            await handleCheckStakeRPL(address)


          }

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

  const [currentValidatorPhase, setCurrentValidatorPhase] = useState(0);
  const [currentValidatorMessage, setCurrentValidatorMessage] = useState("")



  const validatorAnimationPathway = () => {



  }






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

    checkIndex();

    getMinipoolTruth();

    if (isRegistered && address !== undefined) {
      handleCheckRPL(address);
      handleCheckStakeRPL(address)


    }

    fetchData();



  }, [currentChain, address])



  type rowObject2 = {
    address: string,
    statusResult: string,
    statusTimeResult: string,
    timeRemaining: string,
    pubkey: string
    beaconStatus: string

    valBalance: string
    valProposals: string
    valDayVariance: string
    minipoolBalance: string
    activationEpoch: string
    smoothingPoolTruth: boolean
    withdrawalEpoch: string
    withdrawalCountdown: string
    feeRecipient: string

    graffiti: string
    isEnabled: boolean
    valIndex: string
    nodeAddress: string
  };













  const handleCheckRPL = async (add: string) => {


    if (typeof (window as any).ethereum !== "undefined") {

      console.log("Reg Spot 1")

      try {






        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()




        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);




        const tokenAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketTokenRPL"));


        console.log("THIS IS THE STORAGE ADDRESS:" + storageAddress)
        console.log("THIS IS THE TOKEN ADDRESS:" + tokenAddress)


        const rplTOKEN = await new ethers.Contract(tokenAddress, tokenABI, signer)

        const amount = await rplTOKEN.balanceOf(add)


        console.log(typeof amount)


        setRPL(amount);





        console.log("Stake RPL amount:" + amount);


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



  const goToAccount = () => {
    router.push("/account")
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

        console.log("rplRequiredPerLEB8: " + Number(rplRequiredPerLEB8))



        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer);



        const activeMinipools = await MinipoolManager.getNodeStakingMinipoolCount(address);


        setDisplayActiveMinipools(activeMinipools);


        console.log(Number(ethers.formatEther(amount)))

        console.log(Number(ethers.formatEther(amount)) < Number(rplRequiredPerLEB8))





        if (Number(ethers.formatEther(amount)) < Number(rplRequiredPerLEB8)) {

          setNewMinipools(BigInt(0))


        } else {

          let LEB8sPossible = amount / rplRequiredPerLEB8
          let possibleNewMinpools = LEB8sPossible - ethers.parseEther(activeMinipools.toString());



          console.log("LEB8sPossible:" + LEB8sPossible);


          console.log(" Possible New: " + possibleNewMinpools);








          setNewMinipools(possibleNewMinpools)


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
        setIncrementer(1)

        await approvalTx.wait();
        return NodeStakingAddress;
      } catch (error) {
        console.log(error);

      }
    } else {
      console.log("Metamask not available");

    }
  };
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

         
          setIncrementerWithDelay(4, 700)
          setStakeButtonBool(true)

        
      } else {
        setIncrementer(5)
        setStakeButtonBool(true)
        setErrorBoxTest("An unknown error occured.");
        // Handle failed transaction
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
  };

  const handleStakeButtonClick = async () => {

    try {

      setIncrementer(0)
      setShowFormStakeRPL(true);
      setStakingMessage("Processing approval to spend RPL...")
      setStakeButtonBool(false)
  

      const nodeAddress = await handleApproveRPL();
      if (nodeAddress) {
        setIncrementer(1)


        setStakingMessage("Approval sucessful, now initiating Stake transaction...")

       const newStake =  await handleStakeRPL(nodeAddress);


       if (address !== undefined) {
        handleCheckRPL(address);
        handleCheckStakeRPL(address);
       }




      } else {
        setIncrementer(5)
        setStakeButtonBool(true)
        setRPLinput("");
   

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

   

    const newStake = await handleUnstakeRPL();
   
  

    console.log(newStake);

    } catch (e : any) {
   
      if (e.reason !== undefined) {
        setErrorBoxTest(e.reason.toString());


    } else if (e.error["message"]) {
        setErrorBoxTest(e.error["message"].toString())
    } else {
        setErrorBoxTest("An Unknown error occured.")

    }
      setIncrementer(5)

    }



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















  //END RPL FUNCTIONS
  //
  ///
  ///


  useEffect(() => {


    if (errorBoxText2 !== "") {


      const handleText = () => {
        setErrorBoxTest2("")

      }


      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);




    }

  }, [errorBoxText2])




  const nullAddress = "0x0000000000000000000000000000000000000000";



  function findFirstFalseIndex(attachedPubkeyArray: Array<Boolean>) {
    for (let i = 0; i < attachedPubkeyArray.length; i++) {
      if (!attachedPubkeyArray[i]) {
        return i;
      }
    }
    return -1; // Return -1 if no false value found
  }



  const [checked3, setChecked3] = useState(false);



  const getMinipoolTruth2 = async () => {


    let newBool = false



    try {



      let browserProvider = new ethers.BrowserProvider((window as any).ethereum)


      let signer = await browserProvider.getSigner()

      // Only required when `chainId` is not provided in the `Provider` constructor


      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);


      const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))

      const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)

      const bool = await rocketNodeManager.getSmoothingPoolRegistrationState(address)




      console.log("Bool:" + bool)


      if (typeof bool === "boolean") {
       

        newBool = bool


      }

    } catch (error) {

      console.log(error)
    



    }


    return newBool






  }



  const getMinipoolTruth = async () => {






    try {



      let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
      let signer = await browserProvider.getSigner()

      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
      console.log("Storage Contract:" + storageContract)

      const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))

      const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)
      console.log("Rocket Node Manager:" + rocketNodeManager)
      const bool = await rocketNodeManager.getSmoothingPoolRegistrationState(address)




      console.log("Bool:" + bool)


      if (typeof bool === "boolean") {
        setChecked3(bool);


      }

    } catch (error) {

      console.log(error)
      setChecked3(false)



    }

  }


  
  const getGraffiti = async (pubkey: string) => {





    const graffiti = await fetch(`https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetGraffiti&start=-1`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("GET Graffiti" + Object.entries(jsonString))


        const entries = Object.entries(jsonString);

        console.log("grafitti entries:" + entries)
        const entriesOfEntries = Object.entries(entries);

        const newObject = Object(entriesOfEntries[0][1][1]);


        let currentGraffiti = newObject.graffiti

        console.log(currentGraffiti)

        return currentGraffiti;

      })
      .catch(error => {

        console.log(error);
      });



    return graffiti;



  }


  function formatTime(milliseconds: number) {
    // Convert milliseconds to seconds
    var seconds = Math.floor(milliseconds / 1000);

    // Calculate days, hours, minutes, and remaining seconds
    var days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Construct the string
    var timeString = '';
    if (days > 0) {
      timeString += days + ' days ';
    }
    if (hours > 0) {
      timeString += hours + ' hours ';
    }
    if (minutes > 0) {
      timeString += minutes + ' minutes ';
    }
    if (seconds > 0) {
      timeString += seconds + ' seconds ';

    }


    console.log(timeString)

    return timeString.trim();
  }



  const getFeeRecipient = async (pubkey: string, bool: boolean) => {





    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
    const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
    const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);











    let feeRecipient;

    if (bool) {


      feeRecipient = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketSmoothingPool"))







    } else {


      feeRecipient = await distributorContract.getProxyAddress(address);



    }


    return feeRecipient



  }




  const getBeaconchainStatusObject = async (pubkey: string) => {


    let newObject;

    const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`


    await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
      method: "GET",
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data



        newObject = jsonString.data

      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });





    return newObject


  }




  const getEnabled = async (pubkey: string) => {





    const enabled = await fetch(`https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetEnabled&start=-1`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("GET Enabled" + Object.entries(jsonString))


        const entries = Object.entries(jsonString);

        console.log("grafitti entries:" + entries)
        const entriesOfEntries = Object.entries(entries);

        const newObject = Object(entriesOfEntries[0][1][1]);


        let currentEnablement = newObject.enabled

        console.log(currentEnablement)

        return currentEnablement;

      })
      .catch(error => {

        console.log(error);
      });



    return enabled;



  }



  const beaconAPIKey = process.env.BEACON
  const holeskyRPCKey = process.env.HOLESKY_RPC
  const mainnetRPCKey = process.env.MAINNET_RPC



  const getValBeaconStats = async (pubkey: string) => {







    const chainString = currentChain === 17000 ? 'holesky.' : ''


    const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log()



        for (const object of jsonString.data) {
          if (object.publickey === pubkey) {

            return object.validatorindex


          }
        }
        console.log("Result of Logs GET" + Object.entries(jsonString));
        console.log(typeof jsonString);

      })
      .catch(error => {

        console.log(error);
      });




    //  https://holesky.beaconcha.in/api/v1/validator/stats/${valindex}


    const valStats = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/stats/${valIndex}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()



        return jsonString.data


      })
      .catch(error => {

        console.log(error);
      });


    return valStats;



  }








  const getMinipoolData = async () => {

    if(address) {
    

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner();
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));
    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    //Get latest index

    const newNextIndex = await fetch(`https://api.vrün.com/${currentChain}/${address}/nextindex`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of get next index" + jsonString)


        return jsonString;

      })
      .catch(error => {

        console.log(error);
      });

    console.log("Next index:" + newNextIndex)


    let seperateMinipoolObjects: Array<rowObject2> = [];



    



    if (newNextIndex === 0) {






      seperateMinipoolObjects.push({
        address: "NO VALIDATORS checked",
        statusResult: "Empty",
        statusTimeResult: "",
        timeRemaining: "",
        graffiti: "",
        beaconStatus: "",
        activationEpoch: "",
        smoothingPoolTruth: false,
        withdrawalEpoch: "",
        withdrawalCountdown: "",
        feeRecipient: "",
        valBalance: "",
        valProposals: "",
        valDayVariance: "",
        minipoolBalance: "",
        pubkey: "",
        isEnabled: false,
        valIndex: "",
        nodeAddress: ""

      })



      dispatch(getData(seperateMinipoolObjects))








    } else {


      //Get all pubkeys

      let attachedPubkeyArray: Array<Array<string>> = [];


      for (let i = 0; i <= newNextIndex - 1; i++) {



        await fetch(`https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(async response => {

            let pubkey = await response.json()


            let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey)










            if (minipoolAddress === nullAddress) {
              attachedPubkeyArray.push(["Null minipool", pubkey])
            }

            else {
              attachedPubkeyArray.push([minipoolAddress, pubkey]);
            }


            console.log("Get minipool result:" + minipoolAddress);











          })
          .catch(error => {


          });



      }







      let newRunningVals = 0;
      let newTotalVals = 0;


      for (const [minAddress, pubkey] of attachedPubkeyArray) {


       





        if (minAddress === "Null minipool" ) {



          seperateMinipoolObjects.push({
            address:  address !== undefined? address.toString() : "",
            statusResult: "Empty",
            statusTimeResult: "",
            timeRemaining: "",
            graffiti: "",
            beaconStatus: "",
            activationEpoch: "",
            smoothingPoolTruth: false,
            withdrawalEpoch: "",
            withdrawalCountdown: "",
            feeRecipient: "",
            minipoolBalance: "",
            valBalance: "",
            valProposals: "",
            valDayVariance: "",
            pubkey: pubkey,
            isEnabled: false,
            valIndex: "",
            nodeAddress: ""

          })








        } else {


          const minipool = new ethers.Contract(minAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], signer)


          const statusResult = await minipool.getStatus();
          const statusTimeResult = await minipool.getStatusTime();
          const numStatusTime = Number(statusTimeResult) * 1000;

          console.log("Status Result:" + statusResult)

          console.log("Status Time Result:" + statusTimeResult)

          console.log(Date.now());
          console.log(numStatusTime);



          const MinipoolStatus = [
            "Initialised",
            "Prelaunch",
            "Staking",
            "Withdrawable",
            "Dissolved"
          ];



          let currentStatus = "";

       

         



          if (MinipoolStatus[statusResult] === "Staking") {

            newRunningVals += 1;
            newTotalVals += 1;

          } else {

            newTotalVals += 1;

          }



          const DAOAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketDAONodeTrustedSettingsMinipool"))

          const DAOContract = new ethers.Contract(DAOAddress, daoABI, signer);

          const scrubPeriod: any = await DAOContract.getScrubPeriod();

          const numScrub = Number(scrubPeriod) * 1000;
          console.log(numScrub);

          const timeRemaining: number = numScrub - (Date.now() - numStatusTime)


          const string = formatTime(timeRemaining);

          console.log("Time Remaining:" + string);




          const printGraff = await getGraffiti(pubkey);

          type statusType = {

            index: string,
            balance: string,
            status: string,
            validator: {
              pubkey: string,
              withdrawal_credentials: string,
              effective_balance: string,
              slashed: boolean,
              activation_eligibility_epoch: string,
              activation_epoch: string,
              exit_epoch: string,
              withdrawable_epoch: string

            }
          }

          let beaconStatusObject: statusType = {
            index: "",
            balance: "",
            status: "",
            validator: {
              pubkey: "",
              withdrawal_credentials: "",
              effective_balance: "",
              slashed: false,
              activation_eligibility_epoch: "",
              activation_epoch: "",
              exit_epoch: "",
              withdrawable_epoch: ""
            }
          }

          let newBeaconStatusObject = await getBeaconchainStatusObject(pubkey)

          beaconStatusObject = newBeaconStatusObject !== undefined ? newBeaconStatusObject : beaconStatusObject;
          const beaconStatus = typeof beaconStatusObject === "object" ? beaconStatusObject.status : "";
          const activationEpoch = beaconStatusObject !== undefined ? beaconStatusObject.validator.activation_epoch : "";
          const withdrawalEpoch = beaconStatusObject !== undefined ? beaconStatusObject.validator.withdrawable_epoch : "";
          const valIndex = beaconStatusObject !== undefined ? beaconStatusObject.index : "";

          const smoothingBool = await getMinipoolTruth2()

          const theTime = Date.now()

          const genesisTime = 1695902400 * 1000;

          const currentEpoch = Math.ceil((theTime - genesisTime) / 12 / 32 / 1000)

          const withdrawalCountdown = (Number(withdrawalEpoch) - Number(currentEpoch)) * 12 * 32 * 1000;

          const isEnabled = await getEnabled(pubkey)

          const balance =  await browserProvider.getBalance(minAddress)

          console.log("Status:" + beaconStatusObject.status)


          const newFeeRecipient = await getFeeRecipient(pubkey, smoothingBool)



          










          let beaconObject = []

          let newValProposals = 0;
          let newValBalance = 0
          let newValVariance = 0


          if (MinipoolStatus[statusResult] === "Staking" && beaconStatus !== "") {

            beaconObject = await getValBeaconStats(pubkey);


            if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject[0].start_balance !== 0) {
              newValBalance = beaconObject[0].end_balance


          } else {

              newValBalance = 0

          }

            for (const beaconLog  of beaconObject) {

              let blocks = beaconLog.proposed_blocks

              newValProposals += blocks
            }

            if (beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" ||  beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") {

              newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance

            }

          }

          if(Number(ethers.formatEther(balance)) > 0) {


            currentStatus = MinipoolStatus[statusResult];


          } else {
            currentStatus = "Empty"
          }




          seperateMinipoolObjects.push({
            address: minAddress,
            statusResult: currentStatus,
            statusTimeResult: numStatusTime.toString(),
            timeRemaining: timeRemaining.toString(),
            graffiti: typeof printGraff === "string" ? printGraff : "",
            beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",
            activationEpoch: activationEpoch !== undefined ? activationEpoch : "",
            smoothingPoolTruth: smoothingBool,
            withdrawalEpoch: withdrawalEpoch,
            withdrawalCountdown: withdrawalCountdown.toString(),
            feeRecipient: newFeeRecipient,
            minipoolBalance: ethers.formatEther(balance),

            valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
            valProposals: newValProposals.toString(),
            valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),
            isEnabled: isEnabled,
            valIndex: valIndex,
            pubkey: pubkey,
            nodeAddress: address !== undefined ? address.toString() : ""
          })





        }

      }

   
      dispatch(getData(seperateMinipoolObjects))


    }


  } else {
    console.log("Cannot run Minipool function without a connected account")
  }



  }







  const checkIndex = async () => {


    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





    //Get latest index

    const newNextIndex = await fetch(`https://api.vrün.com/${currentChain}/${address}/nextindex`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of get next index" + jsonString)


        return jsonString;

      })
      .catch(error => {

        console.log(error);
      });


    if (newNextIndex <= 0) {
      setShowForm(true)
    }





    //Get all pubkeys

    let pubkeyArray: Array<string> = [];


    for (let i = 0; i < newNextIndex; i++) {



      await fetch(`https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async response => {

          var jsonString = await response.json()


          console.log("Result of pubkey GET" + jsonString)

          pubkeyArray.push(jsonString);





        })
        .catch(error => {


        });



    }



    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    let attachedPubkeyArray: Array<Boolean> = [];


    for (const key of pubkeyArray) {

      console.log("Pubkey:" + key);

      let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(key);

      if (minipoolAddress === nullAddress) {
        attachedPubkeyArray.push(false);
      }

      else {
        attachedPubkeyArray.push(true);
      }


      console.log("Get minipool result:" + minipoolAddress);

    }



      setCurrentIndex(newNextIndex)
    


  }


  const [selectedCont, setSelectedCont] = useState("8 ETH")


  const handleContChange = (event: any) => {
    const { value } = event.target;
    setSelectedCont(value);

  };


  useEffect(() => {
    console.log("Selected Cont:" + selectedCont)

  }, [selectedCont])














  const handleRPLInputChange = (e: any) => {

    setRPLinput(e.target.value)

  }












  const [grafittiInput, setGrafittiInput] = useState("")


  const handleGrafittiInput = (e: any) => {


    setGrafittiInput(e.target.value);

  }

  useEffect(() => {

    console.log(grafittiInput)

  }, [grafittiInput])






  useEffect(() => {

    console.log("Current Validator Index:" + currentIndex)
  }, [currentIndex])


  const [addValidatorError, setAddValidatorError] = useState("")



  const [graffitError, setGraffitiError] = useState("");



  useEffect(() => {


    if (addValidatorError !== "") {


      const handleText = () => {
        setAddValidatorError("")

      }


      const timeoutId = setTimeout(handleText, 5000);

      return () => clearTimeout(timeoutId);




    }

  }, [addValidatorError])





  const handleAddValidator = async () => {








    if (address !== undefined && grafittiInput !== "" ) {


      try {



        setIncrementer(0)
        setShowForm4(true);
    



        const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        console.log("sIGNER ADDRESS:" + signer.address);

        const TermsOfServiceTypes = {

          "AcceptTermsOfService": [
            { name: "declaration", type: "string" }
          ]



        }









        // Get acceptance sheet (currently not working)


        await fetch(`https://api.vrün.com/${currentChain}/${address}/acceptance`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(async response => {

            var jsonString = await response.json()


            console.log("Result of Acceptance GET" + Object.entries(jsonString))


            setIncrementer(1)


          })
          .catch(async error => {



            const requiredDeclaration = 'I accept the terms of service specified at https://vrün.com/terms (with version identifier 20240229).';


            const TermsOfServiceValue = {
              declaration: requiredDeclaration
            }


            let TermsOfServiceSignature = await signer.signTypedData(EIP712Domain, TermsOfServiceTypes, TermsOfServiceValue);


            try {
              const response: any = await fetch(`https://api.vrün.com/${currentChain}/${address}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  type: "AcceptTermsOfService",
                  data: TermsOfServiceValue,
                  signature: TermsOfServiceSignature
                })
              });


              setIncrementer(1)

            } catch (error: any) {
              console.log(error);
              setAddValidatorError(error.error.message.toString())
              setIncrementer(5)
            }


          });
























        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
        const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);



        let feeRecipient = nullAddress

      




        // FOR SMOOTHING POOL CHECK: newFeeRecipient = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketSmoothingPool"))






        const date = Math.floor(Date.now() / 1000);








        const types = {
          "AddValidators": [
            { name: "timestamp", type: "uint256" },
            { name: "firstIndex", type: "uint256" },
            { name: "amountGwei", type: "uint256" },
            { name: "feeRecipient", type: "address" },
            { name: "graffiti", type: "string" },
            { name: "withdrawalAddresses", type: "address[]" },

          ]
        }


        const defaultSalt = ethers.randomBytes(32)


        const baseAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolBase"))
        const initHash = ethers.keccak256(`0x3d602d80600a3d3981f3363d3d373d3d3d363d73${baseAddress.slice(2)}5af43d82803e903d91602b57fd5bf3`)




        const MinipoolFactoryAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolFactory"))


        const factoryContract = new ethers.Contract(MinipoolFactoryAddress, factoryABI, signer);





        const keccakedHash = ethers.keccak256(initHash)
        const keccakedSalt = ethers.keccak256(ethers.concat([address, defaultSalt]))

        //const salt = await browserProvider.getTransactionCount(address)






        const newMinipoolAddress = ethers.keccak256(ethers.concat(['0xff', MinipoolFactoryAddress, keccakedSalt, initHash]))
        const fixedNewMinipoolAddress = `0x${newMinipoolAddress.slice(-40)}`


        const value = {

          timestamp: date.toString(),
          firstIndex: currentIndex,
          amountGwei: (parseEther('1') / ethers.parseUnits('1', 'gwei')).toString(),
          feeRecipient: feeRecipient.toLowerCase(),
          graffiti: grafittiInput,
          withdrawalAddresses: [fixedNewMinipoolAddress.toLowerCase()],


        }

        console.log( "The value:" + Object.entries(value))


        const APIType = "AddValidators";
        let signature = await signer.signTypedData(EIP712Domain, types, value);

        let depositDataRoot;
        let depositSignature;


        try {
          const response: any = await fetch(`https://api.vrün.com/${currentChain}/${address}/${currentIndex}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              type: APIType,
              data: value,
              signature: signature
            })
          });

          const resJSON = await response.json();
          const firstPubkey = Object.keys(resJSON)[0];
          ({ depositDataRoot, signature: depositSignature } = resJSON[firstPubkey]);

          console.log("First Pubkey:" + firstPubkey);

          setIncrementer(2)


        } catch (error: any) {
          console.log(error);
          setAddValidatorError(error.message.toString())
          setIncrementer(5)
        }




        let generatedPubKey;


        console.log("generatedKey:" + generatedPubKey);




        await fetch(`https://api.vrün.com/${currentChain}/${address}/pubkey/${currentIndex}`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(async response => {

            var jsonString = await response.json()


            console.log("Result of pubkey GET" + jsonString)

            generatedPubKey = jsonString;





          })
          .catch((error: any) => {

            console.log(error);

            setAddValidatorError(error.message.toString())
            setIncrementer(5)
          });








        console.log("Gen pubkey" + generatedPubKey);
        console.log("Graff:" + grafittiInput)

        console.log("Fixed: " + fixedNewMinipoolAddress);

        console.log("Base Address:" + baseAddress);
        console.log(typeof newMinipoolAddress)

        console.log(depositSignature);
        console.log(depositDataRoot)


        const NodeDepositAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDeposit"))


        const depositContract = new ethers.Contract(NodeDepositAddress, depositABI, signer);



        let result;


        if (selectedCont === "16 ETH") {

          result = await depositContract.deposit(ethers.parseEther('16'), ethers.parseEther('0.14'), generatedPubKey, depositSignature, depositDataRoot, ethers.hexlify(defaultSalt), fixedNewMinipoolAddress, { value: ethers.parseEther('16') });


        }

        else {
          result = await depositContract.deposit(ethers.parseEther('8'), ethers.parseEther('0.14'), generatedPubKey, depositSignature, depositDataRoot, ethers.hexlify(defaultSalt), fixedNewMinipoolAddress, { value: ethers.parseEther('8') });
        }


        console.log(result);


        let receipt = await result.wait();

        // Check if the transaction was successful
        if (receipt.status === 1) {
        

          // Read the emitted event logs
          let logs = receipt.logs;
          // Process logs if needed

          // Call checkIndex function regardless of the transaction status
          checkIndex();
      

          const newData = await getMinipoolData();

          setIncrementer(3); // Trigger immediately


           
          
          setIncrementerWithDelay(4, 1500);

        } else {
          setAddValidatorError("Transaction failed!");
          setIncrementer(5)
          // Handle the failure case if needed

          // Call checkIndex function regardless of the transaction status
          checkIndex();
        }



      }


      catch (e: any) {



        if (e.reason === "rejected") {
          setAddValidatorError(e.info.error.message.toString())
   

        }
        else {
          setAddValidatorError(e.error["message"].toString())
        

        }

        setIncrementer(5)


      }



    }

    else {
      setAddValidatorError("You must enter a grafitti for the Validator!")  
      setIncrementer(5)

    }

   
  }


  const [checked, setChecked] = useState(false)


  const handleChecked = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked(checked)


  }




  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };




  const [checked2, setChecked2] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFormEffect, setShowFormEffect] = useState(false);


  useEffect(() => {


    setShowFormEffect(showForm);


  }, [showForm]);


  const handleChecked2 = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked2(checked)
    console.log(checked);


  }



  const setFeeRecipient = async (inOutBool: boolean) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()


    /*  struct SetFeeRecipient {
  uint256 timestamp;
  bytes pubkey;
  address feeRecipient;
} */


    const newNextIndex = await fetch(`https://api.vrün.com/${currentChain}/${address}/nextindex`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of get next index" + jsonString)


        return jsonString;

      })
      .catch(error => {

        console.log(error);
      });









    if (newNextIndex === 0) {

      console.log("No Validators to change the Fee Recipient for")

    } else {








      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
      const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
      const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);







      let newPubkeyArray: Array<string> = []
      let newIndexArray: Array<number> = []



      for (let i = 0; i <= newNextIndex - 1; i++) {



        await fetch(`https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json"
          },
        })
          .then(async response => {

            let pubkey = await response.json()

            newPubkeyArray.push(pubkey)
            newIndexArray.push(i)

            console.log("pUBKEY:" + pubkey)


          })
          .catch(error => {

            console.log(error)


          });

      }


      console.log(newPubkeyArray);
      console.log(newIndexArray);

      const types = {
        SetFeeRecipient: [
          { name: 'timestamp', type: 'uint256' },
          { name: 'pubkeys', type: 'bytes[]' },
          { name: 'feeRecipient', type: 'address' },

        ]
      }


      let newFeeRecipient = nullAddress

     


      const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
      const APItype = "SetFeeRecipient"

      const date = Math.floor(Date.now() / 1000);

      const value = { timestamp: date, pubkeys: newPubkeyArray, feeRecipient: newFeeRecipient }


      let signature = await signer.signTypedData(EIP712Domain, types, value);

      await fetch(`https://api.vrün.com/${currentChain}/${address}/batch`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: APItype,
          data: value,
          signature: signature,
          indices: newIndexArray
        })
      })
        .then(async response => {

          var resString = await response.text()// Note: response will be opaque, won't contain data

          console.log("Get Deposit Data response" + resString)

          alert("setFeeRecipient success!")
        })
        .catch(error => {
          // Handle error here
          console.log(error);
          setErrorBoxTest3("setFeeRecipient failed...") 
        });


    }


  }





  const [errorBoxText3, setErrorBoxTest3] = useState("")


  useEffect(() => {


    if (errorBoxText3 !== "") {


      const handleText = () => {
        setErrorBoxTest3("")

      }


      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);




    }

  }, [errorBoxText3])






  const handleOptSmoothingPool = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {




        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()

        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);

        const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))



        const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)
        console.log("Rocket Node Manager:" + rocketNodeManager)
        const tx = await rocketNodeManager.setSmoothingPoolRegistrationState(checked2)
        console.log(tx);

        // Listen for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

   

        if (checked2 === false) {

          alert("Opt-out of Smoothing Pool Sucessful")
          setShowForm(false)


        } else {


          alert("Opt-in to Smoothing Pool Sucessful")
          setShowForm(false)

        }


        // Check if transaction was successful

      } catch (error) {



        let input: any = error



        if (input.reason === "rejected") {
          setErrorBoxTest3(input.info.error.message.toString())

        }
        else {
          setErrorBoxTest3(input.reason.toString())
        }



      }
    }
  }





  const [showForm4, setShowForm4] = useState(false)
  const [showFormEffect4, setShowFormEffect4] = useState(false);
  const [currentStatus1, setCurrentStatus1] = useState(0)
  const [currentStatus2, setCurrentStatus2] = useState(0)
  const [currentStatus3, setCurrentStatus3] = useState(0)
  const [incrementer, setIncrementer] = useState(0);


  useEffect(() => {


    if (incrementer === 1) {

      setCurrentStatus1(1)
      setCurrentStatus2(1)

    } else if (incrementer === 2) {
      setCurrentStatus2(2)
      setCurrentStatus3(1)


    } else if (incrementer === 3) {

      setCurrentStatus3(2)



    } else if (incrementer === 4) {
      setCurrentStatus3(3)
    } else if (incrementer === 5) {
      setCurrentStatus3(4)
    }



    else {

      setCurrentStatus1(0)
      setCurrentStatus2(0)
      setCurrentStatus3(0)



    }

  }, [incrementer])



  const handleIncrementer = () => {

    if (incrementer === 4) {
      setIncrementer(0)
    }

    else {
      let newIncrement = incrementer + 1
      setIncrementer(newIncrement)

    }


  }


  const setIncrementerWithDelay = (value: number, delay: number) => {
    setTimeout(() => {
      setIncrementer(value);
    }, delay);
  };




  const triggerConfetti = () => {
    confetti();
  };




  useEffect(() => {


    setShowFormEffect4(showForm4);

    if(showForm4 === false) {
      setIncrementer(0)
    }


  }, [showForm4]);



  useEffect(() => {

    if (currentStatus3 === 3) {

      triggerConfetti();
    }

  }, [currentStatus3])


  const [currentStakeStatus1, setCurrentStakeStatus1] = useState(0)
  const [currentStakeStatus2, setCurrentStakeStatus2] = useState(0)
  const [currentStakeStatus3, setCurrentStakeStatus3] = useState(0)



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

    if(showFormStakeRPL === false) {
      setIncrementer(0)
    }


  }, [showFormStakeRPL]);


  



  useEffect(() => {

    if (currentStakeStatus3 === 3) {

      triggerConfetti();
    }

  }, [currentStakeStatus3])






  
  const [showFormUnstakeRPL, setShowFormUnstakeRPL] = useState(false)
  const [showFormEffectUnstakeRPL, setShowFormEffectUnstakeRPL] = useState(false)


  useEffect(() => {


    setShowFormEffectUnstakeRPL(showFormUnstakeRPL);


    if(showFormUnstakeRPL === false) {
      setIncrementer(0)
    }



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


    }  else if (incrementer === 4) {
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






  const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)



  return (
    <div style={{backgroundColor: reduxDarkMode? "#222": "white",  color: reduxDarkMode?  "white" : "#222"}} className="flex w-full flex-col items-center bg-white justify-center ">

      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="Vrün  | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Navbar />



      {address !== undefined ? (


        <>

          {isRegistered ? (



            <div className='flex w-full h-auto min-h-[92vh] gap-10 py-[10vh]   flex-col items-center justify-center'>















              {Number(formatEther(newMinipools)) < 1 &&
                <div className="flex flex-col  gap-2 w-[500px] rounded-xl border border-black-100 px-4 py-[5vh] text-center shadow-xl items-center justify-center flex items-center p-8 shadow rounded-lg border">
                  <h2 className="text-4xl w-[90%] font-bold  ">Stake/Unstake RPL </h2>

                  <p className="my-4 w-[80%] text-gray-500 sm:text-l">
                    You have
                    <span className='text-yellow-500 font-bold'> <RollingNumber n={Number(ethers.formatEther(RPL))} bool={true} /> </span>
                    unstaked RPL in your Wallet and
                    <span style={Number(ethers.formatEther(stakeRPL)) >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }} className='font-bold'> <RollingNumber n={Number(ethers.formatEther(stakeRPL))} bool={true} /> </span>
                    staked RPL.
                    You have
                    <span className='text-green-500 font-bold' style={displayActiveMinipools >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> <RollingNumber n={Number(displayActiveMinipools)} bool={true} /> </span>
                    active Minipool(s) and are able to create <span className={`text-green-500 font-bold`} style={Math.floor(Number(ethers.formatEther(newMinipools))) < 1 ? { color: "red" } : { color: "rgb(34 197 94)" }}> <RollingNumber n={Math.floor(Number(ethers.formatEther(newMinipools)))} bool={true} /></span> new LEB8s (Minipools)


                  </p>
                  <input value={RPLinput} placeholder='RPL Value' className="border border-black-500 " style={stakeButtonBool ? { display: "block" } : { display: "none" }} type="text" onChange={handleRPLInputChange} />

                  <div className='w-3/5 flex gap-2 items-center my-2 justify-center'>

                 


                    <button onClick={handleStakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake RPL</button>
                    <button onClick={handleUnstakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Unstake RPL</button>







                  </div>

                  {errorBoxText !== "" &&
                    <div className='w-3/5 flex gap-2 items-center justify-center'>

                      <p className="my-4 w-[80%] font-bold text-red-500 sm:text-l">{errorBoxText}</p>

                    </div>


                  }
                </div>}




              <div style={Number(formatEther(newMinipools)) < 1 ? { opacity: "0.5", pointerEvents: "none" } : { opacity: "1", pointerEvents: "auto" }} className="flex flex-col w-[500px] gap-2 rounded-xl border border-black-100 px-4 py-[5vh] text-center shadow-xl items-center justify-center flex items-center p-8 shadow rounded-lg border">
                <h2 className="text-3xl font-bold ">Create a New Validator</h2>


                <input value={grafittiInput} placeholder='Grafitti' className="mt-4 mb-2 border border-black-200 " type="text" onChange={handleGrafittiInput} />


                <div className="w-[80%] mt-2">
                  <label className="text-gray-500 mb-3 sm:text-l"> Please select ETH Deposit Value:</label>
                  <div className="flex items-center justify-center gap-2">
                    <label >
                      <input
                        type="radio"
                        name="contType"
                        value="8 ETH"
                        checked={selectedCont === '8 ETH'}
                        onChange={handleContChange}
                      />
                      <span className="ml-2">8 ETH</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="contType"
                        value="16 ETH"
                        checked={selectedCont === '16 ETH'}
                        onChange={handleContChange}
                      />
                      <span className="ml-2">16 ETH</span>
                    </label>


                  </div>




                </div>



                <div className='w-3/5 flex gap-2 items-center justify-center'>
                  <button onClick={handleAddValidator} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                    Add
                  </button>
                </div>

             
              </div>





              <Modal
                isOpen={showForm}
                onRequestClose={() => setShowForm(false)}
                contentLabel="Smoothing Pool Opt Modal"
                className={`${styles.modal} ${showFormEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">

                  <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                      setShowForm(false)
                    }} />

                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Opt-in/opt-out of Smoothing Pool</h2>

                  <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                    Would you like your node to be a part of the Smoothing Pool? Toggle the checkbox and submit your result
                  </p>





                

                  <div className="flex items-center justify-center w-full gap-4">
                      <span>Opt in?</span>
                      <label className="flex items-center justify-center gap-1">
                        <input
                          type="radio"
                          name="optIn"
                          checked={checked2 === true}
                          onChange={() => setChecked2(true)}
                        />
                        Yes
                      </label>
                      <label className="flex items-center justify-center gap-1">
                        <input
                          type="radio"
                          name="optIn"
                          checked={checked2 === false}
                          onChange={() => setChecked2(false)}
                        />
                        No
                      </label>
                    </div>

                  <div className='w-full flex gap-2 items-center justify-center'>
                    <button onClick={handleOptSmoothingPool} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Confirm Changes
                    </button>
                  </div>

                  {errorBoxText3 !== "" &&
                    <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">{errorBoxText3}</p>
                  }




                </div>


              </Modal>



              <Modal
                isOpen={showForm4}
                onRequestClose={() => setShowForm4(false)}
                contentLabel="Create Validator Modal"
                className={`${styles.modal} ${showFormEffect4 ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                        setShowForm4(false)
                      }} />

                    </div>
                  </div>
                  {currentStatus3 === 3 ? (


                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                      <h3 className="font-bold text-[30px]">Validator Deposited</h3>

                      <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                      <button onClick={goToAccount} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">See Validator</button>
                    </div>




                  ) : currentStatus3 === 4 ? (

                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                        <h3 className="font-bold text-[30px]">Deposit Failed.</h3>

                        <p className='my-3 text-lg text-red-400 '>{addValidatorError}</p>

                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                        <button onClick={() => { setShowForm4(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>

                        
                    </div>



                       


                ) : (


                    <>




                      <div className='w-full flex items-start flex-col gap-2 justify-center'>
                        <h3 className="font-bold text-[30px]">Validator Deposit</h3>
                        <p className="text-[25px]">{selectedCont}</p>
                      </div>

                      <hr className="w-full my-3" />

                      <div className='flex flex-col gap-3 items-center justify-center w-full'>


                        <div className='flex items-start justify-between gap-6 w-full'>
                          <div className="flex items-center justify-start gap-4">
                            <p> <FaEthereum /></p>

                            <p className="text-left">Checking Terms and Conditions Acceptance</p>
                          </div>
                          <p className='self-end'>

                            {

                              currentStatus1 === 0 ? (
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

                            <p className="text-left" >Get Signed Deposit Data</p>
                          </div>
                          <p className='self-end'>

                            {

                              currentStatus2 === 0 ? (
                                <p></p>

                              ) : currentStatus2 === 1 ? (

                                <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                              ) : (

                                <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                              )




                            }


                          </p>


                        </div>



                        <div className='flex items-start justify-between gap-6 w-full'>
                          <div className="flex items-center justify-start gap-4">
                            <p> <FaSignature /></p>
                            <p className="text-left">Deposit your ETH</p>
                          </div>
                          <p className='self-end'>

                            {

                              currentStatus3 === 0 ? (
                                <p></p>

                              ) : currentStatus3 === 1 ? (

                                <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                              ) : (

                                <div className="flex items-center justify-center text-green-400 text-[25px]"> <TiTick /></div>



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
        isOpen={showFormStakeRPL}
        onRequestClose={() => setShowFormStakeRPL(false)}
        contentLabel="Create Validator Modal"
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

          <div className="flex items-start justify-center gap-3 w-full">

            <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">

              <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                setShowFormStakeRPL(false)
              }} />

            </div>
          </div>
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
        contentLabel="Create Validator Modal"
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

          <div className="flex items-start justify-center gap-3 w-full">

            <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">

              <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                setShowFormUnstakeRPL(false)
              }} />

            </div>
          </div>
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







            </div>) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
          }</>
      ) : (<NoConnection />)}





      <Footer />
    </div>
  )
}

export default CreateValidator