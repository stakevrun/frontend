import React, { use, useEffect, useState, useRef } from 'react'
import { PieChart, LineChart } from '@mui/x-charts'
import { BarChart } from '@mui/x-charts/BarChart';
import { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import storageABI from "../json/storageABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import managerABI from "../json/managerABI.json"
import daoABI from "../json/daoABI.json"
import distributorABI from "../json/distributorABI.json"
import CountdownComponent from './countdown.jsx';
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import * as openpgp from 'openpgp';
import { AiOutlineClose } from 'react-icons/ai'
import NoRegistration from './noRegistration';
import NoConnection from './noConnection';
import Link
  from 'next/link';
import { useRouter } from 'next/router';
import RPLBlock from './RPL';
import ContractTag from "../components/contractTag"
import feeABI from "../json/feeABI.json"
import { GrSatellite } from "react-icons/gr";
import { FaEthereum } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import BounceLoader from "react-spinners/BounceLoader";
import Image from 'next/image';

import RollingNumber from './rollingNumber';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import type { RootState } from '../GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from "../globalredux/Features/counter/counterSlice"
import { getData } from "../globalredux/Features/validator/valDataSlice"
import { attestationsData } from '../globalredux/Features/attestations/attestationsDataSlice';
import { getGraphPointsData } from "../globalredux/Features/graphpoints/graphPointsDataSlice"






import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js"


ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend

);






if (process.browser) {
  Modal.setAppElement(document.body);
}

