import React, { useEffect, useState } from 'react'
import { PieChart, LineChart } from '@mui/x-charts'
import { BarChart } from '@mui/x-charts/BarChart';
import { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import storageABI from "../json/storageABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import managerABI from "../json/managerABI.json"
import daoABI from "../json/daoABI.json"
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

import ContractTag from "../components/contractTag"
import feeABI from "../json/feeABI.json"
import { GrSatellite } from "react-icons/gr";
import RollingNumber from './rollingNumber';





if (process.browser) {
  Modal.setAppElement(document.body);
}

const AccountMain: NextPage = () => {







  const [data, setData] = useState("");
  const [publicKeyArmored, setPublicKeyArmored] = useState(``);



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


    await fetch(`https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/eth/v1/beacon/states/finalized/validators/${pubkey}`, {
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




  const getValBeaconData = async (pubkey: string) => {



    let newObject


    await fetch(` https://holesky.beaconcha.in/api/v1/rocketpool/validator/${pubkey}`, {
      method: "GET",
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data



        newObject = jsonString.data

        console.log("Val Balance:" + Object.entries(newObject))
      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });


    return newObject
  }






  const getValBeaconBalance = async (pubkey: string) => {


    let newString


    await fetch(`https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/eth/v1/beacon/states/finalized/validator_balances?id=${pubkey}`, {
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



    await fetch(`'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/eth/v1/beacon/pool/voluntary_exits`, {
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






    const valIndex = await fetch(`https://holesky.beaconcha.in/api/v1/validator/eth1/${address}?apikey=7f0daf71-cc5e-4a97-8106-a3b3d6b2332d`, {
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






  const getMinipoolData = async () => {


    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()






    const provider = new ethers.JsonRpcProvider(currentChain === 17000 ? "https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/" : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/")


    //https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/   https://xrchz.net/rpc/holesky


    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, provider)


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








    let attachedPubkeyArray: Array<Array<string>> = [];


    for (const key of pubkeyArray) {

      console.log("Pubkey:" + key);

      let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(key);

      if (minipoolAddress === nullAddress) {
        attachedPubkeyArray.push(["Null minipool", key])
      }

      else {
        attachedPubkeyArray.push([minipoolAddress, key]);
      }


      console.log("Get minipool result:" + minipoolAddress);

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
          pubkey: pubkey

        });


      } else {


        const minipool = new ethers.Contract(minAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], provider)


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
          statusTimeResult: statusTimeResult,
          timeRemaining: timeRemaining.toString(),
          graffiti: typeof printGraff === "string" ? printGraff : "",
          beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",

          beaconLogs: typeof beaconObject === "object" ? beaconObject : [emptyValidatorData],
          valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
          valProposals: newValProposals.toString(),
          valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),

          pubkey: pubkey
        })

      }



    }


    setCurrentRowData(minipoolObjects)
    setShowForm(false)


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
  const [accountLogs, setAccountLogs] = useState<Array<Array<object>>>([])



  useEffect(() => {


    getMinipoolData();

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




  const getValBeaconStats = async (pubkey: string) => {




    //https://holesky.beaconcha.in/api/v1/validator/${pubkey}



    let newLogs: beaconLogs;


    const valIndex = await fetch(`https://holesky.beaconcha.in/api/v1/validator/eth1/${address}?apikey=7f0daf71-cc5e-4a97-8106-a3b3d6b2332d`, {
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


    const valStats = await fetch(`https://holesky.beaconcha.in/api/v1/validator/stats/${valIndex}`, {
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




  useEffect(() => {

    console.log(checked);


  }, [checked])



  const handleChecked = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked(checked)


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



  //<a href={`https://holesky.beaconcha.in/validator/${data.pubkey}`} target="_blank">




  const router = useRouter();

  const handleClick = (param1: string, param2: number) => {
    router.push(`/validatorDetail/${param1}/${param2}`);
  };



  return (
    <section className="flex w-full flex-col items-center justify-center ">

      {address !== undefined ? (
        <>
          {isRegistered ? (



            <>
              <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                  <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Connected User: </h2>

                  <p className="mt-4 text-gray-500 sm:text-xl">
                    {address}
                  </p>
                </div>
              </div>




              <div className="flex items-center justify gap-5">


                <div className="flex items-center p-8 bg-white shadow border border-b-2 rounded-lg mb-5">
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                    series={[
                      {
                        data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 11],
                        showMark: ({ index }) => index % 2 === 0,
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </div>

                <section className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                  <div className="flex items-center p-8 bg-white shadow rounded-lg mb-5">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 327.5 533.3" xmlSpace="preserve">
                        <style>{`.st0{fill:#8A92B2;} .st1{fill:#62688F;} .st2{fill:#454A75;}`}</style>
                        <path className="st0" d="M163.7,197.2V0L0,271.6L163.7,197.2z" />
                        <path className="st1" d="M163.7,368.4V197.2L0,271.6L163.7,368.4z M163.7,197.2l163.7,74.4L163.7,0V197.2z" />
                        <path className="st2" d="M163.7,197.2v171.2l163.7-96.8L163.7,197.2z" />
                        <path className="st0" d="M163.7,399.4L0,302.7l163.7,230.7V399.4z" />
                        <path className="st1" d="M327.5,302.7l-163.8,96.7v134L327.5,302.7z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">83%</span>
                      <span className="block text-gray-500">Finished homeworks</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-8 bg-white shadow rounded-lg mb-5">

                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="w-full max-w-3xl flex  items-center justify-center gap-7 text-center">
                   


                    <div className='mb-2'>
                      <span className="block text-2xl font-bold">{currentPayments}</span>
                      <span className="block text-gray-500">in Credit</span>
                    </div>
                     

                      <button onClick={handlePaymentModal} className="bg-green-500 text-xs hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Top-up</button>
                     



                    </div>

                  </div>
                  <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">83%</span>
                      <span className="block text-gray-500">Attestations</span>
                    </div>
                  </div>
                  <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">83%</span>
                      <span className="block text-gray-500 w-[80%]">Currently in the Smoothing Pool</span>
                    </div>
                  </div>
                </section>

              </div>

              <div className="w-full my-5 mx-5 mb-1 overflow-hidden rounded-lg ">
                <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">

                  <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
                    <h3 className="text-2xl font-bold text-gray-900 ">Active Validators</h3>
                    <Link href="/createValidator">



                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                        Create New
                      </button>




                    </Link>

                  </div>

                </div>
              </div>




              <div className="w-[auto] overflow-hidden shadow border rounded-lg mb-10 ">
                <table className="w-full">
                  <tbody>
                    {currentRowData.map((data, index) => (
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
                          <span className='text-green-500 font-bold text-lg ' style={Number(data.valDayVariance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>

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
                                <>
                                  {data.valDayVariance !== "" && <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    </svg>
                                  </div>}
                                  <p>{data.valDayVariance !== "" && "- " + data.valDayVariance}</p>
                                </>
                              )}

                            </span>


                          </div>
                        </td>
                        <td className="px-4 py-3 w-[180px]">
                          <div className="flex items-center flex-col gap-1 text-l text-gray-500">
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



              {currentRowData.length > 0 && currentRowData.map((rowObject, index) => (
                <div className="w-full flex flex-wrap items-center justify-center" key={index}>
                  {rowObject.beaconLogs.map((beaconLog, index) => (
                    <div className="w-[280px] m-2 border-2" key={index}>
                      <p>Validator Index: {beaconLog.validatorindex}</p>
                      <p>Start Balance: {beaconLog.start_balance.toString()}</p>
                      <p>End Balance: {beaconLog.end_balance.toString()}</p>
                      <p>Missed Attestations: {beaconLog.missed_attestations}</p>
                      <p>Missed Blocks: {beaconLog.missed_blocks}</p>
                      <p>Deposits: {beaconLog.deposits.toString()}</p>
                      <p>Deposits Amount: {beaconLog.deposits_amount.toString()}</p>
                      <p>End Effective Balance: {beaconLog.end_effective_balance.toString()}</p>
                      <p>Max Balance: {beaconLog.max_balance.toString()}</p>
                      <p>Min Balance: {beaconLog.min_balance.toString()}</p>
                      <p>Missed Sync: {beaconLog.missed_sync}</p>
                      <p>Orphaned Attestations: {beaconLog.orphaned_attestations}</p>
                      <p>Orphaned Blocks: {beaconLog.orphaned_blocks}</p>
                      <p>Orphaned Sync: {beaconLog.orphaned_sync}</p>
                      <p>Participated Sync: {beaconLog.participated_sync}</p>
                      <p>Proposed Blocks: {beaconLog.proposed_blocks}</p>
                      <p>Proposer Slashings: {beaconLog.proposer_slashings.toString()}</p>
                      <p>Start Effective Balance: {beaconLog.start_effective_balance.toString()}</p>
                      <p>Withdrawals: {beaconLog.withdrawals.toString()}</p>
                      <p>Withdrawals Amount: {beaconLog.withdrawals_amount.toString()}</p>

                    </div>
                  ))}
                </div>
              ))}



            </>

          ) : (<NoRegistration onRegistrationResult={handleRegistrationResult} />)
          }
        </>
      ) : (<NoConnection />)}







    </section>
  )
}

export default AccountMain