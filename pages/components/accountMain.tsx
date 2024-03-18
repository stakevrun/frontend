import React, { useEffect, useState } from 'react'
import { PieChart, LineChart } from '@mui/x-charts'
import { BarChart } from '@mui/x-charts/BarChart';
import { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import storageABI from "../json/storageABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import daoABI from "../json/daoABI.json"
import CountdownComponent from './countdown.jsx';
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import * as openpgp from 'openpgp';
import { AiOutlineClose } from 'react-icons/ai'
import Link
  from 'next/link';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import ContractTag from "../components/contractTag"
import feeABI from "../json/feeABI.json"

const AccountMain: NextPage = () => {



  /*(async () => {

    const fr = new ethers.FetchRequest('https://xrchz.net/rpc/holesky/')

    fr.setCredentials('vrun','830b5000e7c2de8802a549cadc41db4148d247de0a706d6d')
   
   
    const provider = new ethers.JsonRpcProvider(fr)

    const blockNum =  await provider.getBlockNumber()


console.log("This is the block number" + blockNum)
   
  
  })();*/








  /*


  const MinipoolStatus =  [
    Initialised,    
    Prelaunch,     
    Staking,      
    Withdrawable,   
    Dissolved       
  ]
*/



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

        var json = await response.json()// Note: response will be opaque, won't contain data

        var newJSON = Object.entries(json)


        return newJSON.toString();




      })
      .catch(error => {
        // Handle error here
        console.log(error);
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













  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")

    }
  })



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


    {/* let logs:Array<object> = [];


    for (const key of pubkeyArray) {

      await fetch(`https://db.vrün.com/${currentChain}/${address}/${key}/logs`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async response => {

          var jsonString = await response.json()


          console.log("Result of pubkey logs" + jsonString)

          logs.push(jsonString);





        })
        .catch(error => {


        });

    }


  console.log(logs);*/}





    let minipoolObjects: Array<rowObject> = [];


    for (const [minAddress, pubkey] of attachedPubkeyArray) {





      if (minAddress === "Null minipool") {

        minipoolObjects.push({

          address: "EMPTY",
          statusResult: "Empty",
          statusTimeResult: "",
          timeRemaining: "",
          graffiti: "",
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

        console.log(printGraff)




        minipoolObjects.push({
          address: minAddress,
          statusResult: currentStatus,
          statusTimeResult: statusTimeResult,
          timeRemaining: (timeRemaining + 17099900800000).toString(),
          graffiti: typeof printGraff === "string" ? printGraff : "",
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






  type rowObject = {
    address: string,
    statusResult: string,
    statusTimeResult: string,
    timeRemaining: string,
    pubkey: string
    graffiti: string
  };


  const [currentRowData, setCurrentRowData] = useState<Array<rowObject>>([])
  const [accountLogs, setAccountLogs] = useState<Array<Array<object>>>([])



  useEffect(() => {


    getMinipoolData();

  }, [])


  useEffect(() => {


    getPayments();

  }, [])



  const [currentPayments, setCurrentPayments] = useState<number>(0)


  const getPayments = async () => {


    const payments: number = await fetch(`https://xrchz.net/stakevrun/fee/${currentChain}/${address}/payments`, {
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
      });



    setCurrentPayments(payments);







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







  return (
    <section className="bg-white flex flex-7 sticky items-center justify-center flex-col w-full overflow-y-scroll ">




      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Connected User: </h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            {address}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">



          <h3 className="text-1xl font-bold text-gray-900 mb-2 "> Balance:  {currentPayments}</h3>

          <button onClick={handlePaymentModal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Make a payment</button>




        </div>

      </div>


      <div className="w-full my-5 mx-5 mb-8 overflow-hidden rounded-lg ">
        <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-12">

          <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
            <h3 className="text-1xl font-bold text-gray-900 ">Active Nodes</h3>
            <Link href="/createValidator">



              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                Create New
              </button>




            </Link>

          </div>
          <table className="w-[90%]">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Minipool Address</th>
                <th className="px-4 py-3">Pubkey</th>
                <th className="px-4 py-3">Time remaining</th>
                <th className="px-4 py-3">Grafitti</th>

                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">



              {currentRowData.map((data: rowObject, index: number) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-3 text-xs border">


                    {data.statusResult === "Prelaunch" &&
                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                    }


                    {data.statusResult === "Initialised" &&

                      <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                    }

                    {data.statusResult === "Staking" &&

                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm">{data.statusResult}</span>


                    }


                    {data.statusResult === "Withdrawable" &&

                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm">{data.statusResult}</span>


                    }


                    {data.statusResult === "Dissolved" &&

                      <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm">{data.statusResult}</span>


                    }


                    {data.statusResult === "Empty" &&

                      <span className="px-2 py-1 font-semibold leading-tight text-greay-700 bg-gray-100 rounded-sm">{data.statusResult}</span>


                    }




                  </td>
                  <td className="px-4 py-3 border">
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold text-black">View on Beaconchain: <a href={`https://holesky.beaconcha.in/validator/${data.pubkey}`} target="_blank">{truncateString(data.address)}</a></p>

                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 border">
                    <div className="flex items-center text-sm">
                      <div>

                        <ContractTag pubkey={truncateString(data.pubkey)} />

                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold border"><CountdownComponent milliseconds={data.timeRemaining} /></td>
                  <td className="px-4 py-3 text-md  font-semibold border ">


                    <p className="text-xs text-gray-600">    {data.graffiti}</p>




                    <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(index, data.pubkey, data.graffiti) }}>
                      Change
                    </button>


                  </td>
                  {/*  
                 <td className="px-4 py-3 text-md font-semibold border">
              Graffiti placeholder: { /* Get graffiti 
              <input 
                type="text" 
                value={graffitiValues[index] || ''} 
                onChange={(e) => handleGraffitiChange(index, data.pubkey, e.target.value)} 
              />
              <button  className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => handleSetGraffiti(index, data.pubkey)}>
                Set Graffiti
              </button>
            </td> */}



                  <td className="px-4 py-3 gap-2 text-sm border">

                    {data.statusResult !== "Empty" &&
                      <button onClick={() => { closeMinipool(index) }} className="bg-red-500 mt-2  text-xs  hover:bg-red-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Close Minipool</button>
                    }
                    {data.statusResult === "Prelaunch" &&

                      <button onClick={() => { stakeMinipool(index) }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Stake Minipool</button>


                    }


                    <button onClick={() => { handleGetPresignedModal(index, data.pubkey) }} className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Get Exit Message</button>


                  </td>
                </tr>
              ))}







              {/*  <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Nora</p>
                      <p className="text-xs text-gray-600">Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-md font-semibold border">17</td>
                <td className="px-4 py-3 text-xs border">
                  <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm"> Nnacceptable </span>
                </td>
                <td className="px-4 py-3 text-sm border">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Ali</p>
                      <p className="text-xs text-gray-600">Programmer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">23</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Khalid</p>
                      <p className="text-xs text-gray-600">Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">20</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-sm"> Pending </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Nasser</p>
                      <p className="text-xs text-gray-600">Pen Tester</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">29</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Mohammed</p>
                      <p className="text-xs text-gray-600">Web Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">38</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Saad</p>
                      <p className="text-xs text-gray-600">Data</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">19</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Sami</p>
                      <p className="text-xs text-gray-600">Developer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">21</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>

              */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by eCommerce Businesses</h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores laborum labore
            provident impedit esse recusandae facere libero harum sequi.
          </p>
        </div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Total Sales</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">$4.8m</dd>
            </div>

            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Official Addons</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">24</dd>
            </div>

            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Total Addons</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86</dd>
            </div>
          </dl>
        </div>
      </div>



      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
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

          <h4>Enter Public Key:</h4>
          <label className="w-[80%]">
            Garden?
            <input
              type="checkbox"

              checked={checked}
              onChange={handleChecked}
            />
          </label>

          <textarea value={publicKeyArmored} onChange={handlePublicKeyArmored} />



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
            zIndex: "999999999999999999999999999999999999",
          },
          content: {
            width: '50%',
            height: '300px',
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
            setShowForm3(false)
          }} />
          <h2>Get Presigned Exit Message</h2>

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



      <div className="mt-8 sm:mt-12 p-4">

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />



          </div>


          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">

            <BarChart
              series={[
                { data: [35, 44, 24, 34] },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
              ]}
              height={290}
              xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </div>




        </dl>



      </div>

      <div className="mt-8 sm:mt-12 p-4">

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-1">

          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">


            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />


          </div>
        </dl>

      </div>








    </section>
  )
}

export default AccountMain