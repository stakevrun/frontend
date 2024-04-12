import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/navbar';
import type { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import NoConnection from '../components/noConnection';
import { ethers } from 'ethers';
import NoRegistration from '../components/noRegistration';
import { mainnet } from 'viem/chains';
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther, TransactionReceipt } from 'viem';
import Head from 'next/head';
import miniManagerABI from "../json/miniManagerABI.json"
import storageABI from "../json/storageABI.json"
import managerABI from "../json/managerABI.json"
import daoABI from "../json/daoABI.json"
import distributorABI from "../json/distributorABI.json"
import feeABI from "../json/feeABI.json"
import tokenABI from "../json/tokenABI.json"
import stakingABI from "../json/stakingABI.json"
import networkABI from "../json/networkABI.json"
import factoryABI from "../json/factoryABI.json"
import depositABI from "../json/depositABI.json"




import RollingNumber from '../components/rollingNumber';


import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Footer from '../components/footer';


//https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4

const CreateValidator: NextPage = () => {







  const [NodeStakingAddress, setNodeStakingAddress] = useState("")


  const [minipoolDepositInput, setMinipoolDepositInput] = useState("")

  const [errorBoxText2, setErrorBoxTest2] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0)











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


      


        if (Number(ethers.formatEther(amount)) < 1) {

          setNewMinipools(BigInt(0))


        } else {

        let LEB8sPossible = amount / rplRequiredPerLEB8
        let possibleNewMinpools = LEB8sPossible - ethers.parseEther(activeMinipools.toString());

        

        console.log(" LEB8sPossible: " + LEB8sPossible);
        // getNodeActiveMinipoolCount



      



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

        const val = parseEther(RPLinput);

        const approvalTx = await tokenContract.approve(NodeStakingAddress, val);
        console.log("Approval transaction:", approvalTx.hash);

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
      const val = parseEther(RPLinput);

      const tx = await rocketNodeStaking.stakeRPL(val);
      console.log("Stake transaction:", tx.hash);

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
    }
  };



  const handleStakeButtonClick = async () => {
    setStakeButtonBool(false)
    const nodeAddress = await handleApproveRPL();
    if (nodeAddress) {
      setNodeStakingAddress(nodeAddress);
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
      const val = parseEther(RPLinput);

      console.log("Here is ok")
      const tx = await rocketNodeStaking.withdrawRPL(val);
      console.log("Withdrawal transaction:", tx.hash);

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
    } catch (error: any) {
      console.log(error.message);


      let input: any = error

      setErrorBoxTest(input.reason.toString());
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





  const checkIndex = async () => {


    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





    //Get latest index

    const newNextIndex = await fetch(`https://db.vrün.com/${currentChain}/${address}/nextindex`, {
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





    //Get all pubkeys

    let pubkeyArray: Array<string> = [];


    for (let i = 0; i < newNextIndex; i++) {



      await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
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



    const index = findFirstFalseIndex(attachedPubkeyArray);

    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      setCurrentIndex(newNextIndex)
    }










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

    console.log(minipoolDepositInput)

  }, [minipoolDepositInput])




  useEffect(() => {

    console.log("Current Validator Index:" + currentIndex)
  }, [currentIndex])





  const handleAddValidator = async () => {






    if (address !== undefined) {


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


      await fetch(`https://db.vrün.com/${currentChain}/${address}/acceptance`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async response => {

          var jsonString = await response.json()


          console.log("Result of Acceptance GET" + jsonString)


        })
        .catch(async error => {

          console.log(error);

          const requiredDeclaration = 'I accept the terms of service specified at https://vrün.com/terms (with version identifier 20240229).';


          const TermsOfServiceValue = {
            declaration: requiredDeclaration
          }


          let TermsOfServiceSignature = await signer.signTypedData(EIP712Domain, TermsOfServiceTypes, TermsOfServiceValue);


          try {
            const response: any = await fetch(`https://db.vrün.com/${currentChain}/${address}`, {
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

          } catch (error) {
            console.log(error);
          }


        });
























      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
      const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
      const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);







      const feeRecipient = await distributorContract.getProxyAddress(address);







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


      const APIType = "AddValidators";
      let signature = await signer.signTypedData(EIP712Domain, types, value);

      let depositDataRoot;
      let depositSignature;


      try {
        const response: any = await fetch(`https://db.vrün.com/${currentChain}/${address}/${currentIndex}`, {
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









      } catch (error) {
        console.log(error);
      }




      let generatedPubKey;


      console.log("generatedKey:" + generatedPubKey);




      await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${currentIndex}`, {
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
        .catch(error => {

          console.log(error);
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
        console.log("Transaction successful!");

        // Read the emitted event logs
        let logs = receipt.logs;
        // Process logs if needed

        // Call checkIndex function regardless of the transaction status
        checkIndex();
      } else {
        console.log("Transaction failed!");
        // Handle the failure case if needed

        // Call checkIndex function regardless of the transaction status
        checkIndex();
      }










      //await depositContract.deposit(validatorKey.getPublicKey(), signature, depositDataRoot, salt, minipoolAddress)
      //  const contract = new contract('0x', ['function deposit(uint256 minimumNodeFee, bytes validatorPubkey, bytes validatorSignature, bytes32 depositDataRoot, uint256 salt, address expectedMinipoolAddress) external payable'], provider)
      //  await contract.deposit(15%, validatorKey.getPublicKey(), signature, depositDataRoot, salt, minipoolAddress)



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


    const newNextIndex = await fetch(`https://db.vrün.com/${currentChain}/${address}/nextindex`, {
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

      alert("No Validators to change the Fee Recipient for")

    } else {








      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
      const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
      const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);







      let newPubkeyArray: Array<string> = []
      let newIndexArray: Array<number> = []



      for (let i = 0; i <= newNextIndex - 1; i++) {



        await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
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


      let newFeeRecipient;

      if (inOutBool === true) {



        newFeeRecipient = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketSmoothingPool"))
        console.log("It is true dough!")
        console.log(newFeeRecipient)


      } else {
        newFeeRecipient = await distributorContract.getProxyAddress(address);
        console.log(newFeeRecipient)

      }



      const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
      const APItype = "SetFeeRecipient"

      const date = Math.floor(Date.now() / 1000);

      const value = { timestamp: date, pubkeys: newPubkeyArray, feeRecipient: newFeeRecipient }


      let signature = await signer.signTypedData(EIP712Domain, types, value);

      await fetch(`https://db.vrün.com/${currentChain}/${address}/batch`, {
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
          alert("setFeeRecipient failed...")
        });


    }


  }









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

        await setFeeRecipient(checked2);

        if (checked2 === false) {

          alert("Opt-out of Smoothing Pool Sucessful")


        } else {


          alert("Opt-in to Smoothing Pool Sucessful")

        }


        // Check if transaction was successful

      } catch (error) {



        let input: any = error

        setErrorBoxTest2(input.reason.toString());

      }
    }
  }



  return (
    <div className="flex w-full flex-col items-center justify-center ">

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



            <div className='flex w-full mt-10 h-auto lg:mt-0 flex-col items-center justify-center'>






              <div className="flex items-center justify-center flex-col w-full pb-10  flex items-center  p-8 bg-white ">

                <div className="mt-8 sm:mt-12 sm:w-2/5   w-3/5">
                  <dl className="grid lg:grid-cols-1 gap-10 md:grid-cols-1 sm:grid-cols-1">



                    {currentIndex === 0 &&

              
                  <div className="flex flex-col w-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center items-center justify-center r flex items-center p-8 bg-white shadow rounded-lg border">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Opt-in/opt-out of Smoothing Pool</h2>

                      <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                        Would you like your node to be a part of the Smoothing Pool? Toggle the checkbox and submit your result
                      </p>





                      <label className=" flex items-center justify-center w-[80%] gap-2">


                        <span>Opt in?</span>

                        <input
                          type="checkbox"

                          checked={checked2}
                          onChange={handleChecked2}
                        />
                      </label>


                      <div className='w-3/5 flex gap-2 items-center justify-center'>
                        <button onClick={handleOptSmoothingPool} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                          Confirm Changes
                        </button>
                      </div>

                      {errorBoxText2 !== "" &&
                        <div className='w-3/5 flex gap-2 items-center justify-center'>

                          <p className="my-4 w-[80%] font-bold text-red-500 sm:text-l">{errorBoxText2}</p>

                        </div>


                      }




                    </div>

                            }        {Number(formatEther(newMinipools)) < 1 &&
                      <div className="flex flex-col w-auto h-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center shadow items-center justify-center">
                        <h2 className="text-2xl w-[90%] font-bold text-gray-900 sm:text-2xl">Stake RPL for your Minipool Deposits </h2>

                        <p className="my-4 w-[80%] text-gray-500 sm:text-l">
                          You have
                          <span className='text-yellow-500 font-bold'> <RollingNumber n={Number(formatEther(RPL))} /> </span>
                          unstaked RPL in your Wallet and
                          <span className='text-green-500 font-bold'> <RollingNumber n={Number(formatEther(stakeRPL))} /> </span>
                          staked RPL.
                          You have
                          <span className='text-green-500 font-bold' style={displayActiveMinipools >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> <RollingNumber n={Number(displayActiveMinipools)} /> </span>
        one active Minipool and are able to create <span className={`text-green-500 font-bold`} style={ Math.floor(Number(ethers.formatEther(newMinipools))) < 1 ? { color: "red" }: { color: "rgb(34 197 94)" } }> <RollingNumber n={Math.floor(Number(ethers.formatEther(newMinipools)))} /></span> new LEB8s (Minipools)

                        </p>
                        <input value={RPLinput} placeholder='RPL Value' className=" border border-black-200 " style={stakeButtonBool ? { display: "block" } : { display: "none" }} type="text" onChange={handleRPLInputChange} />

                        <div className='w-3/5 flex gap-2 items-center my-2 justify-center'>

                          {!stakeButtonBool && <p>Continuing approval & stake in Wallet...</p>}


                          <button onClick={handleStakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake RPL</button>
                          <button onClick={handleUnstakeButtonClick} style={stakeButtonBool ? { display: "block" } : { display: "none" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Unstake RPL</button>







                        </div>

                        {errorBoxText !== "" &&
                          <div className='w-3/5 flex gap-2 items-center justify-center'>

                            <p className="my-4 w-[80%] font-bold text-red-500 sm:text-l">{errorBoxText}</p>

                          </div>


                        }
                      </div>}




                    <div style={Number(formatEther(newMinipools)) < 1 ? { opacity: "0.5", pointerEvents: "none" } : { opacity: "1", pointerEvents: "auto" }} className="flex flex-col w-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center shadow items-center justify-center flex items-center p-8 bg-white shadow rounded-lg border">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Add Validator</h2>

                      <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                        Create your custom &quot;graffiti&quot;, select <span>8ETH</span> or <span>16ETH</span>, and we will do the rest!
                      </p>


                      <input value={grafittiInput} placeholder='Grafitti' className=" border border-black-200 " type="text" onChange={handleGrafittiInput} />


                      <div className="w-[80%] mt-5">
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




                  </dl>
                </div>


              </div>

            </div>) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
          }</>
      ) : (<NoConnection />)}





<Footer/>
    </div>
  )
}

export default CreateValidator