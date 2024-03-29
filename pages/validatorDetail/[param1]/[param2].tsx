import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../components/navbar';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import * as openpgp from 'openpgp';
import storageABI from "../../json/storageABI.json"
import miniManagerABI from "../../json/miniManagerABI.json"
import daoABI from "../../json/daoABI.json"
import feeABI from "../../json/feeABI.json"
import CountdownComponent from '../../components/countdown.jsx';
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import ContractTag from "../../components/contractTag"
import { GrSatellite } from "react-icons/gr";
import { AiOutlineClose } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import { PieChart, LineChart } from '@mui/x-charts'
import { Line, getElementsAtEvent } from 'react-chartjs-2';

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

const ValidatorDetail: NextPage = () => {



    const router = useRouter()
    const params = useParams<{ param1: string; param2: string }>() // Accessing the 'id' parameter from the URL




    const { address } = useAccount({
        onConnect: ({ address }) => {
            console.log("Ethereum Wallet Connected!")

        }
    })




    const currentChain = useChainId();

    const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"


    const nullAddress = "0x0000000000000000000000000000000000000000";


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


    const [currentData, setCurrentData] = useState<rowObject>({

        address: "",
        statusResult: "Empty",
        statusTimeResult: "",
        timeRemaining: "",
        graffiti: "",
        beaconStatus: "",
        beaconLogs: [emptyValidatorData],
        pubkey: "",
        valBalance: "",
        valProposals: "",
        valDayVariance: ""

    })




    const getValidatorData = async () => {


        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()










        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


        //Get latest index






        //Get all pubkeys







        let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);











        let minipoolObject: rowObject;





        if (minipoolAddress === nullAddress) {

            minipoolObject = {

                address: "",
                statusResult: "Empty",
                statusTimeResult: "",
                timeRemaining: "",
                graffiti: "",
                beaconStatus: "",
                beaconLogs: [emptyValidatorData],
                pubkey: typeof params.param1 === "string" ? params.param1 : "",
                valBalance: "",
                valProposals: "",
                valDayVariance: "",

            };


        } else {


            const minipool = new ethers.Contract(minipoolAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], signer)


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


            const printGraff = typeof params.param1 === "string" ? await getGraffiti(params.param1) : "";
            const beaconStatus = typeof params.param1 === "string" ? await getBeaconchainStatus(params.param1) : ""

            const beaconStatistics: beaconLogs = typeof params.param1 === "string" ? await getValBeaconStats(params.param1) : [emptyValidatorData]

            console.log(printGraff)


            console.log(beaconStatistics)


            console.log(printGraff)

            const newValBalance = beaconStatistics[0].end_balance

            let newValProposals = 0;

            for (const beaconLog of beaconStatistics) {

                let blocks = beaconLog.proposed_blocks

                newValProposals += blocks
            }

            const newValVariance = beaconStatistics[0].end_balance - beaconStatistics[0].start_balance




            minipoolObject = {
                address: minipoolAddress,
                statusResult: currentStatus,
                statusTimeResult: statusTimeResult,
                timeRemaining: timeRemaining.toString(),
                graffiti: typeof printGraff === "string" ? printGraff : "",
                beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",
                beaconLogs: beaconStatistics,
                pubkey: typeof params.param1 === "string" ? params.param1 : "",
                valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
                valProposals: newValProposals.toString(),
                valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),
            }



        }


        setCurrentData(minipoolObject)
    }



    useEffect(() => {


        console.log("Get Data Running")

        console.log(params)
        console.log(params.param1)


        if (typeof params.param1 === "string" && typeof params.param2 === "string") {
            getValidatorData();
        }


    }, [params])



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


    const getBeaconchainStatus = async (pubkey: string) => {


        let newString;

        const currentRPC = currentChain === 17000 ? 'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/' : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"




        await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
            method: "GET",
        })
            .then(async response => {

                var jsonString = await response.json()// Note: response will be opaque, won't contain currentData



                newString = jsonString.data.status
            })
            .catch(error => {
                // Handle error here
                console.log(error);
            });





        return newString


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



    function truncateString(str: string) {
        if (str.length <= 15) {
            return str;
        } else {
            return str.slice(0, 15) + "...";
        }
    }


    // DELEGATE ACTIONS


    const stakeMinipool = async () => {

        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);











        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


        const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


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

        const value = { pubkey: params.param1, withdrawalCredentials: newAddress, amountGwei: (ethers.parseEther('31') / ethers.parseUnits('1', 'gwei')).toString() }


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



    const distributeBalanceOfMinipool = async () => {

        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


        const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


        console.log("Mini Address:" + minipoolAddress)
        const minipool = new ethers.Contract(minipoolAddress, ['function distributeBalance(bool)'], signer)
        await minipool.distributeBalance(false)




    }




    const closeMinipool = async () => {

        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


        const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


        console.log("Mini Address:" + minipoolAddress)
        const minipool = new ethers.Contract(minipoolAddress, ['function close()'], signer)
        await minipool.close()




    }





    const [showForm, setShowForm] = useState(false)
    const [showForm2, setShowForm2] = useState(false)
    const [currentEditGraffiti, setCurrentEditGraffiti] = useState("")





    const handleGraffitiChange = (e: any) => {


        setCurrentEditGraffiti(e.target.value);

    }



    const [publicKeyArmored, setPublicKeyArmored] = useState(``);


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





    const handleGraffitiModal = (graff: string) => {
        setShowForm(true);

        setCurrentEditGraffiti(graff)

    }



    useEffect(() => {

        console.log(currentEditGraffiti)

    }, [currentEditGraffiti])



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


        getValidatorData();



    }


    const confirmGraffiti = () => {
        if (typeof params.param1 === "string" && typeof params.param2 === "string") {
            setGraffiti(Number(params.param2), params.param1, currentEditGraffiti)
        }
    }




    const confirmGetPresigned = () => {
        if (typeof params.param1 === "string" && typeof params.param2 === "string") {
            getPresignedExitMessage(params.param1, Number(params.param2))

        }
    }




    const handleGetPresignedModal = () => {
        setShowForm2(true);


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




    const [exitMessage, setExitMessage] = useState("")
    const [showForm4, setShowForm4] = useState(false);

    const handleChangeExitMessage = (e: any) => {
        setExitMessage(e.target.value)
    }



    const handlePostExitModal = () => {
        setShowForm4(true);
    }



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



        


        const chainString = currentChain === 17000 ? 'holesky.' : ''


        const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=7f0daf71-cc5e-4a97-8106-a3b3d6b2332d`, {
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


    const postPresignedExitMessage = async () => {



        const currentRPC = currentChain === 17000 ? 'https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/' : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/"



        await fetch(`${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
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



    const getValBeaconStats = async (pubkey: string) => {




        const chainString = currentChain === 17000 ? 'holesky.' : ''


        const valIndex = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=7f0daf71-cc5e-4a97-8106-a3b3d6b2332d`, {
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


    //FUNCTIONS FOR GRAPH DATA (MAY NEED ADDITIONAL WORK FOR LABELS AND THE FACT ITS )




    const [TotalGraphPlotPoints, setTotalGraphPlotPoints] = useState<Array<number>>([])
    const [xAxisData, setXAxisData] = useState<Array<number>>([]);

    const convertToGraphPlotPoints = async () => {


        let newPlotPoints: Array<number> = [];

        //for (const object of currentRowData) {

        for (const log of currentData.beaconLogs) {


            if (currentData.statusResult === "Staking" && Number(log.start_balance) !== 0) {

                let variance = log.end_balance - log.end_effective_balance

                let editedVariance = Number(ethers.formatUnits(variance, "gwei"))

                newPlotPoints.push(editedVariance)
            }

        }

        //}


        setTotalGraphPlotPoints(newPlotPoints);



    }


    useEffect(() => {

        console.log(TotalGraphPlotPoints)

        const xAxisDataArray = Array.from({ length: TotalGraphPlotPoints.length }, (_, i) => i + 1);
        setXAxisData(xAxisDataArray);

    }, [TotalGraphPlotPoints])


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



    const [graphState, setGraphState] = useState("Week");



    const charRef = useRef();

    const onClick = (event: any) => {

        console.log(charRef)

        if (typeof charRef.current !== "undefined") {
            console.log(getElementsAtEvent(charRef.current, event)[0].datasetIndex)
        }

    }




    const graphData = getGraphData(graphState, xAxisData, TotalGraphPlotPoints);


    const options = {

        scales: {
            y: {
                min: 0,
                max: 0.01
            }
        }

    }



    useEffect(() => {

        if (currentData.address !== "") {
            convertToGraphPlotPoints();
        }

    }, [currentData])












    return (
        <div className="flex w-full flex-col gap-2 items-center justify-center ">
            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
                    name="Vrün  | Nodes & Staking"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <Navbar />


            <div className="w-full flex flex-col items-center justify-center py-10">
                <div className="w-[50%] flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pubkey: </h2>

                    <p className="mt-4 text-gray-500 sm:text-xl">

                        <ContractTag pubkey={params?.param1} />
                    </p>
                </div>
            </div>




            <div className="flex items-center justify gap-5">


                <div className="flex items-center p-8 bg-white shadow border border-b-2 rounded-lg mb-5">
                    {xAxisData.length > 0 && TotalGraphPlotPoints.length > 0 &&

                        <div className="w-[600px] h-[auto] py-3">


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




                <section className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">

                    <div className="flex items-center p-8 bg-white shadow rounded-lg">
                        <div className="inline-flex flex-shrink-4 items-center justify-center h-16 w-16 text-blue-600 bg-white-100 rounded-full mr-6">
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
                            <span className="block text-xl mb-2 font-bold">Validator Status:</span>
                            <span className="block text-gray-500 mb-2">


                                {currentData.statusResult === "Prelaunch" &&
                                    <span className="px-2 py-1 font-semibold text-lg leading-tight text-orange-700 bg-gray-100 rounded-sm">{currentData.statusResult}</span>


                                }


                                {currentData.statusResult === "Initialised" &&

                                    <span className="px-2 py-1 font-semibold text-lg leading-tight text-orange-700 bg-gray-100 rounded-sm">{currentData.statusResult}</span>


                                }

                                {currentData.statusResult === "Staking" &&

                                    <span className="px-2 py-1 font-semibold text-lg leading-tight text-green-700 bg-green-100 rounded-sm">{currentData.statusResult}</span>


                                }


                                {currentData.statusResult === "Withdrawable" &&

                                    <span className="px-2 py-1 font-semibold text-lg leading-tight text-green-700 bg-green-100 rounded-sm">{currentData.statusResult}</span>


                                }


                                {currentData.statusResult === "Dissolved" &&

                                    <span className="px-2 py-1 font-semibold text-lg leading-tight text-red-700 bg-red-100 rounded-sm">{currentData.statusResult}</span>


                                }


                                {currentData.statusResult === "Empty" &&

                                    <span className="px-2 py-1 font-semibold  text-lg leading-tight text-greay-700 bg-gray-100 rounded-sm">{currentData.statusResult}</span>


                                }
                            </span>

                            {currentData.timeRemaining !== "No countdowns initiated" &&
                                <CountdownComponent milliseconds={currentData.timeRemaining} />}
                        </div>
                    </div>
                    <div className="flex items-center p-8 bg-white shadow rounded-lg">

                        <div>

                            <span className='text-green-500 text-lg  font-bold' style={Number(currentData.valDayVariance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>
                                {Number(currentData.valDayVariance) > 0 ? (
                                    <div className='flex items-center justify-center'>
                                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16  bg-green-100 rounded-full mr-3">
                                            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>

                                        </div>

                                        <div>
                                            <span className="block text-xl font-bold text-black">Daily ETH Tracker:</span>

                                            <p className="text-green-600"> {currentData.valDayVariance}</p>
                                        </div>

                                    </div>


                                ) : (
                                    <>
                                        {currentData.valDayVariance !== "" && <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16  bg-red-100 rounded-full mr-6">
                                            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                            </svg>
                                        </div>}

                                        <div>
                                            <span className="block text-xl font-black-bold">Daily ETH Tracker:</span>
                                            <p className='text-red-600'>{currentData.valDayVariance !== "" && "- " + currentData.valDayVariance}</p>
                                        </div>
                                    </>
                                )}

                            </span>
                        </div>
                    </div>
                    <div className="flex items-center p-8 bg-white shadow rounded-lg">
                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                            <GrSatellite className="text-red-500 text-2xl" />
                        </div>
                        <div>
                            <div className="flex items-start flex-col gap-1 text-l ">
                                {currentData.beaconStatus !== "" &&
                                    <h3 className='block text-xl mb-1 font-bold'>Status on Beaconchain</h3>
                                }
                                <p>{currentData.beaconStatus}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center p-8 bg-white shadow rounded-lg">
                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <div className='flex items-start flex-col gap-1 text-l '>
                                <span className="text-xl font-bold">Minipool Address:</span>
                                <p className=" w-[50%] text-wrap text-gray-500"> <ContractTag pubkey={truncateString(currentData.address)} /></p>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center p-8 bg-white shadow rounded-lg">
                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                            <GrSatellite className="text-red-500 text-2xl" />
                        </div>
                        <div>
                            <div className="flex items-start flex-col gap-1 text-l ">
                                {currentData.beaconStatus !== "" &&
                                    <h3 className='block text-xl mb-1 font-bold'>Status on Beaconchain</h3>
                                }
                                <p>{currentData.beaconStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center p-8 bg-white shadow rounded-lg">
                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                            <GrSatellite className="text-red-500 text-2xl" />
                        </div>
                        <div>
                            <div className="flex items-start flex-col gap-1 text-l ">
                                <p className="text-xs text-gray-600">    {currentData.graffiti}</p>




                                <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(currentData.graffiti) }}>
                                    Change
                                </button>

                            </div>
                        </div>
                    </div>
                </section>

            </div>


            <div className="w-full flex flex-col items-center justify-center py-10">

                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Current Actions: </h2>
                <div className='flex'>
                    {currentData.statusResult === "Dissolved" &&
                        <button onClick={() => { closeMinipool() }} className="bg-red-500 mt-2  text-xs  hover:bg-red-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Close Minipool</button>
                    }
                    {currentData.statusResult === "Prelaunch" &&

                        <button onClick={() => { stakeMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Stake Minipool</button>


                    }

                    {currentData.statusResult === "Staking" &&

                        <button onClick={handlePostExitModal} className="bg-red-500 mt-2  text-xs  hover:bg-red-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Initiate Close</button>

                    }


                    {currentData.statusResult === "withdrawal_done" &&

                        <button onClick={() => { distributeBalanceOfMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Distribute Balance</button>

                    }

                    {currentData.statusResult !== "Empty" &&
                        <button onClick={() => { handleGetPresignedModal() }} className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Get Exit Message</button>

                    }

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



           {/*  <div>

                <h2>

                </h2>

                <div className="flex flex-wrap justify-center items-center">

                    {currentData.beaconLogs.map((beaconLog, index) => (
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
            */}


        



        </div>
    )
}

export default ValidatorDetail