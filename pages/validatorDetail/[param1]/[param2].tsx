import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/Home.module.css';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import * as openpgp from 'openpgp';
import storageABI from "../../../json/storageABI.json"
import miniManagerABI from "../../../json/miniManagerABI.json"
import daoABI from "../../../json/daoABI.json"
import feeABI from "../../../json/feeABI.json"
import CountdownComponent from '../../../components/countdown.jsx';
import CountdownComponentScrub from "../../../components/countdownScrub.jsx"
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import ContractTag from "../../../components/contractTag"
import { GrSatellite } from "react-icons/gr";
import { AiOutlineClose } from 'react-icons/ai'

import { PieChart, LineChart } from '@mui/x-charts'
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import { PiSignatureBold } from "react-icons/pi";
import { FaEthereum } from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import managerABI from "../../../json/managerABI.json"
import BounceLoader from "react-spinners/BounceLoader";
import { useSelector, useDispatch } from 'react-redux';

import type { RootState } from '../../../globalredux/store';
import { getData } from "../../../globalredux/Features/validator/valDataSlice"
import { attestationsData } from '../../../globalredux/Features/attestations/attestationsDataSlice';
import { getGraphPointsData } from "../../../globalredux/Features/graphpoints/graphPointsDataSlice"
import Link
    from 'next/link';

import Image from 'next/image';
import distributorABI from "../../../json/distributorABI.json"

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js"
import Footer from '../../../components/footer';
import { TiTick } from "react-icons/ti";


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


interface MyComponentProps {
    param1: string | string[] | undefined;
    param2: string | string[] | undefined;
}

