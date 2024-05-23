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


import RollingNumber from '../components/rollingNumber';


import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Footer from '../components/footer';


//https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4

const CreateValidator: NextPage = () => {







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

      if (input.reason !== undefined) {
        setErrorBoxTest(input.reason.toString());


      } else {
        setErrorBoxTest("Rejected. Did you enter an RPL value?")
      }



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
              setShowForm4(false)
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
          setShowForm4(false)
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
            setShowForm4(false)
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
      

          setIncrementer(3); // Trigger immediately
          setIncrementerWithDelay(4, 1500);

        } else {
          setAddValidatorError("Transaction failed!");
          setShowForm4(false)
          // Handle the failure case if needed

          // Call checkIndex function regardless of the transaction status
          checkIndex();
        }



      }


      catch (e: any) {



        if (e.reason === "rejected") {
          setAddValidatorError(e.info.error.message.toString())
          setShowForm4(false)

        }
        else {
          setAddValidatorError(e.error["message"].toString())
          setShowForm4(false)

        }



      }



    }

    else {
      alert("You must enter a grafitti for the Validator!")
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


  }, [showForm4]);



  useEffect(() => {

    if (currentStatus3 === 3) {

      triggerConfetti();
    }

  }, [currentStatus3])









  return (
    <div className="flex w-full flex-col items-center bg-white justify-center ">

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
                <div className="flex flex-col  gap-2 w-[500px] rounded-xl border border-black-100 px-4 py-[5vh] text-center shadow-xl items-center justify-center flex items-center p-8 bg-white shadow rounded-lg border">
                  <h2 className="text-4xl w-[90%] font-bold text-gray-900 ">Stake/Unstake RPL </h2>

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

                    {!stakeButtonBool &&

                      <div className="flex flex-col items-center justify-center gap-2">

                        <p className="mb-2 text-gray-500">{stakingMessage}</p>

                        <BounceLoader />
                      </div>


                    }


                    <button onClick={handleStakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake RPL</button>
                    <button onClick={handleUnstakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Unstake RPL</button>







                  </div>

                  {errorBoxText !== "" &&
                    <div className='w-3/5 flex gap-2 items-center justify-center'>

                      <p className="my-4 w-[80%] font-bold text-red-500 sm:text-l">{errorBoxText}</p>

                    </div>


                  }
                </div>}




              <div style={Number(formatEther(newMinipools)) < 1 ? { opacity: "0.5", pointerEvents: "none" } : { opacity: "1", pointerEvents: "auto" }} className="flex flex-col w-[500px] gap-2 rounded-xl border border-black-100 px-4 py-[5vh] text-center shadow-xl items-center justify-center flex items-center p-8 bg-white shadow rounded-lg border">
                <h2 className="text-3xl font-bold text-gray-900 ">Create a New Validator</h2>


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

                {addValidatorError !== "" &&
                  <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">{addValidatorError}</p>
                }
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







            </div>) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
          }</>
      ) : (<NoConnection />)}





      <Footer />
    </div>
  )
}

export default CreateValidator