import React, { useEffect, useState } from 'react'
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
        pubkey: ""

    })




    const getValidatorData = async () => {


        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()






        const provider = new ethers.JsonRpcProvider(currentChain === 17000 ? "https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/" : "https://chaotic-alpha-glade.quiknode.pro/2dbf1a6251414357d941b7308e318a279d9856ec/")


        //https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/   https://xrchz.net/rpc/holesky


        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, provider)


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
                pubkey: typeof params.param1 === "string" ? params.param1 : ""

            };


        } else {


            const minipool = new ethers.Contract(minipoolAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], provider)


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




            minipoolObject = {
                address: minipoolAddress,
                statusResult: currentStatus,
                statusTimeResult: statusTimeResult,
                timeRemaining: timeRemaining.toString(),
                graffiti: typeof printGraff === "string" ? printGraff : "",
                beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",
                beaconLogs: beaconStatistics,
                pubkey: typeof params.param1 === "string" ? params.param1 : ""
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


        await fetch(`https://ultra-holy-road.ethereum-holesky.quiknode.pro/b4bcc06d64cddbacb06daf0e82de1026a324ce77/eth/v1/beacon/states/finalized/validators/${pubkey}`, {
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
                        {params?.param1}
                    </p>
                </div>
            </div>

           


            <div className="flex items-center justify gap-5">
            <div className="flex items-center p-8 bg-white shadow rounded-lg mb-5">
                <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                series={[
                    {
                        data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3,11],
                        showMark: ({ index }) => index % 2 === 0,
                    },
                ]}
                width={500}
                height={300}
            />
            </div>

              

            <section className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
              
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">62</span>
                        <span className="block text-gray-500">Students</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">6.8</span>
                        <span className="block text-gray-500">Average mark</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block text-2xl font-bold">9</span>
                        <span className="inline-block text-xl text-gray-500 font-semibold">(14%)</span>
                        <span className="block text-gray-500">Underperforming students</span>
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
                        <span className="block text-gray-500">Finished homeworks</span>
                    </div>
                </div>
            </section>

            </div>


            <table className="w-[90%]">
                <thead>
                    <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Beacon Chain</th>
                        <th className="px-4 py-3">Minipool Address</th>
                        <th className="px-4 py-3">Pubkey</th>
                        <th className="px-4 py-3">Time remaining</th>
                        <th className="px-4 py-3">Grafitti</th>

                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">




                    <tr className="text-gray-700">
                        <td className="px-4 py-3 text-xs border">


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




                        </td>

                        <td className="px-4 py-3 border">
                            <div className="flex items-center text-sm">
                                <div>

                                    <h3>View on Beaconchain:</h3>

                                    <a className="w-[75px] h=[75px]" href={`https://holesky.beaconcha.in/validator/${currentData.pubkey}`} target="_blank"><GrSatellite /></a>


                                    {currentData.beaconStatus}



                                </div>
                            </div>

                        </td>
                        <td className="px-4 py-3 border">
                            <div className="flex items-center text-sm">
                                <div>
                                    <p className="font-semibold text-black">{truncateString(currentData.address)}</p>

                                </div>
                            </div>
                        </td>

                        <td className="px-4 py-3 border">
                            <div className="flex items-center text-sm">
                                <div>

                                    <ContractTag pubkey={truncateString(currentData.pubkey)} />

                                </div>
                            </div>
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold border"><CountdownComponent milliseconds={currentData.timeRemaining} /></td>
                        <td className="px-4 py-3 text-md  font-semibold border ">


                            <p className="text-xs text-gray-600">    {currentData.graffiti}</p>




                            <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(currentData.graffiti) }}>
                                Change
                            </button>


                        </td>
                        {/*  
                 <td className="px-4 py-3 text-md font-semibold border">
              Graffiti placeholder: { /* Get graffiti 
              <input 
                type="text" 
                value={graffitiValues[index] || ''} 
                onChange={(e) => handleGraffitiChange(index, currentData.pubkey, e.target.value)} 
              />
              <button  className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => handleSetGraffiti(index, currentData.pubkey)}>
                Set Graffiti
              </button>
            </td> */}



                        <td className="px-4 py-3 gap-2 text-sm border">

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
                        </td>
                    </tr>


                </tbody>
            </table>



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



            <div>

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
                            {/* Add more JSX elements to display other properties as needed */}
                        </div>

                    ))}

                </div>



            </div>




        </div>
    )
}

export default ValidatorDetail