const ValidatorDetail: NextPage = () => {


    const router = useRouter();
    const { param1, param2 } = router.query;


    const params: MyComponentProps = {
        param1: param1,
        param2: param2

    } // Accessing the 'id' parameter from the URL




    const { address } = useAccount({
        onConnect: ({ address }) => {
            console.log("Ethereum Wallet Connected!")




        }
    })




    const currentChain = useChainId();

    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        if (!isInitialRender && address !== undefined) {
            // This block will run after the initial render

            getMinipoolData();




        } else {
            // This block will run only on the initial render

            setIsInitialRender(false);
        }
    }, [currentChain, address]);



    const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"

    const nullAddress = "0x0000000000000000000000000000000000000000";

    const beaconAPIKey = process.env.BEACON
    const holeskyRPCKey = process.env.HOLESKY_RPC
    const mainnetRPCKey = process.env.MAINNET_RPC


    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch()

    //Ace


    const reduxData = useSelector((state: RootState) => state.valData.data[params.param1 !== null && params.param2 !== null ? Number(params.param2) : 0]);
    const reduxGraphPoints = useSelector((state: RootState) => state.graphPointsData.data[params.param1 !== null && params.param2 !== null ? Number(params.param2) : 0]);
    const reduxAttestations = useSelector((state: RootState) => state.attestationsData.data[params.param1 !== null && params.param2 !== null ? Number(params.param2) : 0])






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
        isEnabled: boolean
        valIndex: string
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
        activationEpoch: string
        smoothingPoolTruth: boolean
        withdrawalEpoch: string
        withdrawalCountdown: string
        feeRecipient: string

        graffiti: string
        isEnabled: boolean
        valIndex: string
        nodeAddress: string
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



    const getBeaconchainStatusObject = async (pubkey: string) => {


        let newObject;

        const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`


        await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
            method: "GET",
        })
            .then(async response => {

                var jsonString = await response.json()// Note: response will be opaque, won't contain data



                newObject = jsonString.data

            })
            .catch(error => {
                // Handle error here
                console.log(error);
            });





        return newObject


    }



    const [checked2, setChecked2] = useState(false)

    const [timeToStake, setTimeToStake] = useState(false)







    const getMinipoolData = async () => {


        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner();
        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));
        const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


        //Get latest index

        const newNextIndex = await fetch(`https://api.vrün.com/${currentChain}/${address}/nextindex`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json"
            },
        }).then(async response => {

            var jsonString = await response.json()


            console.log("Result of get next index" + jsonString)


            return jsonString;

        }).catch(error => {

            console.log(error);
        });





        //Get all pubkeys

        let attachedPubkeyArray: Array<Array<string>> = [];


        for (let i = 0; i <= newNextIndex - 1; i++) {



            await fetch(`https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(async response => {

                    let pubkey = await response.json()









                    let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey)








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



        }



        let minipoolObjects: Array<rowObject> = [];

        let seperateMinipoolObjects: Array<rowObject2> = [];

        let newRunningVals = 0;
        let newTotalVals = 0;





        for (const [minAddress, pubkey] of attachedPubkeyArray) {


            if (minAddress === "Null minipool" ) {

                seperateMinipoolObjects.push({
                    address: "NO VALIDATORS checked",
                    statusResult: "Empty",
                    statusTimeResult: "",
                    timeRemaining: "",
                    graffiti: "",
                    beaconStatus: "",
                    activationEpoch: "",
                    smoothingPoolTruth: false,
                    withdrawalEpoch: "",
                    withdrawalCountdown: "",
                    feeRecipient: "",

                    valBalance: "",
                    valProposals: "",
                    valDayVariance: "",
                    pubkey: pubkey,
                    isEnabled: false,
                    valIndex: "",
                    nodeAddress: ""

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


                setTimeToStake(Date.now() - numStatusTime > 0 ? false : true)


                const string = formatTime(timeRemaining);

                console.log("Time Remaining:" + string);


                const printGraff = await getGraffiti(pubkey);

                const isEnabled = await getEnabled(pubkey)



                type statusType = {

                    index: string,
                    balance: string,
                    status: string,
                    validator: {
                        pubkey: string,
                        withdrawal_credentials: string,
                        effective_balance: string,
                        slashed: boolean,
                        activation_eligibility_epoch: string,
                        activation_epoch: string,
                        exit_epoch: string,
                        withdrawable_epoch: string

                    }
                }

                let beaconStatusObject: statusType = {
                    index: "",
                    balance: "",
                    status: "",
                    validator: {
                        pubkey: "",
                        withdrawal_credentials: "",
                        effective_balance: "",
                        slashed: false,
                        activation_eligibility_epoch: "",
                        activation_epoch: "",
                        exit_epoch: "",
                        withdrawable_epoch: ""
                    }
                }

                let newBeaconStatusObject = await getBeaconchainStatusObject(pubkey)

                beaconStatusObject = newBeaconStatusObject !== undefined ? newBeaconStatusObject : beaconStatusObject;
                const beaconStatus = typeof beaconStatusObject === "object" ? beaconStatusObject.status : "";
                const activationEpoch = beaconStatusObject !== undefined ? beaconStatusObject.validator.activation_epoch : "";
                const withdrawalEpoch = beaconStatusObject !== undefined ? beaconStatusObject.validator.withdrawable_epoch : "";
                const valIndex = beaconStatusObject !== undefined ? beaconStatusObject.index : "";


                const genesisTime = 1695902400 * 1000;

                const theTime = Date.now()

                const currentEpoch = Math.ceil((theTime - genesisTime) / 12 / 32 / 1000)
      
                const withdrawalCountdown = (Number(withdrawalEpoch) - Number(currentEpoch)) * 12 * 32 * 1000;

                const smoothingBool = await getMinipoolTruth(pubkey)

                const newFeeRecipient = await getFeeRecipient(pubkey, smoothingBool)

                let beaconObject = [];
                let newValProposals = 0;
                let newValBalance = 0;
                let newValVariance = 0;


                setChecked2(smoothingBool)

                if (MinipoolStatus[statusResult] === "Staking" && beaconStatus !== "") {

                    beaconObject = await getValBeaconStats(pubkey)

                    if (beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" ||  beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") {
                        newValBalance = beaconObject[0].end_balance


                    }





                    for (const beaconLog of beaconObject) {

                        let blocks = beaconLog.proposed_blocks

                        newValProposals += blocks
                    }

                    if (beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || 
                    beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") {

                        newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance

                    }
                }






                seperateMinipoolObjects.push({
                    address: minAddress,
                    statusResult: currentStatus,
                    statusTimeResult: numStatusTime.toString(),
                    timeRemaining: timeRemaining.toString(),
                    graffiti: typeof printGraff === "string" ? printGraff : "",
                    beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",



                    valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
                    valProposals: newValProposals.toString(),
                    valDayVariance: ethers.formatUnits(newValVariance, "gwei").toString(),
                    isEnabled: isEnabled,
                    valIndex: valIndex,
                    activationEpoch: activationEpoch !== undefined ? activationEpoch : "",
                    smoothingPoolTruth: smoothingBool,
                    withdrawalEpoch: withdrawalEpoch,
                    withdrawalCountdown: withdrawalCountdown.toString(),
                    feeRecipient: newFeeRecipient,
                    pubkey: pubkey,
                    nodeAddress: address !== undefined ? address.toString() : ""
                })





            }



        }




        dispatch(getData(seperateMinipoolObjects))





    }







    const [currentFeeRecipient, setCurrentFeeRecipient] = useState("")
    const [currentActivationEpoch, setCurrentActivationEpoch] = useState("")



    const getFeeRecipient = async (pubkey: string, bool: boolean) => {





        let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await browserProvider.getSigner()
        const storageContract = new ethers.Contract(storageAddress, storageABI, signer);
        const distributorAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeDistributorFactory"))
        const distributorContract = new ethers.Contract(distributorAddress, distributorABI, signer);











        let feeRecipient;

        if (bool) {


            feeRecipient = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketSmoothingPool"))







        } else {


            feeRecipient = await distributorContract.getProxyAddress(address);



        }


        return feeRecipient



    }

    const getBeaconchainActivation = async (pubkey: string) => {


        let newString;

        const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`


        await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
            method: "GET",
        })
            .then(async response => {

                var jsonString = await response.json()// Note: response will be opaque, won't contain data



                newString = jsonString.data.validator.activation_epoch

            })
            .catch(error => {
                // Handle error here
                console.log(error);
            });




        if (newString !== undefined) {

            return newString

        }


    }















    const getEnabled = async (pubkey: string) => {





        const enabled = await fetch(`https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetEnabled&start=-1`, {
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


    const getGraffiti = async (pubkey: string) => {





        const graffiti = await fetch(`https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetGraffiti&start=-1`, {
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

        const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`




        await fetch(`${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`, {
            method: "GET",
        })
            .then(async response => {

                var jsonString = await response.json()// Note: response will be opaque, won't contain currentData



                newString = jsonString.data.status

                console.log("Activation Epoch:" + jsonString)
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


        try {

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




            await fetch(`https://api.vrün.com/${currentChain}/${address}/0`, {
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



                getMinipoolData();





            }

        } catch (e: any) {

            if (e.reason !== undefined) {
                setStakeErrorMessage(e.reason)


            } else if (e.error["message"]) {
                setStakeErrorMessage(e.error["message"].toString())
            } else {
                setStakeErrorMessage("An Unknown error occured.")

            }


        }

    }


    const [stakeErrorMessage, setStakeErrorMessage] = useState("")

    const [distributeErrorBoxText, setDistributeErrorBoxText] = useState("")


    useEffect(() => {


        if (stakeErrorMessage !== "") {


            const handleText = () => {
                setStakeErrorMessage("")

            }


            const timeoutId = setTimeout(handleText, 6000);

            return () => clearTimeout(timeoutId);




        }

    }, [stakeErrorMessage])



    useEffect(() => {


        if (distributeErrorBoxText !== "") {


            const handleText = () => {
                setDistributeErrorBoxText("")

            }


            const timeoutId = setTimeout(handleText, 6000);

            return () => clearTimeout(timeoutId);




        }

    }, [distributeErrorBoxText])



    const distributeBalanceOfMinipool = async () => {


        try {

            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()
            const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





            const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

            const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


            const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


            console.log("Mini Address:" + minipoolAddress)
            const minipool = new ethers.Contract(minipoolAddress, ['function distributeBalance(bool)'], signer)
            await minipool.distributeBalance(false)

            getMinipoolData();

        } catch (e: any) {

            if (e.reason === "rejected") {
                setDistributeErrorBoxText(e.reason.toString())

            }
            else {
                setDistributeErrorBoxText(e.error["message"].toString())
            }



        }



    }


    const [closeDissolvedErrorMessage, setCloseDissolvedErrorMessage] = useState("")



    useEffect(() => {


        if (closeDissolvedErrorMessage !== "") {


            const handleText = () => {
                setCloseDissolvedErrorMessage("")

            }


            const timeoutId = setTimeout(handleText, 6000);

            return () => clearTimeout(timeoutId);




        }

    }, [closeDissolvedErrorMessage])




    const closeMinipool = async () => {


        try {

            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()
            const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





            const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

            const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


            const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


            console.log("Mini Address:" + minipoolAddress)
            const minipool = new ethers.Contract(minipoolAddress, ['function close()'], signer)
            const returnValue = await minipool.close()

            getMinipoolData()
            alert(returnValue)
            console.log(returnValue)

        } catch (e: any) {


            if (e.reason !== undefined) {
                setCloseDissolvedErrorMessage(e.reason.toString());


            } else if (e.error["message"]) {
                setCloseDissolvedErrorMessage(e.error["message"].toString())
            } else {
                setCloseDissolvedErrorMessage("An Unknown error occured.")

            }




        }






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


    const [graffitiError, setGraffitiError] = useState("");



    useEffect(() => {


        if (graffitiError !== "") {


            const handleText = () => {
                setGraffitiError("")

            }


            const timeoutId = setTimeout(handleText, 5000);

            return () => clearTimeout(timeoutId);




        }

    }, [graffitiError])




    const setGraffiti = async (index: number, pubkey: string, newGrafitti: string) => {


        try {

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
                    { name: 'pubkeys', type: 'bytes[]' },
                    { name: 'graffiti', type: 'string' },

                ]
            }


            const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
            const APItype = "SetGraffiti"

            const date = Math.floor(Date.now() / 1000);

            const value = { timestamp: date, pubkeys: [pubkey], graffiti: newGrafitti }


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
                    indices: [index]
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


            await getMinipoolData();
            setShowForm(false);

        } catch (error: any) {

            if (error.reason === "rejected") {
                setGraffitiError(error.info.error.message.toString())

            }
            else {
                setGraffitiError(error.error["message"].toString())
            }

        }

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






        const data: string = await fetch(`https://api.vrün.com/${currentChain}/${address}/${index}`, {
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



        const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`



        await fetch(`${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },
            body: exitMessage
        })
            .then(async response => {

                var resString = await response.text()// Note: response will be opaque, won't contain data

                console.log("POST exit message response" + resString)

                alert(resString)

                getMinipoolData();
                setShowForm4(false)
            })
            .catch(error => {
                // Handle error here
                console.log(error);

                alert(error)
            });





    }



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



    const getValBeaconStats = async (pubkey: string) => {




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

    const convertToGraphPlotPoints = () => {




        setTotalGraphPlotPoints(reduxGraphPoints);



    }






    useEffect(() => {

        if (TotalGraphPlotPoints) {

            console.log(TotalGraphPlotPoints)

            const xAxisDataArray = Array.from({ length: TotalGraphPlotPoints.length }, (_, i) => i + 1);
            setXAxisData(xAxisDataArray);



        }


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

        let slicedLabels: Array<number> = [];
        let slicedData: Array<number> = [];

        if (xAxisData && TotalGraphPlotPoints) {
            slicedLabels = xAxisData?.slice(0, sliceLength);


            slicedData = TotalGraphPlotPoints?.slice(0, sliceLength);
        }

        return {
            labels: xAxisData && TotalGraphPlotPoints ? slicedLabels.reverse() : slicedLabels,
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



    const charRef = useRef<any>(null);

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


        console.log(reduxData)

        if ( reduxData && reduxData.address !== "" && reduxData.address !== "NO VALIDATORS") {
            convertToGraphPlotPoints();

            setEnChecked(reduxData.isEnabled)
        }

    }, [reduxData])


    const [enChecked, setEnChecked] = useState(false)



    const handleEnCheckedInput = (e: any) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setEnChecked(checked)


    }

    useEffect(() => {
        console.log(enChecked)

    }, [enChecked])




    const toggleEnableDisable = async () => {


        if (typeof params.param1 === "string" && typeof params.param2 === "string") {


            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()










            const types = {
                SetEnabled: [
                    { name: 'timestamp', type: 'uint256' },
                    { name: 'pubkeys', type: 'bytes[]' },
                    { name: 'enabled', type: 'bool' },

                ]
            }


            const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
            const APItype = "SetEnabled"

            const date = Math.floor(Date.now() / 1000);

            const value = { timestamp: date, pubkeys: [params.param1], enabled: enChecked }


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

                    indices: [params.param2]
                })
            })
                .then(async response => {

                    var jsonString = await response.text()// Note: response will be opaque, won't contain data

                    console.log("Get Deposit Data response" + jsonString)

                    getMinipoolData();

                    alert("Enable/Disable sucessful")
                    setShowForm6(false)
                })
                .catch(error => {
                    // Handle error here
                    console.log(error);
                    setErrorBoxTest2(error)
                });




        }


    }






    const [showFormEffect, setShowFormEffect] = useState(false);
    const [showFormEffect2, setShowFormEffect2] = useState(false);
    const [showFormEffect4, setShowFormEffect4] = useState(false);

    useEffect(() => {


        setShowFormEffect(showForm);


    }, [showForm]);


    useEffect(() => {


        setShowFormEffect2(showForm2);


    }, [showForm2]);

    useEffect(() => {


        setShowFormEffect4(showForm4);


    }, [showForm4]);



    const [showForm6, setShowForm6] = useState(false);
    const [showFormEffect6, setShowFormEffect6] = useState(false);


    useEffect(() => {


        setShowFormEffect6(showForm6);


    }, [showForm6]);




    const [errorBoxText2, setErrorBoxTest2] = useState("")

    const [graphTimeout, setGraphTimeout] = useState(false)


    useEffect(() => {
        const timer = setTimeout(() => {
            setGraphTimeout(true);
        }, 500);

        return () => clearTimeout(timer); // Cleanup timeout if the component unmounts
    }, []);


    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && charRef.current !== undefined) {
                charRef.current.update();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);



    const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)





    return (
        <div style={{backgroundColor: reduxDarkMode? "#222": "white",  color: reduxDarkMode?  "white" : "#222"}} className="flex w-full h-auto flex-col gap-2 items-center justify-center  ">
            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
                    name="Vrün  | Nodes & Staking"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <Navbar />




            {address === undefined || reduxData.nodeAddress !== address ? (

                <div className='h-[100vh] w-full flex items-center gap-6 py-6 justify-center flex-col'>

                    <h1>Looks like you&apos;re not signed in or this link is expired! </h1>


                    <Link href="/">



                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                            Back to Home
                        </button>




                    </Link>



                </div>




            ) : (

                <>

                    {xAxisData ? (<>





                        {/* <div className="w-full flex flex-col justify-center items-center pt-10 pb-5">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Pubkey: </h2>


                            <span className='w-[80%] overflow-wrap break-word'>

                                <ContractTag pubkey={params?.param1} />

                            </span>


                    </div> */}

                        <div className="flex flex-col w-full items-center justify-center h-auto gap-[8vh] lg:h-[90vh]">

                            <div className="w-full flex flex-col justify-center items-center gap-6 pt-4 ">
                                <h2 className="text-4xl font-bold">Validator Detail</h2>

                            </div>

                            <div className="w-full h-auto lg:h-auto flex-col flex gap-[10vh] items-center justify-center lg:flex-row lg:pt-0 ">


                                <div className="h-auto w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-5 shadow-2xl md:h-auto ">

                                    <div className=" h-full w-full gap-4 overflow-hidden rounded-2xl ">

                                        <div style={{backgroundColor: reduxDarkMode?  "#333" : "#fff"}} className="flex items-center  h-full justify-center p-6  ">


                                            {graphData.labels.length > 0 || graphTimeout ? (


                                                <div  className="w-auto h-[auto]  flex flex-col items-center justify-center p-8 px-[6vh]">





                                                    <Line

                                                        data={graphData}
                                                        options={options}
                                                        onClick={onClick}
                                                        ref={charRef}

                                                    >



                                                    </Line>

                                                    <div className='flex gap-2 items-center my-2 mt-5 justify-center'>

                                                        <button onClick={() => { setGraphState("All") }} style={graphState === "All" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">All</button>
                                                        <button onClick={() => { setGraphState("Year") }} style={graphState === "Year" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">Year</button>
                                                        <button onClick={() => { setGraphState("Month") }} style={graphState === "Month" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4  ">Month</button>
                                                        <button onClick={() => { setGraphState("Week") }} style={graphState === "Week" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">Week</button>



                                                    </div>
                                                    <p className=" w-[100%] self-center text-wrap text-md py-2 text-gray-500">Claim Your Validator rewards on <a className="font-bold hover:text-blue-300 cursor-pointer" target="_blank" href="https://rocketsweep.app/">rocketsweep.app</a></p>

                                                </div>
                                            ) : (


                                                <div className="w-auto h-[auto] gap-2  flex flex-col items-center justify-center p-8 px-[6vh]">


                                                    <h3>Please wait while we retrieve your rewards data...</h3>

                                                    <BounceLoader />

                                                </div>)}

                                        </div>
                                    </div>
                                </div>






                                <div className="xl:flex xl:flex-row lg:flex-col w-[auto] items-center justify-center xl:gap-5 lg:gap-5">






                                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">




                                        <div className="flex items-center p-6 shadow-xl border rounded-lg">

                                            <div>

                                                <span className='text-green-500 text-lg  font-bold' style={Number(reduxData.valDayVariance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>
                                                    {Number(reduxData.valDayVariance) > 0 ? (
                                                        <div className='flex items-center justify-center'>
                                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12  bg-green-100 rounded-full mr-3">
                                                                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>

                                                            </div>

                                                            <div className="px-3">
                                                                <h3 style={{ color: reduxDarkMode?  "white" : "#222"}} className="block text-md font-bold ">Daily ETH Tracker:</h3>

                                                                <p className="text-green-600"> {reduxData.valDayVariance}</p>

                                                            </div>

                                                        </div>


                                                    ) : (
                                                        <div className='flex items-center justify-center'>
                                                            {reduxData.valDayVariance !== "" && <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12  bg-red-100 rounded-full mr-6">
                                                                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                                </svg>
                                                            </div>}

                                                            <div>
                                                                <h3 style={{ color: reduxDarkMode?  "white" : "#222"}} className="block text-md font-bold">Daily ETH Tracker:</h3>

                                                                <p className='text-red-600'>{reduxData.valDayVariance !== "" && reduxData.valDayVariance}</p>

                                                            </div>

                                                        </div>
                                                    )}

                                                </span>
                                            </div>
                                        </div>



                                        <div className="flex items-center p-6  shadow-xl border rounded-lg">
                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                                                <GrSatellite className="text-yellow-500 text-2xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-start flex-col gap-1 text-l ">

                                                    <h3 className='block text-lg  font-bold'>Validator Status:</h3>


                                                    {reduxData.statusResult === "Staking" ? (

                                                        <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>) :
                                                        (
                                                            <p className="text-yellow-500  text-md">{reduxData.statusResult.toLowerCase()}</p>

                                                        )}


                                                    {reduxData.statusResult === "Prelaunch" &&
                                                        <>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.timeRemaining} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until this Validator can be Staked</p>


                                                        </>
                                                    }

                                                    {(reduxData.beaconStatus === "active_exiting" || reduxData.beaconStatus === "exited_unslashed" || reduxData.beaconStatus === "withdrawal_possible") &&
                                                        <>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.withdrawalCountdown} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until the balance of your Validator can be Withdrawn</p>


                                                        </>
                                                    }




                                                    {/*reduxData.statusResult === "Staking" && reduxData.beaconStatus !== "active_staking" &&
                                                        <>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.timeRemaining} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until the next stage...</p>




                                                        </>
                                                */}
                                                    {reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) <= 0 &&

                                                        <button onClick={() => { stakeMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake Minipool</button>



                                                    }


                                                    {(reduxData.statusResult === "Staking" || reduxData.statusResult === "Dissolved") && reduxData.beaconStatus !== "" &&
                                                        <a className=" hover:text-blue-300  font-bold hover:text-blue-300 cursor-pointer text-md" href={`https://${currentChain === 17000 ? "holesky." : ""}beaconcha.in/validator/${reduxData.valIndex}`} target="_blank">View</a>
                                                    }
                                                </div>
                                            </div>
                                        </div>


                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">
                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <VscActivateBreakpoints className="text-blue-500 text-2xl" />

                                            </div>
                                            <div className='flex  gap-4 items-center justify-start w-full'>

                                                <div className='flex gap-1 flex-col items-start justify-center w-full'>

                                                    <span className="block text-lg font-bold">Enabled?</span>

                                                    {reduxData.isEnabled ? (

                                                        <div className="flex items-center justify-center  text-green-400 text-[18px]">   <p>Enabled</p> <TiTick /></div>

                                                    ) : (
                                                        <p className="text-red-400 text-[18px]">Disabled</p>

                                                    )}
                                                </div>

                                                <div className='w-full flex gap-2 text-xs items-start justify-start'>
                                                    <button onClick={() => { setShowForm6(true) }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md" >
                                                        Edit
                                                    </button>
                                                </div>


                                            </div>

                                        </div>








                                    </section>

                                </div>

                            </div>

                            <p className="font-bold text-lg text-red-400">{stakeErrorMessage || closeDissolvedErrorMessage}</p>


                        </div>


                        <div className='flex w-full h-auto flex-col pt-[10vh] justify-center items-center gap-6 lg:min-h-[80vh]'>

                            <div className="w-full my-5 mx-5 mb-1 overflow-hidden">
                                <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">

                                    <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
                                        <h3 className="text-4xl font-bold  ">Validator Actions</h3>


                                    </div>

                                </div>
                            </div>

                            <div className="xl:flex xl:flex-row lg:flex-col w-[auto] items-center justify-center xl:gap-5 lg:gap-5">

                                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 xl:grid-rows-2 gap-4">

                                    <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">
                                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                                            <PiSignatureBold className="text-purple-500 text-3xl" />
                                        </div>
                                        <div>
                                            <div className="flex items-start flex-col gap-1 text-l ">
                                                <span className="text-lg font-bold">Change Graffiti:</span>
                                                <p className="text-s mb-1 text-gray-600">    {reduxData.graffiti}</p>
                                                <button className="bg-blue-500 self-start  text-xs hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(reduxData.graffiti) }}>
                                                    Change
                                                </button>

                                            </div>
                                        </div>
                                    </div>


                                    {reduxData.statusResult === "Dissolved" &&

                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-lg font-bold">Close Failed Minipool</p>


                                                <button onClick={() => { closeMinipool() }} className="bg-red-500   text-xs  hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Close Minipool</button>
                                            </div>

                                        </div>

                                    }


                                    {reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) <= 0 &&
                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-lg font-bold">Stake Prelaunched Minipool</p>

                                                <button onClick={() => { stakeMinipool() }} className="bg-blue-500   text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake Minipool</button>
                                            </div>
                                        </div>
                                    }

                                    {reduxData.statusResult === "Staking" && (reduxData.beaconStatus === "active_ongoing" || reduxData.beaconStatus === "active_exiting" || reduxData.beaconStatus === "exited_unslashed" ||  reduxData.beaconStatus === "exited_slashed" || reduxData.beaconStatus === "active_slashed" || reduxData.beaconStatus === "withdrawal_possible" || reduxData.beaconStatus === "withdrawal_done") &&
                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-lg font-bold">Close Active Minipool</p>

                                                <button onClick={handlePostExitModal} className="bg-red-500  text-xs  hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Initiate Close</button>
                                            </div>
                                        </div>
                                    }


                                    {reduxData.beaconStatus === "withdrawal_done" && Number(reduxData.valBalance) > 0 && 
                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">
                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-lg font-bold">Distribute Minipool Balance</p>

                                                <button onClick={() => { distributeBalanceOfMinipool() }} className="bg-blue-500  text-xs  hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded-md">Distribute Balance</button>
                                            </div>
                                        </div>
                                    }



                                    {reduxData.statusResult !== "Empty" && (reduxData.beaconStatus === "active_ongoing" || reduxData.beaconStatus === "active_exiting" || reduxData.beaconStatus === "exited_unslashed" ||  reduxData.beaconStatus === "exited_slashed" || reduxData.beaconStatus === "active_slashed" || reduxData.beaconStatus === "withdrawal_possible" || reduxData.beaconStatus === "withdrawal_done") &&
                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>


                                            <div className="flex w-auto items-start flex-col gap-2 text-l ">


                                                <p className="text-lg font-bold width-[80%]">Get Presigned Exit Message</p>


                                                <button onClick={() => { handleGetPresignedModal() }} className="bg-yellow-500   text-xs  hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md">Get Exit Message</button>
                                            </div>
                                        </div>
                                    }








                                </section>


                            </div>
                            <div className='w-full h-[30px]  flex flex-col gap-2 items-center justify-center'>
                                {distributeErrorBoxText !== "" &&
                                    <p className=" w-full font-bold text-2xl text-center text-red-500 sm:text-l">{distributeErrorBoxText}</p>
                                }
                                {closeDissolvedErrorMessage !== "" &&
                                    <p className=" w-full font-bold text-2xl text-center text-red-500 sm:text-l">{closeDissolvedErrorMessage}</p>
                                }
                            </div>

                        </div>







                        <div className="w-full h-auto flex flex-col items-center justify-center  gap-[8vh] p-[10vh] ">
                            <div className="w-full overflow-hidden">
                                <div className="w-full flex flex-col items-center justify-center ">


                                    <h3 className="text-4xl font-bold ">Validator Info</h3>




                                </div>
                            </div>

                            <div className="flex  flex-col items-center justify-center gap-3 p-6 w-auto border h-auto shadow-xl rounded-lg">



                                <div className=' w-full flex flex-col items-start justify-center  gap-3 text-l '>
                                    <span className="text-2xl text-center font-bold">Pubkey:</span>

                                    <p className="text-wrap text-gray-400"><ContractTag pubkey={params?.param1} /></p>

                                </div>

                                <div className=' w-full flex flex-col items-start justify-center  gap-3 text-l '>
                                    <span className="text-2xl text-center  font-bold">Minipool Address:</span>
                                    <p className="text-wrap text-gray-400"> <ContractTag pubkey={reduxData.address} /></p>
                                </div>

                            </div>


                            <div className="w-[auto] h-[auto] overflow-hidden shadow-xl border rounded-lg mb-10 ">

                                <table className="w-full ">
                                    <tbody>

                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 text-white bg-gray-500 text-s font-bold w-auto text-center">
                                                <p>Graffiti</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">

                                                {reduxData.graffiti}

                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  bg-gray-500 text-white py-3 text-s font-bold w-auto text-center">
                                                <p>Balance</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.valBalance}
                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3  text-white bg-gray-500   text-s font-bold w-auto text-center">
                                                <p>Validator Index</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.valIndex}

                                            </td>
                                        </tr>

                                        <tr className="border-b-2 ">

                                            <td className="px-5  py-3 bg-gray-500 text-white text-s font-bold w-auto text-center">
                                                <p>Minipool Status:</p>

                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">


                                                {reduxData.statusResult === "Prelaunch" &&
                                                    <span className="py-1 font-semibold text-md leading-tight text-orange-700  rounded-sm">{reduxData.statusResult}</span>

                                                }


                                                {reduxData.statusResult === "Initialised" &&

                                                    <span className="py-1 font-semibold text-md leading-tight text-orange-700  rounded-sm">{reduxData.statusResult}</span>
                                                }

                                                {reduxData.statusResult === "Staking" &&

                                                    <span className="py-1 font-semibold text-md leading-tight text-green-700 rounded-sm">{reduxData.statusResult}</span>


                                                }


                                                {reduxData.statusResult === "Withdrawable" &&

                                                    <span className="py-1 font-semibold text-md leading-tight text-green-700  rounded-sm">{reduxData.statusResult}</span>


                                                }


                                                {reduxData.statusResult === "Dissolved" &&

                                                    <span className="py-1 font-semibold text-md leading-tight text-red-700  rounded-sm">{reduxData.statusResult}</span>


                                                }


                                                {reduxData.statusResult === "Empty" &&

                                                    <span className="py-1 font-semibold  text-md leading-tight text-greay-700  rounded-sm">{reduxData.statusResult}</span>

                                                }

                                            </td>
                                        </tr>


                                        <tr className="">
                                            <td className="px-5  py-3 bg-gray-500 text-white font-bold text-s w-auto text-center">
                                                <p>Activation Epoch</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.activationEpoch}

                                            </td>
                                        </tr>


                                    </tbody>
                                </table>


                            </div>



                        </div>












                        <Modal
                            isOpen={showForm}
                            onRequestClose={() => setShowForm(false)}
                            contentLabel="Single Graffiti Modal"
                            className={`${styles.modal} ${showFormEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state

                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: "999999999999999999999999999999999999",
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
                            <div className="flex relative w-full h-full flex-col rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowForm(false)
                                    }} />

                                </div>
                                <h2 className="text-[20px] font-bold">Graffiti Update</h2>


                                <input value={currentEditGraffiti} className="border border-black-200 text-black-500" type="text" onChange={handleGraffitiChange} />

                                <div >
                                    <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={confirmGraffiti}>Update</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>

                                {graffitiError !== "" &&
                                    <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">{graffitiError}</p>
                                }
                            </div>
                        </Modal>



                        <Modal
                            isOpen={showForm2}
                            onRequestClose={() => setShowForm2(false)}
                            contentLabel="Get Presigned Exit Modal"
                            className={`${styles.modal} ${showFormEffect2 ? `${styles.modalOpen}` : `${styles.modalClosed}`}`}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: "999999999999999999999999999999999999",
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
                            <div className="flex relative w-full h-full flex-col rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowForm2(false)
                                    }} />

                                </div>
                                <h2 className="text-[20px] font-bold">Get Presigned Exit Message</h2>

                                <input

                                    className="w-[60%] self-center border border-black-200 text-black-500"
                                    type="datetime-local"
                                    id="datetime"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                />


                                <label className="w-full flex items-center justify-center gap-2">
                                    <span className="font-bold">Encrypt your Exit Message?</span>
                                    <input
                                        type="checkbox"

                                        checked={checked}
                                        onChange={handleChecked}
                                    />
                                </label>

                                {checked && <>
                                    <h4>Enter Public Key:</h4>

                                    <textarea className="border " value={publicKeyArmored} onChange={handlePublicKeyArmored} />
                                </>}


                                <div >
                                    <button className="bg-[#7b3fe4] mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={confirmGetPresigned}>Generate</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm2(false)}>Cancel</button>
                                </div>
                            </div>
                        </Modal>




                        <Modal
                            isOpen={showForm4}
                            onRequestClose={() => setShowForm4(false)}
                            contentLabel="Post Presigned Exit Modal"
                            className={`${styles.modal} ${showFormEffect4 ? `${styles.modalOpen}` : `${styles.modalClosed}`}`}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: "999999999999999999999999999999999999",
                                },
                                content: {
                                    width: 'auto',
                                    height: 'auto',
                                    minWidth: "280px",
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
                            <div className="flex relative w-full h-full flex-col rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowForm4(false)
                                    }} />

                                </div>
                                <h2 className="text-[20px] font-bold">Post Presigned Exit Message</h2>


                                <p>WARNING!: Submitting this exit message will mean this validator will begin the exit process. </p>





                                <textarea className="border h-[200px] " value={exitMessage} onChange={handleChangeExitMessage} />



                                <div>
                                    <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={postPresignedExitMessage}>Post</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm4(false)}>Cancel</button>
                                </div>
                            </div>
                        </Modal>


                        <Modal
                            isOpen={showForm6}
                            onRequestClose={() => setShowForm6(false)}
                            contentLabel="Smoothing Pool Opt Modal"
                            className={`${styles.modal} ${showFormEffect6 ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                                        setShowForm6(false)
                                    }} />

                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Do you want this Validator to be active?</h2>





                                <div className="flex items-center justify-center w-full gap-4">

                                    <label className="flex items-center justify-center gap-1">
                                        <input
                                            type="radio"
                                            name="optIn"
                                            checked={enChecked === true}
                                            onChange={() => setEnChecked(true)}
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center justify-center gap-1">
                                        <input
                                            type="radio"
                                            name="optIn"
                                            checked={enChecked === false}
                                            onChange={() => setEnChecked(false)}
                                        />
                                        No
                                    </label>
                                </div>


                                <div className='w-full flex gap-2 items-center justify-center'>
                                    <button onClick={() => { toggleEnableDisable() }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                                        Confirm Changes
                                    </button>
                                </div>

                                {errorBoxText2 !== "" &&
                                    <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">{errorBoxText2}</p>
                                }




                            </div>


                        </Modal>

                    </>) : (

                        <div className='h-[100vh] w-full flex items-center gap-2 justify-center flex-col'>

                            <h3>Please wait while we retrieve your validator detail...</h3>

                            <BounceLoader />


                        </div>




                    )}

                </>



            )}





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






            <Footer />  </div>
    )
}

export default ValidatorDetail