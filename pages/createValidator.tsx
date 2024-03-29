import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from './components/navbar';
import type { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import NoConnection from './components/noConnection';
import { ethers } from 'ethers';
import NoRegistration from './components/noRegistration';
import { mainnet } from 'viem/chains';
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther, TransactionReceipt } from 'viem';
import Head from 'next/head';
import miniManagerABI from "./json/miniManagerABI.json"

import RollingNumber from './components/rollingNumber';


import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


//https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4

const CreateValidator: NextPage = () => {


  const [isRegistered, setIsRegistered] = useState(true)
  const [foundryAccount, setFoundryAccount] = useState("");
  const [account, setAccount] = useState("")
  const [wallet, setWallet] = useState({});
  const [RPL, setRPL] = useState(BigInt(0));
  const [stakeRPL, setStakeRPL] = useState(BigInt(0));
  const [newMinipools, setNewMinipools] = useState(BigInt(0))
  const [RPLinput, setRPLinput] = useState("")
  const [displayActiveMinipools, setDisplayActiveMinipools] = useState(0)
  const [stakeButtonBool, setStakeButtonBool] = useState(true)
  const [RPLApproved, setRPLApproved] = useState(false)
  const [NodeStakingAddress, setNodeStakingAddress] = useState("")

  const [currentPubKey, setCurrentPubKey] = useState("");
  const [minipoolDepositInput, setMinipoolDepositInput] = useState("")
  const [errorBoxText, setErrorBoxTest] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0)





  //VIEM FUNCTIONS


  const client = createPublicClient({

    chain: mainnet,

    transport: http(`http://127.0.0.1:8545`)
  })
    .extend(publicActions)
    .extend(walletActions)


  const connect = async () => {

    try {


      let newWallet;


      if ((window as any).ethereum !== undefined) {


        newWallet = await createWalletClient({
          chain: mainnet,
          transport: custom((window as any).ethereum)
        })

        setWallet(newWallet);



        const [address] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })



        setAccount(address)





      }





      newWallet = null;
    } catch (e) {

      alert("You must install an Ethereum Wallet to use the app")

      // location.reload();
    }


  }


  const getFoundry = async () => {

    try {
      const [newAddress] = await client.requestAddresses()
      setFoundryAccount(newAddress)
      alert("SUCCESS: Foundry connected!")

    } catch (e) {

      console.log(e)
      alert("FAIL: Foundry has not been connected.")

    }


  }


  {/*const handleFakestETH = async () => {



    await client.sendTransaction({
      account: foundryAccount,
      to: address,
      value: parseEther('2')
    })
  } */}






  const [registrationResult, setRegistrationResult] = useState({ result: "" });

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
        const provider  = new ethers.JsonRpcProvider(currentRPC);
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

  const { address } = useAccount({

    
    onConnect: async ({ address }) => {


      if (address !== undefined) {
        try {
          checkIndex();
          const reg = await registrationCheck(address);
          setIsRegistered(reg);
          if(reg === true) {

            await   handleCheckRPL(address);
            await handleCheckStakeRPL(address)


          }
          
        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during registration check:", error);
        }
      }
    }
  })





  const currentChain = useChainId();
 
  


  

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"
  const currentRPC = currentChain === 17000 ?   'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/'    : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"




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

        const provider  = new ethers.JsonRpcProvider(currentChain === 17000 ?   'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/'    : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/");


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

      console.log("Reg Spot 1")

      try {






        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()

        const provider  = new ethers.JsonRpcProvider(currentChain === 17000 ?   'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/'    : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/");


        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);






        const NodeStakingAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeStaking"))

        const rocketNodeStaking = new ethers.Contract(
          NodeStakingAddress, // Replace with your staking contract address
          stakingABI, // Replace with your staking contract ABI
          signer
        );






        const amount = await rocketNodeStaking.getNodeRPLStake(add)


        console.log("Amount" + amount)


        setStakeRPL(amount);

        console.log("Stake RPL amount:" + amount);

        const rocketNetworkPrices = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNetworkPrices"));
        const rocketNetworkContract = new ethers.Contract(rocketNetworkPrices, NetworkABI, signer)

        const rplPrice = await rocketNetworkContract.getRPLPrice()
        const rplRequiredPerLEB8 = ethers.parseEther('2.4') / rplPrice

        console.log("rplRequiredPerLEB8: " + rplRequiredPerLEB8)
        const LEB8sPossible = amount / rplRequiredPerLEB8
        console.log(" LEB8sPossible: " + LEB8sPossible);
        // getNodeActiveMinipoolCount


        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, ManagerABI, signer)





        const activeMinipools = await MinipoolManager.getNodeMinipoolCount(address);









        const possibleNewMinpools = LEB8sPossible  - parseEther(activeMinipools.toString());



        setDisplayActiveMinipools(activeMinipools);

        console.log("Possible new:" + LEB8sPossible);
        console.log("Active minipools:" + activeMinipools)

        setNewMinipools(possibleNewMinpools)


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













  /* const handleMiniPoolDeposit = async () => {
 
 
     if (address !== undefined && currentPubKey !== "") {
 
 
 
       let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
       let signer = await browserProvider.getSigner();
 
 
       const defaultSalt = ethers.randomBytes(32)
 
 
 
 
 
 
 
       const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
       const baseAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolBase"))
       const initHash = ethers.keccak256(`0x3d602d80600a3d3981f3363d3d373d3d3d363d73${baseAddress.slice(2)}5af43d82803e903d91602b57fd5bf3`)
 
 
 
 
       const MinipoolFactoryAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolFactory"))
 
 
       const factoryContract = new ethers.Contract(MinipoolFactoryAddress, factoryABI, signer);
 
 
 
 
 
       const keccakedHash = ethers.keccak256(initHash)
 
       //const salt = await browserProvider.getTransactionCount(address)
 
 
 
 
 
 
       const newMinipoolAddress = ethers.keccak256(ethers.concat(['0xff', MinipoolFactoryAddress, defaultSalt, keccakedHash]))
 
 
 
 
 
       const truncatedMinipoolAddress = newMinipoolAddress.substring(0, 24); // 24 hex characters represent 12 bytes in length
 
 
       const getMinipoolWithdrawalCredentials = (minipoolAddress: any) => {
        // let newAddress = ethers.concat(['0x01', hexZeroPad(minipoolAddress, 31)])
 
 
         return newAddress;
       }
 
       const withdrawalCredentials = getMinipoolWithdrawalCredentials(truncatedMinipoolAddress)
 
 
       console.log(withdrawalCredentials)
 
 
 
 
 
 
 
 
 
 
 
 
 
 
       const types = {
         GetDepositData: [
           { name: 'pubkey', type: 'bytes' },
           { name: 'withdrawalCredentials', type: 'bytes32' },
           { name: 'amountGwei', type: 'uint256' }
         ]
       }
 
 
       const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
       const APItype = "GetDepositData"
 
 
 
       const parsedDeposit = parseEther(minipoolDepositInput).toString();
 
       console.log(parsedDeposit);
       console.log(withdrawalCredentials);
       console.log(currentPubKey);
       const value = { pubkey: currentPubKey, withdrawalCredentials: withdrawalCredentials, amountGwei: parseEther(minipoolDepositInput).toString() }
 
 
       let signature = await signer.signTypedData(EIP712Domain, types, value);
 
 
 
 
       await fetch(`https://db.vrün.com/${currentChain}/${address}/0`, {
         method: "POST",
 
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({
           type: APItype,
           data: value,
           signature: signature
         })
       })
         .then(async response => {
 
           var jsonString = await response.json()// Note: response will be opaque, won't contain data
 
           console.log("Get Deposit Data response" + jsonString)
         })
         .catch(error => {
           // Handle error here
           console.log(error);
         });
 
 
 
 
 
 
 
 
 
 
 
 
     } else {
       alert("You have not initialised a Validator key")
     }
 
 
   }
 */





  useEffect(() => {


    if (errorBoxText !== "") {


      const handleText = () => {
        setErrorBoxTest("")

      }


      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);




    }

  }, [errorBoxText])




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


      const provider  = new ethers.JsonRpcProvider(currentChain === 17000 ?   'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/'    : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/");
   

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



    const index =  findFirstFalseIndex(attachedPubkeyArray);

    if (index !== -1) {
      setCurrentIndex(index);
  } else {
      setCurrentIndex(newNextIndex)
  }
  









  }














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
        .catch(error => {

          console.log(error);
        });









      const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
      let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
      let signer = await browserProvider.getSigner()
      console.log("sIGNER ADDRESS:" + signer.address);

      const TermsOfServiceTypes = {

        "AcceptTermsOfService": [
          { name: "declaration", type: "string" }
        ]



      }


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











      const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
      const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
      const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);


      const feeRecipient = await distributorContract.getProxyAddress(address);
      const date = Math.floor(Date.now() / 1000);






      const randomName = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        style: 'capital'
      });



      const types = {
        "AddValidators": [
          { name: "timestamp", type: "uint256" },
          { name: "firstIndex", type: "uint256" },
          { name: "amountGwei", type: "uint256" },
          { name: "feeRecipient", type: "address" },
          { name: "graffiti", type: "string" },
          { name: "withdrawalAddresses", type: "address[]" },
          { name: "names", type: "string[]" }
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
        names: [randomName]

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
      console.log("Random name:" + randomName);
      console.log("Fixed: " + fixedNewMinipoolAddress);

      console.log("Base Address:" + baseAddress);
      console.log(typeof newMinipoolAddress)

      console.log(depositSignature);
      console.log(depositDataRoot)


      const NodeDepositAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDeposit"))


      const depositContract = new ethers.Contract(NodeDepositAddress, depositABI, signer);

      let result = await depositContract.deposit(ethers.parseEther('8'), ethers.parseEther('0.14'), generatedPubKey, depositSignature, depositDataRoot, ethers.hexlify(defaultSalt), fixedNewMinipoolAddress, { value: ethers.parseEther('8') });
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



  const distributorABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_address", "type": "address" }], "name": "ProxyCreated", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "createProxy", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getProxyAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getProxyBytecode", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]


  const storageABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "oldGuardian", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newGuardian", "type": "address" }], "name": "GuardianChanged", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": true, "internalType": "address", "name": "withdrawalAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "NodeWithdrawalAddressSet", "type": "event" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "addUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "confirmGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "confirmWithdrawalAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBool", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBytes", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBytes32", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteInt", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteString", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getAddress", "outputs": [{ "internalType": "address", "name": "r", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBool", "outputs": [{ "internalType": "bool", "name": "r", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBytes", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBytes32", "outputs": [{ "internalType": "bytes32", "name": "r", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getDeployedStatus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getGuardian", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getInt", "outputs": [{ "internalType": "int256", "name": "r", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodePendingWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getString", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getUint", "outputs": [{ "internalType": "uint256", "name": "r", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "address", "name": "_value", "type": "address" }], "name": "setAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bool", "name": "_value", "type": "bool" }], "name": "setBool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bytes", "name": "_value", "type": "bytes" }], "name": "setBytes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bytes32", "name": "_value", "type": "bytes32" }], "name": "setBytes32", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "setDeployedStatus", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newAddress", "type": "address" }], "name": "setGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, {
    "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" },
    { "internalType": "int256", "name": "_value", "type": "int256" }], "name": "setInt", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "string", "name": "_value", "type": "string" }], "name": "setString", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "setUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "address", "name": "_newWithdrawalAddress", "type": "address" }, { "internalType": "bool", "name": "_confirm", "type": "bool" }], "name": "setWithdrawalAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "subUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]



  const managerABI = [
    { "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "NodeRegistered", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "network", "type": "uint256" }], "name": "NodeRewardNetworkChanged", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "state", "type": "bool" }], "name": "NodeSmoothingPoolStateChanged", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "NodeTimezoneLocationSet", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getAverageNodeFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getFeeDistributorInitialised", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getNodeAddresses", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getNodeAt", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNodeCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getNodeCountPerTimezone", "outputs": [{ "components": [{ "internalType": "string", "name": "timezone", "type": "string" }, { "internalType": "uint256", "name": "count", "type": "uint256" }], "internalType": "struct RocketNodeManagerInterface.TimezoneCount[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeDetails", "outputs": [{ "components": [{ "internalType": "bool", "name": "exists", "type": "bool" }, { "internalType": "uint256", "name": "registrationTime", "type": "uint256" }, { "internalType": "string", "name": "timezoneLocation", "type": "string" }, { "internalType": "bool", "name": "feeDistributorInitialised", "type": "bool" }, { "internalType": "address", "name": "feeDistributorAddress", "type": "address" }, { "internalType": "uint256", "name": "rewardNetwork", "type": "uint256" }, { "internalType": "uint256", "name": "rplStake", "type": "uint256" }, { "internalType": "uint256", "name": "effectiveRPLStake", "type": "uint256" }, { "internalType": "uint256", "name": "minimumRPLStake", "type": "uint256" }, { "internalType": "uint256", "name": "maximumRPLStake", "type": "uint256" }, { "internalType": "uint256", "name": "ethMatched", "type": "uint256" }, { "internalType": "uint256", "name": "ethMatchedLimit", "type": "uint256" }, { "internalType": "uint256", "name": "minipoolCount", "type": "uint256" }, { "internalType": "uint256", "name": "balanceETH", "type": "uint256" }, { "internalType": "uint256", "name": "balanceRETH", "type": "uint256" }, { "internalType": "uint256", "name": "balanceRPL", "type": "uint256" }, { "internalType": "uint256", "name": "balanceOldRPL", "type": "uint256" }, { "internalType": "uint256", "name": "depositCreditBalance", "type": "uint256" }, { "internalType": "uint256", "name": "distributorBalanceUserETH", "type": "uint256" }, { "internalType": "uint256", "name": "distributorBalanceNodeETH", "type": "uint256" }, { "internalType": "address", "name": "withdrawalAddress", "type": "address" }, { "internalType": "address", "name": "pendingWithdrawalAddress", "type": "address" }, { "internalType": "bool", "name": "smoothingPoolRegistrationState", "type": "bool" }, { "internalType": "uint256", "name": "smoothingPoolRegistrationChanged", "type": "uint256" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }], "internalType": "struct NodeDetails", "name": "nodeDetails", "type": "tuple" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodePendingWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRegistrationTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeTimezoneLocation", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getRewardNetwork", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getSmoothingPoolRegisteredNodeCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getSmoothingPoolRegistrationChanged", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getSmoothingPoolRegistrationState", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialiseFeeDistributor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_timezoneLocation", "type": "string" }], "name": "registerNode", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_network", "type": "uint256" }], "name": "setRewardNetwork", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_state", "type": "bool" }], "name": "setSmoothingPoolRegistrationState", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_timezoneLocation", "type": "string" }], "name": "setTimezoneLocation", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]

  const stakingABI = [
    {
      "inputs":
        [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor"
    },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethValue", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLSlashed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLStaked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLWithdrawn", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "allowed", "type": "bool" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "StakeRPLForAllowed", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHCollateralisationRatio", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHMatched", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHMatchedLimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHProvided", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeEffectiveRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeMaximumRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeMinimumRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRPLStakedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_caller", "type": "address" }, { "internalType": "bool", "name": "_allowed", "type": "bool" }], "name": "setStakeRPLForAllowed", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_ethSlashAmount", "type": "uint256" }], "name": "slashRPL", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeRPL", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeRPLFor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawRPL", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]



  const tokenABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }, { "internalType": "contract IERC20", "name": "_rocketTokenRPLFixedSupplyAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLFixedSupplyBurn", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "inflationCalcTime", "type": "uint256" }], "name": "RPLInflationLog", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getInflationCalcTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getInflationIntervalRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getInflationIntervalStartTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getInflationIntervalTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "getInflationIntervalsPassed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getInflationRewardsContractAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "inflationCalculate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "inflationMintTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "swapTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSwappedRPL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]


  const depositABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "DepositReceived", "type": "event" },
  { "inputs": [{ "internalType": "uint256", "name": "_bondAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_minimumNodeFee", "type": "uint256" }, { "internalType": "bytes", "name": "_validatorPubkey", "type": "bytes" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }, { "internalType": "address", "name": "_expectedMinipoolAddress", "type": "address" }, { "internalType": "uint256", "name": "_currentBalance", "type": "uint256" }], "name": "createVacantMinipool", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bondAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "_minimumNodeFee", "type": "uint256" },
      { "internalType": "bytes", "name": "_validatorPubkey", "type": "bytes" },
      { "internalType": "bytes", "name": "_validatorSignature", "type": "bytes" },
      { "internalType": "bytes32", "name": "_depositDataRoot", "type": "bytes32" },
      { "internalType": "uint256", "name": "_salt", "type": "uint256" },
      { "internalType": "address", "name": "_expectedMinipoolAddress", "type": "address" }
    ], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function"
  },
  { "inputs": [{ "internalType": "uint256", "name": "_bondAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_minimumNodeFee", "type": "uint256" }, { "internalType": "bytes", "name": "_validatorPubkey", "type": "bytes" }, { "internalType": "bytes", "name": "_validatorSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "_depositDataRoot", "type": "bytes32" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }, { "internalType": "address", "name": "_expectedMinipoolAddress", "type": "address" }], "name": "depositWithCredit", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "name": "getDepositAmounts", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "pure", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeOperator", "type": "address" }], "name": "getNodeDepositCredit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeOperator", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "increaseDepositCreditBalance", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "increaseEthMatched", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "isValidDepositAmount", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" },
  { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "stateMutability": "payable", "type": "receive" }]

  const baseABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "oldDelegate", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newDelegate", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "DelegateRolledBack", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "oldDelegate", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newDelegate", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "DelegateUpgraded", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "EtherReceived", "type": "event" },
    { "stateMutability": "payable", "type": "fallback" },
    { "inputs": [], "name": "delegateRollback", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "delegateUpgrade", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getDelegate", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getEffectiveDelegate", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getPreviousDelegate", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getUseLatestDelegate", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_rocketStorage", "type": "address" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "initialise", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bool", "name": "_setting", "type": "bool" }], "name": "setUseLatestDelegate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "stateMutability": "payable", "type": "receive" }
  ]


  const factoryABI = [
    { "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }], "name": "deployContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_nodeOperator", "type": "address" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }], "name": "getExpectedAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }
  ]

  const NetworkABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "block", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "rplPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "PricesSubmitted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "block", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "rplPrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "PricesUpdated", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_block", "type": "uint256" }, { "internalType": "uint256", "name": "_rplPrice", "type": "uint256" }], "name": "executeUpdatePrices", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getLatestReportableBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getPricesBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRPLPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_block", "type": "uint256" }, { "internalType": "uint256", "name": "_rplPrice", "type": "uint256" }], "name": "submitPrices", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]


  const ManagerABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minipool", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "BeginBondReduction", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minipool", "type": "address" }, { "indexed": true, "internalType": "address", "name": "member", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "CancelReductionVoted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minipool", "type": "address" }, { "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "MinipoolCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minipool", "type": "address" }, { "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "MinipoolDestroyed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "minipool", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "ReductionCancelled", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }], "name": "createMinipool", "outputs": [{ "internalType": "contract RocketMinipoolInterface", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_salt", "type": "uint256" }, { "internalType": "bytes", "name": "_validatorPubkey", "type": "bytes" }, { "internalType": "uint256", "name": "_bondAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_currentBalance", "type": "uint256" }], "name": "createVacantMinipool", "outputs": [{ "internalType": "contract RocketMinipoolInterface", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "decrementNodeStakingMinipoolCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "destroyMinipool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getActiveMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getFinalisedMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getMinipoolAt", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "_pubkey", "type": "bytes" }], "name": "getMinipoolByPubkey", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getMinipoolCountPerStatus", "outputs": [{ "internalType": "uint256", "name": "initialisedCount", "type": "uint256" }, { "internalType": "uint256", "name": "prelaunchCount", "type": "uint256" }, { "internalType": "uint256", "name": "stakingCount", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawableCount", "type": "uint256" }, { "internalType": "uint256", "name": "dissolvedCount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolDepositType", "outputs": [{ "internalType": "enum MinipoolDeposit", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolDestroyed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolPubkey", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolRPLSlashed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_minipoolAddress", "type": "address" }], "name": "getMinipoolWithdrawalCredentials", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeActiveMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeFinalisedMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getNodeMinipoolAt", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeStakingMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_depositSize", "type": "uint256" }], "name": "getNodeStakingMinipoolCountBySize", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getNodeValidatingMinipoolAt", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeValidatingMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getPrelaunchMinipools", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStakingMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getVacantMinipoolAt", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getVacantMinipoolCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "incrementNodeFinalisedMinipoolCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "incrementNodeStakingMinipoolCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "removeVacantMinipool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "_pubkey", "type": "bytes" }], "name": "setMinipoolPubkey", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_previousBond", "type": "uint256" }, { "internalType": "uint256", "name": "_newBond", "type": "uint256" }, { "internalType": "uint256", "name": "_previousFee", "type": "uint256" }, { "internalType": "uint256", "name": "_newFee", "type": "uint256" }], "name": "updateNodeStakingMinipoolCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]



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



            <div className='flex w-full mt-10 lg:mt-0 flex-col items-center justify-center'>





              <div className="flex items-center justify-center flex-col w-full pb-10 mb-10">

                <div className="mt-8 sm:mt-12 sm:w-2/5   w-3/5">
                  <dl className="grid lg:grid-cols-1 gap-10 md:grid-cols-1 sm:grid-cols-1">


                    <div className="flex flex-col w-auto h-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center items-center justify-center">
                      <h2 className="text-2xl w-[90%] font-bold text-gray-900 sm:text-2xl">Stake RPL for your Minipool Deposits </h2>

                      <p className="my-4 w-[80%] text-gray-500 sm:text-l">
                        You have 
                        <span className='text-yellow-500 font-bold'> <RollingNumber n={Number(formatEther(RPL))} /> </span>
                         unstaked RPL in your Wallet and 
                         <span className='text-green-500 font-bold'> <RollingNumber n={Number(formatEther(stakeRPL))} /> </span> 
                         staked RPL. 
                         You have 
                         <span className='text-green-500 font-bold' style={newMinipools >= 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> <RollingNumber n={Number(displayActiveMinipools)} /> </span> 
                           one active Minipool and are able to create <span className={`text-green-500 font-bold`} style={newMinipools < 1 ? { color: "rgb(34 197 94)" } : { color: "red" }}> <RollingNumber n={Math.floor(Number(formatEther(newMinipools)))} /></span> new LEB8s (Minipools)

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
                    </div>




                    <div className="flex flex-col w-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center items-center justify-center">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Add Validator</h2>

                      <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                        Create your custom &quot;graffiti&quot;, and we will do the rest!
                      </p>


                      <input value={grafittiInput} placeholder='Grafitti' className=" border border-black-200 " type="text" onChange={handleGrafittiInput} />


                      <div className='w-3/5 flex gap-2 items-center justify-center'>
                        <button onClick={handleAddValidator} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                          Add
                        </button>
                      </div>
                    </div>









                    {/* <div className="flex flex-col w-auto gap-2 rounded-lg border border-black-100 px-4 py-[5vh] text-center items-center justify-center">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Make Minipool Deposit</h2>

                      <p className="mt-4 text-gray-500 sm:text-l">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolore.
                      </p>


                      <input value={minipoolDepositInput} placeholder='RPL Value' className=" border border-black-200 " type="text" onChange={handleMinipoolInputChange} />

                      <div className='w-3/5 flex gap-2 items-center justify-center'>
                        <button onClick={handleMiniPoolDeposit} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                          Go!
                        </button>


                      </div>
                    </div> */}








                  </dl>
                </div>


              </div>

            </div>) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
          }</>






      ) : (<NoConnection />)}



      {/*<button onClick={connect}>Connect Wallet</button>
      <button onClick={getFoundry}>CONNECT FOUNDRY</button>
    <button onClick={handleFakestETH}>Fund Test Account</button>*/}


    </div>
  )
}

export default CreateValidator