const AccountMain: NextPage = () => {







  const [data, setData] = useState("");
  const [publicKeyArmored, setPublicKeyArmored] = useState(``);

  const beaconAPIKey = process.env.BEACON
  const holeskyRPCKey = process.env.HOLESKY_RPC
  const mainnetRPCKey = process.env.MAINNET_RPC



  useEffect(() => {

    console.log(publicKeyArmored)

  }, [publicKeyArmored])


  const encryptData = async (jsonData: string) => {
    try {
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      const encrypted: string = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: jsonData }), // input as Message object
        encryptionKeys: publicKey,
      });
      return encrypted;
    } catch (error) {
      console.error('Error encrypting data:', error);
    }
  };



  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()



  const reduxData = useSelector((state: RootState) => state.valData.data);
  const reduxGraphPoints = useSelector((state: RootState) => state.graphPointsData.data);
  const reduxAttestations = useSelector((state: RootState) => state.attestationsData.data)















  const downloadEncryptedJSON = async (data: string | undefined) => {
    if (!data) return;

    let encryptedData: string | undefined = data;
    if (checked && encryptedData !== undefined) {
      encryptedData = await encryptData(data);
      if (encryptedData === undefined) {
        // Encryption failed, handle the error
        return;
      }
    }


    const blob = new Blob([encryptedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted_data.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);



  };







  const getBeaconchainStatus = async (pubkey: string) => {


    let newString;

    const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`


    await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
      method: "GET",
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data



        newString = jsonString.data.status
      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });





    return newString


  }






  const getMinipoolTruth = async (pubkey: string) => {






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


      return bool;

    } catch (error) {

      console.log(error)

      return false;

    }






  }






  const getValBeaconBalance = async (pubkey: string) => {


    let newString

    const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`


    await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validator_balances?id=${pubkey}`, {
      method: "GET",
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data



        newString = jsonString.data[0].balance

        console.log("Val Balance:" + newString)
      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });

    if (typeof newString === "string") {
      return BigInt(newString)


    }


  }






  const [exitMessage, setExitMessage] = useState("")
  const [showForm4, setShowForm4] = useState(false);

  const handleChangeExitMessage = (e: any) => {
    setExitMessage(e.target.value)
  }



  const handlePostExitModal = () => {
    setShowForm4(true);
  }


  const postPresignedExitMessage = async () => {




    //   /eth/v1/beacon/pool/voluntary_exits


    //https://holesky.beaconcha.in//eth/v1/beacon/pool/voluntary_exits

    const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`



    await fetch(`'${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },
      body: exitMessage
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data

        console.log("POST exit message response" + jsonString)
      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });


  }







  const getPresignedExitMessage = async (pubkey: string, index: number) => {


    /*struct GetPresignedExit {
    bytes pubkey;
    uint256 validatorIndex;
    uint256 epoch;
  }*/

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()

    //https://beaconcha.in/api/v1/slot/1?apikey=<your_key>


    const genesisTime = 1695902400 * 1000;


    let epoch;



    if (dateTime === "") {
      const theTime = Date.now()

      epoch = Math.ceil((theTime - genesisTime) / 12 / 32 / 1000)

    } else {

      const dateTimeObject = new Date(dateTime);

      // Convert the JavaScript Date object to a Unix timestamp (in milliseconds)
      const timestampValue = dateTimeObject.getTime();

      epoch = Math.ceil((timestampValue - genesisTime) / 12 / 32 / 1000);

    }

    console.log("EPOCH:" + epoch)


    const chainString = currentChain === 17000 ? 'holesky.' : ''






    const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()



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
















    const types = {
      GetPresignedExit: [
        { name: 'pubkey', type: 'bytes' },
        { name: 'validatorIndex', type: 'uint256' },
        { name: 'epoch', type: 'uint256' }
      ]
    }

    console.log(valIndex)

    const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
    const APItype = "GetPresignedExit"







    const value = { pubkey: pubkey, validatorIndex: valIndex, epoch: epoch }


    let signature = await signer.signTypedData(EIP712Domain, types, value);






    const data: string = await fetch(`https://db.vrün.com/${currentChain}/${address}/${index}`, {
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

        var text = await response.text()// Note: response will be opaque, won't contain data




        return text;




      })
      .catch(error => {
        // Handle error here
        console.log(error);
        return ""
      });





    if (typeof data !== "undefined") {
      downloadEncryptedJSON(data);
    }




  }






  const startCountdown = (timeString: string): any => {
    // Parse time string into milliseconds
    const parts = timeString.split(' ');
    const hours = parseInt(parts[0]) * 3600000; // Convert hours to milliseconds
    const minutes = parseInt(parts[2]) * 60000; // Convert minutes to milliseconds
    const seconds = parseInt(parts[4]) * 1000; // Convert seconds to milliseconds
    const totalTime = hours + minutes + seconds;

    // Update countdown every second
    const countdown = setInterval(function () {
      // Calculate remaining time
      const now = new Date().getTime();
      const remainingTime = totalTime - now;

      // If remaining time is less than or equal to 0, stop countdown
      if (remainingTime <= 0) {
        clearInterval(countdown);
        console.log("Countdown finished!");
        return;
      }

      // Convert remaining time to hours, minutes, and seconds
      const hoursLeft = Math.floor(remainingTime / 3600000);
      const minutesLeft = Math.floor((remainingTime % 3600000) / 60000);
      const secondsLeft = Math.floor((remainingTime % 60000) / 1000);

      // Format remaining time
      const formattedTime: any = (<div>${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds</div>);




    }, 1000);



  }











  const currentChain = useChainId();

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"



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

  const stakeMinipool = async (index: number) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);



    const pubkey = await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${index}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of Logs GET" + jsonString)



        return jsonString;


      })
      .catch(error => {

        console.log(error);
      });









    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], signer)


    const canStakeResult = await minipool.canStake()

    console.log(canStakeResult);


    const types = {
      GetDepositData: [
        { name: 'pubkey', type: 'bytes' },
        { name: 'withdrawalCredentials', type: 'bytes32' },
        { name: 'amountGwei', type: 'uint256' }
      ]
    }


    //ACCOUNT UI BRANCH


    const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
    const APItype = "GetDepositData"

    console.log("Minipool Address:" + minipoolAddress);

    let newAddress = ethers.concat(['0x01', ethers.zeroPadValue(minipoolAddress, 31)])

    const value = { pubkey: pubkey, withdrawalCredentials: newAddress, amountGwei: (ethers.parseEther('31') / ethers.parseUnits('1', 'gwei')).toString() }


    let signature = await signer.signTypedData(EIP712Domain, types, value);

    let depositSignature;
    let depositDataRoot;




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

        let newJSON = Object.entries(jsonString);

        console.log(newJSON);

        depositDataRoot = newJSON[0][1]
        depositSignature = newJSON[1][1]


      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });

    if (canStakeResult) {




      await minipool.stake(depositSignature, depositDataRoot);


    } else {
      const statusResult = await minipool.getStatus();
      const statusTimeResult = await minipool.getStatusTime();
      const numStatusTime = Number(statusTimeResult) * 1000;

      console.log("Status Result:" + statusResult)

      console.log("Status Time Result:" + statusTimeResult)

      console.log(Date.now());
      console.log(numStatusTime);







      const DAOAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketDAONodeTrustedSettingsMinipool"))

      const DAOContract = new ethers.Contract(DAOAddress, daoABI, signer);

      const scrubPeriod: any = await DAOContract.getScrubPeriod();

      const numScrub = Number(scrubPeriod) * 1000;
      console.log(numScrub);

      const timeRemaining: any = numScrub - (Date.now() - numStatusTime)


      const string = formatTime(timeRemaining);

      console.log("Time Remaining:" + string);


      await minipool.stake(depositSignature, depositDataRoot);




    }

  }



  const distributeBalanceOfMinipool = async (pubkey: string) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function distributeBalance(bool)'], signer)
    await minipool.distributeBalance(false)




  }








  const closeMinipool = async (index: number) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);



    const pubkey = await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${index}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of Logs GET" + jsonString)



        return jsonString;


      })
      .catch(error => {

        console.log(error);
      });



    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function close()'], signer)
    await minipool.close()




  }



  const dissolveMinipool = async (index: number) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);



    const pubkey = await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${index}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of Logs GET" + jsonString)



        return jsonString;


      })
      .catch(error => {

        console.log(error);
      });



    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function dissolve()'], signer)
    await minipool.dissolve()




  }













  const { address } = useAccount({
    onConnect: async ({ address }) => {
      console.log("Ethereum Wallet Connected!")

      if (address !== undefined) {
        try {

          const reg = await registrationCheck(address);
          setIsRegistered(reg);

          if (reg === true) {
            getMinipoolData();
            getPayments();
          }

        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during registration check:", error);
        }
      }

    }
  })


  useEffect(() => {



    fetchData();


  }, [currentChain, address])



  const [registrationResult, setRegistrationResult] = useState({ result: "" });
  const [isRegistered, setIsRegistered] = useState(true)

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






  const nullAddress = "0x0000000000000000000000000000000000000000";


  const [totalValidators, setTotalValidators] = useState("");
  const [runningValidators, setRunningValidators] = useState("");


  const getValIndex = async (pubkey: string) => {

    const chainString = currentChain === 17000 ? 'holesky.' : ''


    const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()



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

    return valIndex
  }


  const getEnabled = async (pubkey: string) => {





    const enabled = await fetch(`https://db.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetEnabled&start=-1`, {
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







  const getMinipoolData = async () => {


    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner();
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));
    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


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

    let attachedPubkeyArray: Array<Array<string>> = [];


    for (let i = 0; i <= newNextIndex - 1; i++) {



      await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async response => {

          let pubkey = await response.json()




          const chainString = currentChain === 17000 ? 'holesky.' : ''




          await fetch(`https://${chainString}beaconcha.in/api/v1/rocketpool/validator/${pubkey}?apikey=${beaconAPIKey}`, {
            method: "GET",

            headers: {
              "Content-Type": "application/json"
            },
          })
            .then(async response => {

              var jsonObject = await response.json()


              let minipoolAddress = jsonObject.data.minipool_address;








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





        })
        .catch(error => {


        });



    }












    const emptyValidatorData: beaconLog = {
      attester_slashings: BigInt(0),
      day: 0,
      day_end: "",
      day_start: "",
      deposits: BigInt(0),
      deposits_amount: BigInt(0),
      end_balance: BigInt(0),
      end_effective_balance: BigInt(0),
      max_balance: BigInt(0),
      max_effective_balance: BigInt(0),
      min_balance: BigInt(0),
      min_effective_balance: BigInt(0),
      missed_attestations: 0,
      missed_blocks: 0,
      missed_sync: 0,
      orphaned_attestations: 0,
      orphaned_blocks: 0,
      orphaned_sync: 0,
      participated_sync: 0,
      proposed_blocks: 0,
      proposer_slashings: BigInt(0),
      start_balance: BigInt(0),
      start_effective_balance: BigInt(0),
      validatorindex: 0,
      withdrawals: BigInt(0),
      withdrawals_amount: BigInt(0)
    };



    let minipoolObjects: Array<rowObject> = [];
    let seperateMinipoolObjects: Array<rowObject2> = [];

    let newRunningVals = 0;
    let newTotalVals = 0;


    for (const [minAddress, pubkey] of attachedPubkeyArray) {





      if (minAddress === "Null minipool") {



        minipoolObjects.push({

          address: "",
          statusResult: "Empty",
          statusTimeResult: "",
          timeRemaining: "",
          graffiti: "",
          beaconStatus: "",

          beaconLogs: [emptyValidatorData],
          valBalance: "",
          valProposals: "",
          valDayVariance: "",
          pubkey: pubkey,

        });


        seperateMinipoolObjects.push({
          address: "",
          statusResult: "Empty",
          statusTimeResult: "",
          timeRemaining: "",
          graffiti: "",
          beaconStatus: "",


          valBalance: "",
          valProposals: "",
          valDayVariance: "",
          pubkey: pubkey,
          isEnabled: false,
          valIndex: "",

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


        const currentStatus = MinipoolStatus[statusResult];

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
        const beaconStatus = await getBeaconchainStatus(pubkey)
        const isEnabled = await getEnabled(pubkey)
        const valIndex = await getValIndex(pubkey)

        const smoothingBool = await getMinipoolTruth(pubkey)

        if (typeof smoothingBool === "boolean") {
          setChecked2(smoothingBool);


        }


        const beaconObject = await getValBeaconStats(pubkey)

        console.log(typeof beaconObject === "object" ? Object.entries(beaconObject) : "");



        console.log(printGraff)

        const newValBalance = beaconObject[0].end_balance

        let newValProposals = 0;

        for (const beaconLog of beaconObject) {

          let blocks = beaconLog.proposed_blocks

          newValProposals += blocks
        }

        const newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance



        minipoolObjects.push({
          address: minAddress,
          statusResult: currentStatus,
          statusTimeResult: statusTimeResult.toString(),
          timeRemaining: timeRemaining.toString(),
          graffiti: typeof printGraff === "string" ? printGraff : "",
          beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",

          beaconLogs: typeof beaconObject === "object" ? beaconObject : [emptyValidatorData],
          valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
          valProposals: newValProposals.toString(),
          valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),

          pubkey: pubkey
        })


        seperateMinipoolObjects.push({
          address: minAddress,
          statusResult: currentStatus,
          statusTimeResult: statusTimeResult.toString(),
          timeRemaining: timeRemaining.toString(),
          graffiti: typeof printGraff === "string" ? printGraff : "",
          beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",


          valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
          valProposals: newValProposals.toString(),
          valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),
          isEnabled: isEnabled,
          valIndex: valIndex,
          pubkey: pubkey
        })





      }



    }


    setRunningValidators(newRunningVals.toString());
    setTotalValidators(newTotalVals.toString());
    setCurrentRowData(minipoolObjects)
    dispatch(getData(seperateMinipoolObjects))
    setShowForm(false)


  }




  useEffect(() => {

    if (reduxData.length > 0) {
      let newRunningVals = 0;
      let newTotalVals = 0;


      for (const log of reduxData) {


        console.log(reduxData)
        console.log("Redux loop running")









        if (log.statusResult === "Staking") {

          newRunningVals += 1;
          newTotalVals += 1;

        } else {

          newTotalVals += 1;

        }









      }

      setRunningValidators(newRunningVals.toString());
      setTotalValidators(newTotalVals.toString());

    }




  }, [reduxData])




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







  const setGraffiti = async (index: number, pubkey: string, newGrafitti: string) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()


    /*  struct SetFeeRecipient {
  uint256 timestamp;
  bytes pubkey;
  address feeRecipient;
} */


    const types = {
      SetGraffiti: [
        { name: 'timestamp', type: 'uint256' },
        { name: 'pubkey', type: 'bytes' },
        { name: 'graffiti', type: 'string' }
      ]
    }


    const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
    const APItype = "SetGraffiti"

    const date = Math.floor(Date.now() / 1000);

    const value = { timestamp: date, pubkey: pubkey, graffiti: newGrafitti }


    let signature = await signer.signTypedData(EIP712Domain, types, value);




    await fetch(`https://db.vrün.com/${currentChain}/${address}/${index}`, {
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


    getMinipoolData();



  }







  function truncateString(str: string) {
    if (str.length <= 15) {
      return str;
    } else {
      return str.slice(0, 15) + "...";
    }
  }











  const [currentRowData, setCurrentRowData] = useState<Array<rowObject>>([])







  function calculateAveragePlotPoints(newPlotPointsArray: Array<Array<number>>) {
    const averagePlotPoints = [];

    // Check if newPlotPointsArray is not empty
    if (newPlotPointsArray.length > 0) {
      const numArrays = newPlotPointsArray.length;
      const arrayLength = newPlotPointsArray[0].length; // Assuming all inner arrays have the same length

      // Iterate over each index of the inner arrays
      for (let i = 0; i < arrayLength; i++) {
        let sum = 0;

        // Calculate the sum of values at the current index across all inner arrays
        for (let j = 0; j < numArrays; j++) {
          sum += newPlotPointsArray[j][i];
        }

        // Calculate the average and push it to the averagePlotPoints array
        averagePlotPoints.push(sum / numArrays);
      }
    }

    return averagePlotPoints;
  }

  const [TotalGraphPlotPoints, setTotalGraphPlotPoints] = useState<Array<number>>([])
  const [xAxisData, setXAxisData] = useState<Array<number>>([]);
  const [graphState, setGraphState] = useState("Week");


  const attestationsPerDay = 225

  const [percentageAttestations, setPercentageAttestations] = useState(0)


  function calculateAverage(arrays: Array<Array<number>>) {
    let totalSum = 0;
    let totalCount = 0;

    // Iterate through each array
    for (let i = 0; i < arrays.length; i++) {
      // Iterate through each number in the array
      for (let j = 0; j < arrays[i].length; j++) {
        totalSum += arrays[i][j];
        totalCount++;
      }
    }

    // Calculate the average
    let average = totalSum / totalCount;
    return average;
  }




  const convertToGraphPlotPoints = async () => {


    let newPlotPointsArray: Array<Array<number>> = [];
    let newMissedAttestationsArray: Array<Array<number>> = [];

    for (const object of currentRowData) {

      let newPlotPoints: Array<number> = [];
      let newMissedAttestations: Array<number> = [];






      for (const log of object.beaconLogs) {


        if (object.statusResult === "Staking" && Number(log.start_balance) !== 0) {

          let variance = Math.abs(Number(log.end_effective_balance - log.end_balance))

          let editedVariance = Number(ethers.formatUnits(variance, "gwei"))

          newPlotPoints.push(editedVariance)


          let newMissed = 100 - (Math.floor((log.missed_attestations / attestationsPerDay) * 100))

          console.log("New Missed:" + newMissed);

          newMissedAttestations.push(newMissed)



        }



      }

      if (object.statusResult === "Staking") {

        newPlotPointsArray.push(newPlotPoints)
        newMissedAttestationsArray.push(newMissedAttestations)

      }


    }




    if (newPlotPointsArray.length > 0) {

      dispatch(getGraphPointsData(newPlotPointsArray))









    }

    if (newMissedAttestationsArray.length > 0) {



      dispatch(attestationsData(newMissedAttestationsArray))




    }


  }


  useEffect(() => {

    console.log(TotalGraphPlotPoints)

    const xAxisDataArray = Array.from({ length: TotalGraphPlotPoints.length }, (_, i) => i + 1);
    setXAxisData(xAxisDataArray);

  }, [TotalGraphPlotPoints])





  useEffect(() => {

    if (currentRowData.length >= 1) {
      convertToGraphPlotPoints();
    }

  }, [currentRowData])



  useEffect(() => {

    if(address !== undefined) {

      getMinipoolData();


    }
 

  }, [])


  useEffect(() => {


    getPayments();

  }, [])



  type beaconLog = {
    attester_slashings: bigint,
    day: number,
    day_end: string,
    day_start: string,
    deposits: bigint,
    deposits_amount: bigint,
    end_balance: bigint,
    end_effective_balance: bigint,
    max_balance: bigint,
    max_effective_balance: bigint,
    min_balance: bigint,
    min_effective_balance: bigint,
    missed_attestations: number,
    missed_blocks: number,
    missed_sync: number,
    orphaned_attestations: number,
    orphaned_blocks: number,
    orphaned_sync: number,
    participated_sync: number,
    proposed_blocks: number,
    proposer_slashings: bigint,
    start_balance: bigint,
    start_effective_balance: bigint,
    validatorindex: number,
    withdrawals: bigint,
    withdrawals_amount: bigint
  };


  type beaconLogs = Array<beaconLog>



  type rowObject = {
    address: string,
    statusResult: string,
    statusTimeResult: string,
    timeRemaining: string,
    pubkey: string
    beaconStatus: string
    beaconLogs: beaconLogs
    valBalance: string
    valProposals: string
    valDayVariance: string

    graffiti: string
  };




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

    graffiti: string
    isEnabled: boolean
    valIndex: string
  };



  useEffect(() => {

    setTotalGraphPlotPoints(calculateAveragePlotPoints(reduxGraphPoints));

  }, [reduxGraphPoints])

  useEffect(() => {

    setPercentageAttestations(calculateAverage(reduxAttestations))

  }, [reduxAttestations])





  const getValBeaconStats = async (pubkey: string) => {





    let newLogs: beaconLogs;


    const chainString = currentChain === 17000 ? 'holesky.' : ''


    const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()



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




  const [currentPayments, setCurrentPayments] = useState<number>(0)


  const getPayments = async () => {


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



    setCurrentPayments(Number(payments));







  }






  const getGraffiti = async (pubkey: string) => {





    const graffiti = await fetch(`https://db.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetGraffiti&start=-1`, {
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




  const [showForm, setShowForm] = useState(false)
  const [showForm2, setShowForm2] = useState(false)
  const [currentEditGraffiti, setCurrentEditGraffiti] = useState("")
  const [currentPubkey, setCurrentPubkey] = useState("")
  const [currentPubkeyIndex, setCurrentPubkeyIndex] = useState(0)



  const handleGraffitiChange = (e: any) => {


    setCurrentEditGraffiti(e.target.value);

  }



  const handlePublicKeyArmored = (e: any) => {


    setPublicKeyArmored(e.target.value);

  }



  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [errorBoxText2, setErrorBoxTest2] = useState("");





  const handleChecked = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked(checked)


  }


  const handleChecked2 = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked2(checked)


  }




  const handleGraffitiModal = (index: number, pubkey: string, graff: string) => {
    setShowForm(true);
    setCurrentPubkey(pubkey)
    setCurrentEditGraffiti(graff)
    setCurrentPubkeyIndex(index)
  }



  useEffect(() => {

    console.log(currentEditGraffiti)

  }, [currentEditGraffiti])


  const confirmGraffiti = () => {

    setGraffiti(currentPubkeyIndex, currentPubkey, currentEditGraffiti)
  }




  const confirmGetPresigned = () => {

    getPresignedExitMessage(currentPubkey, currentPubkeyIndex)
  }




  const handleGetPresignedModal = (index: number, pubkey: string) => {
    setShowForm2(true);
    setCurrentPubkey(pubkey)
    setCurrentPubkeyIndex(index)
  }

  const [showForm3, setShowForm3] = useState(false);


  const handlePaymentModal = () => {
    setShowForm3(true)
  }



  const [dateTime, setDateTime] = useState('');




  const [feeETHInput, setFeeETHInput] = useState("")


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
        setShowForm3(false);
        console.log("Transaction successful:", result);
      } else {
        console.error("Transaction failed:", receipt);
        // Handle the failure if needed

        alert(receipt)

        setShowForm3(false)
      }



    } catch (e) {
      alert(e)

      setShowForm3(false);
    }





  }









  const router = useRouter();

  const handleClick = (param1: string, param2: number) => {
    router.push(`/validatorDetail/${param1}/${param2}`);
  };


  const getGraphData = (graphState: string, xAxisData: Array<number>, TotalGraphPlotPoints: Array<number>) => {
    let sliceLength;
    switch (graphState) {
      case "Week":
        sliceLength = 7;
        break;
      case "Month":
        sliceLength = 30;
        break;
      case "Year":
        sliceLength = 365;
        break;
      default:
        sliceLength = xAxisData.length;
        break;
    }

    const slicedLabels = xAxisData.slice(0, sliceLength);
    const slicedData = TotalGraphPlotPoints.slice(0, sliceLength);




    return {
      labels: slicedLabels.reverse(),
      datasets: [
        {
          label: 'Daily Rewards Tracker',
          data: slicedData.reverse(),
          backgroundColor: "aqua",
          borderColor: "black",
          pointBorderColor: "aqua",
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const graphData = getGraphData(graphState, xAxisData, TotalGraphPlotPoints);


  const options = {

    scales: {
      y: {
        min: 0,
        max: 0.01
      }
    }

  }


  const charRef = useRef();

  const onClick = (event: any) => {

    console.log(charRef)

    if (typeof charRef.current !== "undefined") {
      console.log(getElementsAtEvent(charRef.current, event)[0].datasetIndex)
    }

  }


  const handleOptSmoothingPool2 = async () => {
    setFeeRecipient(false);
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


  useEffect(() => {


    if (errorBoxText2 !== "") {


      const handleText = () => {
        setErrorBoxTest2("")

      }


      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);




    }

  }, [errorBoxText2])








  return (
    <section className="flex w-full flex-col items-center justify-center ">

      {address !== undefined ? (
        <>
          {isRegistered ? (





            <>





              {reduxGraphPoints[0].length > 0 ? (<div className="w-full flex flex-col items-center gap-5 justify-center">



                <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                  <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Connected User: </h2>

                    <p className="mt-4 text-gray-500 sm:text-xl">
                      {address}
                    </p>
                  </div>
                </div>




                <div className="xl:flex xl:flex-row lg:flex-col w-[auto] items-center justify-center xl:gap-5 lg:gap-5">






                  <section className="grid md:grid-cols-2 xl:grid-cols-2 xl:grid-rows-2 gap-6">

                    <div className="flex w-auto items-center p-6 bg-white border shadow rounded-lg mb-5">
                      <div className="inline-flex flex-shrink-4 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <FaEthereum className="text-2xl text-blue-500" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold">{runningValidators} / {totalValidators}</span>
                        <span className="block text-gray-500">Fully-running Validators</span>
                      </div>
                    </div>
                    <div className="flex items-center  p-6 bg-white border shadow rounded-lg mb-5">

                      <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                        <FaCoins className="text-yellow-500 text-xl" />

                      </div>
                      <div className=" w-full max-w-3xl flex flex-col items-center justify-center gap-2 text-left">



                        <div className='mb-2'>
                          <span className="block text-2xl font-bold">{currentPayments}</span>
                          <span className="block text-gray-500">in Credit</span>
                        </div>


                        <button onClick={handlePaymentModal} className="bg-green-500 text-xs hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Top-up</button>




                      </div>

                    </div>
                    <div className="flex items-center p-6 bg-white shadow border rounded-lg">
                      <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-2xl font-bold">{percentageAttestations.toString().slice(0, 5)}%</span>
                        <span className="block text-gray-500">Sucessful Attestations</span>
                      </div>
                    </div>
                    <div className="flex w-auto items-center p-6 bg-white shadow border  rounded-lg">
                      <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <Image
                          width={70}
                          height={70}
                          alt="Rocket Pool Logo"
                          src={"/images/rocketPlogo.png"} />
                      </div>
                      <div className='flex flex-col items-center justify-start w-full'>

                        <div className='flex flex-col items-center gap-1 justify-center w-full'>

                          <span className="block text-xl font-bold">Smoothing Pool</span>

                          <label className="self-center">
                            <span className="text-gray-500 pr-2 "> Opt-in?</span>
                            <input
                              type="checkbox"
                              className="self-center"
                              checked={checked2}
                              onChange={handleChecked2}
                            />
                          </label>



                        </div>

                        <div className='w-3/5 flex gap-2 items-center justify-center'>
                          <button onClick={handleOptSmoothingPool} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md" >
                            Confirm Changes
                          </button>
                        </div>


                      </div>

                    </div>
                  </section>



                </div>


                <div className='w-full h-[30px] mt-4 flex gap-2 items-center justify-center'>
                  {errorBoxText2 !== "" &&
                    <p className="my-4 w-[80%] font-bold text-2xl text-center text-red-500 sm:text-l">{errorBoxText2}</p>
                  }
                </div>




                <div className="w-full my-5 mx-5 mb-1 overflow-hidden rounded-lg ">
                  <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">

                    <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
                      <h3 className="text-2xl font-bold text-gray-900 ">Active Validators</h3>
                      <Link href="/createValidator">




                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 50 50" xmlSpace="preserve">
                            <circle style={{ fill: '#43B05C' }} cx="25" cy="25" r="25" />
                            <line style={{ fill: 'none', stroke: '#FFFFFF', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10 }} x1="25" y1="13" x2="25" y2="38" />
                            <line style={{ fill: 'none', stroke: '#FFFFFF', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10 }} x1="37.5" y1="25" x2="12.5" y2="25" />
                          </svg>
                        </div>





                      </Link>

                    </div>

                  </div>
                </div>




                <div className="w-[] overflow-hidden shadow border rounded-lg mb-10 ">
                  <table className="w-full">
                    <tbody>

                      {reduxData.map((data, index) => (
                        <tr key={index} className="border-b-2 hover:bg-gray-100 cursor-pointer" style={data.statusResult === "Empty" ? { display: "none" } : { display: "block" }} onClick={() => handleClick(data.pubkey, index)}>

                          <td className="px-4 pl-10 py-3 text-xs w-[180px]">

                            {data.statusResult === "Prelaunch" &&
                              <span className="px-2 py-1 font-semibold text-lg leading-tight text-orange-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                            }


                            {data.statusResult === "Initialised" &&

                              <span className="px-2 py-1 font-semibold text-lg leading-tight text-orange-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                            }

                            {data.statusResult === "Staking" &&

                              <span className="px-2 py-1 font-semibold text-lg leading-tight text-green-700 bg-green-100 rounded-sm">{data.statusResult}</span>


                            }


                            {data.statusResult === "Withdrawable" &&

                              <span className="px-2 py-1 font-semibold text-lg leading-tight text-green-700 bg-green-100 rounded-sm">{data.statusResult}</span>


                            }


                            {data.statusResult === "Dissolved" &&

                              <span className="px-2 py-1 font-semibold text-lg leading-tight text-red-700 bg-red-100 rounded-sm">{data.statusResult}</span>


                            }


                            {data.statusResult === "Empty" &&

                              <span className="px-2 py-1 font-semibold  text-lg leading-tight text-greay-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                            }


                          </td>

                          <td className="px-4 py-3 w-[200px] ">
                            <span className='text-green-500 self-center font-bold text-lg ' >

                              {data.valBalance}
                            </span>
                          </td>

                          <td className="px-4 py-3 w-[200px]">
                            <div className="flex items-center text-lg">


                              <span className='text-green-500 font-bold' style={Number(data.valDayVariance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>
                                {Number(data.valDayVariance) > 0 ? (
                                  <div className='flex items-center justify-center'>
                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-green-600 bg-green-100 rounded-full mr-3">
                                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                      </svg>

                                    </div>
                                    <p> {data.valDayVariance}</p>

                                  </div>


                                ) : (
                                  <div className='flex items-center justify-center'>
                                    {data.valDayVariance !== "" && <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                      </svg>
                                    </div>}
                                    <p>{data.valDayVariance !== "" && data.valDayVariance}</p>
                                  </div>
                                )}

                              </span>


                            </div>
                          </td>

                          <td className="px-4 py-3 w-[180px]">
                            <div className="flex items-center flex-col gap-1 text-l ">
                              {data.beaconStatus !== "" && <>
                                <h3 className='text-center font-semibold text-lg'>Status on Beaconchain</h3>
                                <GrSatellite /></>}
                              {data.beaconStatus}
                            </div>
                          </td>

                          <td className="px-4 pr-10 py-3 w-[auto]">
                            <div className="flex items-center text-l  flex-col gap-1">
                              {data.valProposals !== "" &&

                                <h3 className='text-center font-semibold text-lg'>Blocks Proposed</h3>

                              }

                              <p>{data.valProposals}</p>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center  justify-center p-8 bg-white shadow border border-b-2 rounded-lg my-8">


                  {xAxisData.length > 0 && TotalGraphPlotPoints.length > 0 &&

                    <div className="w-[500px] h-[auto] py-3">


                      <Line

                        data={graphData}
                        options={options}
                        onClick={onClick}
                        ref={charRef}

                      >



                      </Line>

                      <div className='flex gap-2 items-center my-2 mt-5 justify-center'>

                        <button onClick={() => { setGraphState("All") }} style={graphState === "All" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 ">All</button>
                        <button onClick={() => { setGraphState("Year") }} style={graphState === "Year" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 ">Year</button>
                        <button onClick={() => { setGraphState("Month") }} style={graphState === "Month" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4  ">Month</button>
                        <button onClick={() => { setGraphState("Week") }} style={graphState === "Week" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 ">Week</button>



                      </div>
                    </div>

                  }



                </div>





                <div className="w-full py-8 my-8 flex flex-col justify-center items-center">
                <RPLBlock /> 
                </div>




                {/* <div className='w-auto p-8 border shadow rounded-lg'>

                  <span>{count}</span>

                  <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md"
                    onClick={() => dispatch(increment())

                    }
                  >Increment</button>
                  <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md"
                    onClick={() => dispatch(decrement())

                    }
                  >Decrement</button>
                  <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md"
                    onClick={() => dispatch(incrementByAmount(2))

                    }
                  >Increment By 2</button>

                </div> */}





                <Modal
                  isOpen={showForm}
                  onRequestClose={() => setShowForm(false)}
                  contentLabel="Delete User Modal"
                  className="modal"
                  ariaHideApp={false}
                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: "999999999999999999999999999999999999",
                    },
                    content: {
                      width: '50%',
                      height: '200px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
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
                  <div className="flex flex-col rounded-lg gap-2  px-4 py-8 text-center">
                    <AiOutlineClose onClick={() => {
                      setShowForm(false)
                    }} />
                    <h2>Graffiti Update</h2>


                    <input value={currentEditGraffiti} className=" border border-black-200 text-black-500" type="text" onChange={handleGraffitiChange} />

                    <div >
                      <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={confirmGraffiti}>Update</button>
                      <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                  </div>
                </Modal>
                <Modal
                  isOpen={showForm2}
                  onRequestClose={() => setShowForm2(false)}
                  contentLabel="Delete User Modal"
                  className="modal"

                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: "999999999999999999999999999999999999",
                    },
                    content: {
                      width: '50%',
                      height: '700px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
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
                  <div className="flex flex-col rounded-lg gap-2  px-4 py-8 text-center">
                    <AiOutlineClose onClick={() => {
                      setShowForm2(false)
                    }} />
                    <h2>Get Presigned Exit Message</h2>

                    <input

                      className="w-[60%] self-center border border-black-200 text-black-500"
                      type="datetime-local"
                      id="datetime"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                    />


                    <label className="w-[80%] ">
                      Encrypted?
                      <input
                        type="checkbox"

                        checked={checked}
                        onChange={handleChecked}
                      />
                    </label>


                    {checked && <>

                      <h4>Enter Public Key:</h4>

                      <textarea className="border-2" value={publicKeyArmored} onChange={handlePublicKeyArmored} />
                    </>
                    }





                    <div >
                      <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={confirmGetPresigned}>Generate</button>
                      <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm2(false)}>Cancel</button>
                    </div>
                  </div>
                </Modal>
                <Modal
                  isOpen={showForm3}
                  onRequestClose={() => setShowForm3(false)}
                  contentLabel="Delete User Modal"
                  className="modal"

                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 999, // Increase the z-index if needed
                    },
                    content: {
                      width: '280px', // Adjust as per your modal's width
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#fff',
                      border: '0',
                      borderRadius: '20px',
                      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch', // For iOS Safari
                      scrollbarWidth: 'thin', // For modern browsers that support scrollbar customization
                      scrollbarColor: 'rgba(255, 255, 255, 0.5) #2d2c2c', // For modern browsers that support scrollbar customization
                      animation: `swoopIn 0.3s ease-in-out forwards`, // Add animation
                    },
                  }}
                >
                  <div className="flex flex-col rounded-lg gap-2  px-4 py-8 text-center">
                    <AiOutlineClose onClick={() => {
                      setShowForm3(false)
                    }} />
                    <h2>Add Credit to your Vrun account</h2>

                    <input

                      className="w-[60%] self-center border border-black-200 text-black-500"
                      type="text"

                      value={feeETHInput}
                      onChange={handleETHInput}
                    />



                    <div >
                      <button className="bg-green-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={makePayment}>Pay ETH</button>
                      <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm3(false)}>Cancel</button>
                    </div>
                  </div>
                </Modal>
                <Modal
                  isOpen={showForm4}
                  onRequestClose={() => setShowForm4(false)}
                  contentLabel="Delete User Modal"
                  className="modal"

                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 999, // Increase the z-index if needed
                    },
                    content: {
                      width: '280px', // Adjust as per your modal's width
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#fff',
                      border: '0',
                      borderRadius: '20px',
                      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch', // For iOS Safari
                      scrollbarWidth: 'thin', // For modern browsers that support scrollbar customization
                      scrollbarColor: 'rgba(255, 255, 255, 0.5) #2d2c2c', // For modern browsers that support scrollbar customization
                      animation: `swoopIn 0.3s ease-in-out forwards`, // Add animation
                    },
                  }}
                >
                  <div className="flex flex-col rounded-lg gap-2  px-4 py-8 text-center">
                    <AiOutlineClose onClick={() => {
                      setShowForm4(false)
                    }} />
                    <h2>Post Presigned Exit Message</h2>


                    <p>WARNING!: Submitting this exit message will mean this validator will begin the exit process. </p>





                    <textarea value={exitMessage} onChange={handleChangeExitMessage} />



                    <div >
                      <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={postPresignedExitMessage}>Post</button>
                      <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm4(false)}>Cancel</button>
                    </div>
                  </div>
                </Modal>

              </div>) : (


                <div className='h-[100vh] w-full flex items-center gap-2 justify-center flex-col'>

                  <h3>Please wait while we retrieve your account info...</h3>

                  <BounceLoader />


                </div>





              )



              }





            </>

          ) : (<


            NoRegistration onRegistrationResult={handleRegistrationResult} />


          )
          }
        </>
      ) : (<NoConnection />)}







    </section>
  )
}

export default AccountMain