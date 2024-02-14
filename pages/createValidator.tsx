import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from './components/navbar';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { NoConnection } from './components/noConnection';
import { ethers } from 'ethers';
import NoRegistration from './components/noRegistration';
import { mainnet } from 'viem/chains';
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther, TransactionReceipt } from 'viem';


//https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4

const CreateValidator: NextPage = () => {


  const [isRegistered, setIsRegistered] = useState(true)
  const [foundryAccount, setFoundryAccount] = useState("");
  const [account, setAccount] = useState("")
  const [wallet, setWallet] = useState({});
  const [stakeRPL, setStakeRPL] = useState(BigInt(0));
  const [RPLinput, setRPLinput] = useState("")

  const[RPLApproved, setRPLApproved] = useState(false)



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


  const handleFakestETH = async () => {



    await client.sendTransaction({
      account: foundryAccount,
      to: address,
      value: parseEther('2')
    })
  }






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
        const storageContract = new ethers.Contract("rocketstorage.eth", storageABI, signer);
        console.log("Storage Contract:" + storageContract)

        const rocketNodeManager = await new ethers.Contract("0x89F478E6Cc24f052103628f36598D4C14Da3D287", managerABI, signer)
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
          const reg = await registrationCheck(address);
          setIsRegistered(reg);
        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during registration check:", error);
        }
      }
    }


  })



  useEffect(() => {

    fetchData();

  }, [address])



  useEffect(() => {

    if (isRegistered && address !== undefined) {
      handleCheckRPL(address)
    }

  }, [address])


  useEffect(() => {

  }, [])






  const handleCheckRPL = async (add: string) => {


    if (typeof (window as any).ethereum !== "undefined") {

      console.log("Reg Spot 1")

      try {

        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()


        const rocketNodeStaking = await new ethers.Contract("0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec", stakingABI, signer)

        const amount = await rocketNodeStaking.getNodeRPLStake(add)


        console.log(typeof amount)


        setStakeRPL(amount);

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



  const approveRPL = async () => {

    if (typeof (window as any).ethereum !== "undefined") {



      try {

        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()

        const rocketNodeStaking = await new ethers.Contract("0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec", stakingABI, signer)

        const tx = await rocketNodeStaking.setStakeRPLForAllowed(address, true);

        const result =  await tx.wait();


        if (result.status === 1) {
          // Transaction successful, update state
        setRPLApproved(true);

        } else {

          setRPLApproved(false)


        }




      } catch (err) {

        console.log(err)

      }


    }
  }


  const handleStakeRPL = async () => {
    if (typeof (window as any).ethereum !== undefined) {
      try {
        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
  
        const rocketNodeStaking = new ethers.Contract(
          "0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec", // Replace with your staking contract address
          stakingABI, // Replace with your staking contract ABI
          signer
        );
  
        // Get the ERC20 token contract address and RPL input value from your UI or elsewhere
        const tokenAddress = "0xD33526068D116cE69F19A9ee46F0bd304F21A51f"; // Replace with your ERC20 token address
        const tokenABI = [{"inputs":[{"internalType":"contract RocketStorageInterface","name":"_rocketStorageAddress","type":"address"},{"internalType":"contract IERC20","name":"_rocketTokenRPLFixedSupplyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"RPLFixedSupplyBurn","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"inflationCalcTime","type":"uint256"}],"name":"RPLInflationLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getInflationCalcTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationIntervalRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationIntervalStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationIntervalTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getInflationIntervalsPassed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationRewardsContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"inflationCalculate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"inflationMintTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"swapTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSwappedRPL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]
        
        // Get the signer's address
        const address = await signer.getAddress();
  
        // Load the ERC20 token contract
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  
        // Parse RPL input to Ether
        const val = parseEther(RPLinput);
  
        // Approve the staking contract to spend RPL tokens on behalf of the signer
        const approvalTx = await tokenContract.approve("0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec", val);
        console.log("Approval transaction:", approvalTx.hash);
  
        // Wait for the approval transaction to be mined
        await approvalTx.wait();
  
        // Stake RPL tokens
        const tx = await  tokenContract.transfer("0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec", val);
        console.log("Stake transaction:", tx.hash);
  
        // Wait for the stake transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
  
        // Check if transaction was successful
        if (receipt.status === 1) {
          // Transaction successful, update state
          if (address !== undefined) {
            handleCheckRPL(address);
          }
        } else {
          // Handle failed transaction
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Metamask not available");
    }
  };

  const handleRPLInputChange = (e: any) => {

    setRPLinput(e.target.value)

  }






  const storageABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "oldGuardian", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newGuardian", "type": "address" }], "name": "GuardianChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": true, "internalType": "address", "name": "withdrawalAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "NodeWithdrawalAddressSet", "type": "event" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "addUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "confirmGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "confirmWithdrawalAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBytes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteBytes32", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteInt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteString", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "deleteUint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getAddress", "outputs": [{ "internalType": "address", "name": "r", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBool", "outputs": [{ "internalType": "bool", "name": "r", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBytes", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getBytes32", "outputs": [{ "internalType": "bytes32", "name": "r", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getDeployedStatus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getGuardian", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getInt", "outputs": [{ "internalType": "int256", "name": "r", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodePendingWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getString", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }], "name": "getUint", "outputs": [{ "internalType": "uint256", "name": "r", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "address", "name": "_value", "type": "address" }], "name": "setAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bool", "name": "_value", "type": "bool" }], "name": "setBool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bytes", "name": "_value", "type": "bytes" }], "name": "setBytes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_key", "type": "bytes32" }, { "internalType": "bytes32", "name": "_value", "type": "bytes32" }], "name": "setBytes32", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "setDeployedStatus", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newAddress", "type": "address" }], "name": "setGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, {
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
    { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodePendingWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRegistrationTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeTimezoneLocation", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeWithdrawalAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getRewardNetwork", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_offset", "type": "uint256" }, { "internalType": "uint256", "name": "_limit", "type": "uint256" }], "name": "getSmoothingPoolRegisteredNodeCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getSmoothingPoolRegistrationChanged", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getSmoothingPoolRegistrationState", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialiseFeeDistributor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_timezoneLocation", "type": "string" }], "name": "registerNode", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_network", "type": "uint256" }], "name": "setRewardNetwork", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_state", "type": "bool" }], "name": "setSmoothingPoolRegistrationState", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_timezoneLocation", "type": "string" }], "name": "setTimezoneLocation", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }]

  const stakingABI = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethValue", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLSlashed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLStaked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "RPLWithdrawn", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "node", "type": "address" }, { "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "allowed", "type": "bool" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "StakeRPLForAllowed", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHCollateralisationRatio", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHMatched", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHMatchedLimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeETHProvided", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeEffectiveRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeMaximumRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeMinimumRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }], "name": "getNodeRPLStakedTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalRPLStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_caller", "type": "address" }, { "internalType": "bool", "name": "_allowed", "type": "bool" }], "name": "setStakeRPLForAllowed", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_ethSlashAmount", "type": "uint256" }], "name": "slashRPL", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeRPL", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeRPLFor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawRPL", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]








  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <Navbar />



      {address !== undefined ? (<>{isRegistered ? (



        <div className='flex w-full flex-col items-center justify-center'>
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 py-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Connected User: </h2>

              <p className="mt-4 text-gray-500 sm:text-xl">
                {address}
              </p>
            </div>
          </div>




          <div className="flex items-center justify-center flex-col w-full pb-10">

            <div className="mt-8 sm:mt-12 sm:w-2/5   w-3/5">
              <dl className="grid lg:grid-cols-2 gap-10 md:grid-cols-1 sm:grid-cols-1">


                <div className="flex flex-col w-auto gap-2 rounded-lg border border-gray-100 px-4 py-4 text-center items-center justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Stake RPL for your Minipool Deposits </h2>

                  <p className="mt-4 text-gray-500 sm:text-l">
                    You have <span> {Number(stakeRPL)}</span> ETH in your Wallet, you can make <span> {Math.floor(Number(stakeRPL) / 2.4)}</span> LEB8s (Minipools)

                  </p>
                  <input value={RPLinput} type="text" onChange={handleRPLInputChange} />

                  <div className='w-3/5 flex gap-2 items-center justify-center'>


                  {RPLApproved &&    (<button onClick={handleStakeRPL} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Stake RPL
                    </button>)}


                    {!RPLApproved &&    (<button onClick={approveRPL} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Approve RPL
                    </button>)}
                  


                  </div>
                </div>


                <div className="flex flex-col w-auto gap-2 rounded-lg border border-gray-100 px-4 py-4 text-center items-center justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Do you have validator keys?</h2>



                  <div className='w-3/5 flex gap-2 items-center justify-center'>
                    <button className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Yes
                    </button>
                    <button className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      No, Generate Keys
                    </button>

                  </div>
                </div>


                <div className="flex flex-col w-auto gap-2 rounded-lg border border-gray-100 px-4 py-4 text-center items-center justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Generate Validator Keys</h2>

                  <p className="mt-4 text-gray-500 sm:text-l">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolore.
                  </p>

                  <div className='w-3/5 flex gap-2 items-center justify-center'>
                    <button className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Generate
                    </button>


                  </div>
                </div>


                <div className="flex flex-col w-auto gap-2 rounded-lg border border-gray-100 px-4 py-4 text-center items-center justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Make rETH Deposit</h2>

                  <p className="mt-4 text-gray-500 sm:text-l">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolore.
                  </p>

                  <div className='w-3/5 flex gap-2 items-center justify-center'>
                    <button className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                      Go!
                    </button>


                  </div>
                </div>








              </dl>
            </div>


          </div>

        </div>) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
      }</>






      ) : (<NoConnection />)}



      <button onClick={connect}>Connect Wallet</button>
      <button onClick={getFoundry}>CONNECT FOUNDRY</button>
      <button onClick={handleFakestETH}>Fund Test Account</button>



    </div>
  )
}

export default CreateValidator