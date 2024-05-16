import React, { useEffect, useState } from 'react'
import timezones from "./timezones.json"
import Image from 'next/image';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';




const NoRegistration = ({ onRegistrationResult }: any) => {

  const [currentChain, setCurrentChain] = useState(useChainId());

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"


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



  useEffect(() => {

    console.log(currentChain)

  }, [currentChain])



  const [selectedTimezone, setSelectedTimezone] = useState('');

  // Function to handle the change event of the select element
  const handleTimezoneChange = (event: any) => {
    setSelectedTimezone(event.target.value);
    // You can perform any other actions with the selected timezone value here
    console.log('Selected timezone:', event.target.value);
  };


  const handleRocketRegistration = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {




        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()

        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);

        const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))



        const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)
        console.log("Rocket Node Manager:" + rocketNodeManager)
        const tx = await rocketNodeManager.registerNode(selectedTimezone)
        console.log(tx);

        // Listen for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // Check if transaction was successful
        if (receipt.status === 1) {
          // Transaction successful, update state
          onRegistrationResult({ result: "success" });
        } else {
          // Transaction failed, update state with error
          onRegistrationResult({ error: "Transaction failed" });
        }
      } catch (err) {
        console.log(err)
        // Update state with error
        onRegistrationResult({ error: err });
      }
    }
  }


  function alphabetizeArray(arr: Array<string>) {
    return arr.sort();
  }


  const alphaArray = alphabetizeArray(timezones)






  return (
    <div className='w-full min-h-[92vh] h-auto flex flex-col items-center justify-center '>



      <div className="flex flex-col w-auto gap-2  rounded-lg border border-gray-100 px-4 py-4 text-center items-center justify-center shadow-xl">



        <Image
          width={200}
          height={200}
          alt="Rocket Pool Logo"
          src={"/images/rocketlogo.webp"} />
        <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Not Registered with Rocket Pool?</h2>

        <p className="mt-4 text-gray-500 sm:text-l">
          You must be registered with Rocket Pool to use the Vrün platform.
        </p>


        <div className="inline-block relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleTimezoneChange} // Attach the function to the onChange event
            value={selectedTimezone} // Set the value of the select element to the selectedTimezone state
          >
            <option value="">Select a timezone</option>
            {alphaArray.map((timezone, index) => (
              <option key={index} value={timezone}>{timezone}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9 11a1 1 0 0 1-.7-.3l-4-4a1 1 0 1 1 1.4-1.4L9 8.6l6.3-6.3a1 1 0 1 1 1.4 1.4l-7 7a1 1 0 0 1-.7.3z" /></svg>
          </div>
        </div>



        <div className='w-3/5 flex gap-2 pt-5 items-center justify-center'>
          <button onClick={handleRocketRegistration} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
            Register with Rocket Pool
          </button>
        </div>
      </div>



    </div>
  )
}

export default NoRegistration