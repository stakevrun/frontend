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
import { FaDiscord } from "react-icons/fa";
import daoABI from "../../../json/daoABI.json"
import feeABI from "../../../json/feeABI.json"
import CountdownComponent from '../../../components/countdown.jsx';
import CountdownComponentScrub from "../../../components/countdownScrub.jsx"
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import ContractTag from "../../../components/contractTag"
import { GrSatellite } from "react-icons/gr";
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { FaSignature } from "react-icons/fa";
import { PieChart, LineChart } from '@mui/x-charts'
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import { PiSignatureBold } from "react-icons/pi";
import { FaEthereum } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
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
import confetti from 'canvas-confetti';

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
import { BiSolidErrorAlt } from "react-icons/bi";



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

    const [triggerNewAccount, setTriggerNewAccount] = useState(false)

    useEffect(() => {




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


                if (minAddress === "Null minipool") {



                    seperateMinipoolObjects.push({
                        address: address !== undefined ? address.toString() : "",
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
                        minipoolBalance: "",
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


                    let currentStatus = "";

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

                    const balance = await browserProvider.getBalance(minAddress)

                    let beaconObject = [];
                    let newValProposals = 0;
                    let newValBalance = 0;
                    let newValVariance = 0;





                    setChecked2(smoothingBool)

                    if (MinipoolStatus[statusResult] === "Staking" && beaconStatus !== "") {

                        beaconObject = await getValBeaconStats(pubkey)

                        if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject) {
                            newValBalance = beaconObject[0].end_balance


                            for (const beaconLog of beaconObject) {

                                let blocks = beaconLog.proposed_blocks
    
                                newValProposals += blocks
                            }


                        } else {

                            newValBalance = 0

                        }





                    

                        if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" ||
                            beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject) {

                            newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance

                        }
                    }






                    if (Number(ethers.formatEther(balance)) === 0 && beaconStatus === "withdrawal_done") {

                        currentStatus = "Empty"



                    } else {

                        currentStatus = MinipoolStatus[statusResult];

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
                        minipoolBalance: ethers.formatEther(balance),
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

        if (!isInitialRender && address !== undefined) {
            // This block will run after the initial render
            dispatch(getData([{ address: "NO VALIDATORS" }]))
            setTriggerNewAccount(true)





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
        minipoolBalance: string
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



    type rewardDataEntry = {
        income: bigint
        epoch: bigint
    }





    const [tableRewards, setTableRewards] = useState<Array<rewardDataEntry>>([])
    const [attestationPercentage, setAttestationPercentage] = useState(0)





    function roundToTwoDecimalPlaces(numStr: number) {
        // Convert the string to a number
        
        
        // Round the number to two decimal places
        let roundedNum = Math.round(numStr * 100) / 100;
        
        return roundedNum;
    }





    useEffect(() => {


        const getLiveAttestations = async () => {



            const chainString = currentChain === 17000 ? 'holesky.' : ''
            //https://holesky.beaconcha.in/api/v1/validator/0x95430e09327ffefdeba2b4ad4559422457f58dc642aba1c5ccc411ffc0a107b6d81bfc3063bf3cea9401b722b9d39f09/attestations





            const attestations = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/${param1}/attestations`, {
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

                    setAttestationPercentage(0);

                    return;
                });




            let successes = 0;
            let failures = 0;

            if (attestations !== undefined && attestations !== null) {

                for (const attestObject of attestations) {

                    if (attestObject.status === 0) {

                        failures += 1

                        console.log("One")

                 



                    }


                    if (attestObject.status === 1) {

                        successes += 1
                     

                    }


                }




                console.log("SUCCESSES:" + successes)
                console.log("FAILURES:" + failures)
                console.log("failures divided by successes x 100:" + ((failures / successes) * 100))


                const percentage = 100 - ((failures / successes) * 100)


                setAttestationPercentage(percentage)


            }




        }













        const getLiveRewards = async () => {



            const chainString = currentChain === 17000 ? 'holesky.' : ''
            //https://holesky.beaconcha.in/api/v1/validator/0x95430e09327ffefdeba2b4ad4559422457f58dc642aba1c5ccc411ffc0a107b6d81bfc3063bf3cea9401b722b9d39f09/attestations





            const rewards = await fetch(`https://${chainString}beaconcha.in/api/v1/validator/${param1}/incomedetailhistory`, {
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
                    setTableRewards([]);

                    return;
                });


            console.log("LIVE REWARDS:" + rewards);



            let newRewardsArray = [];

            if (rewards !== undefined && rewards !== null) {
                for (const object of rewards) {




                    let totalIncome = (object.income.attestation_source_reward !== undefined ? object.income.attestation_source_reward : 0) + (object.income.attestation_target_reward !== undefined ? object.income.attestation_target_reward : 0) + (object.income.attestation_head_reward !== undefined ? object.income.attestation_head_reward : 0);

                    console.log(object.income.attestation_source_reward)
                    console.log(object.income.attestation_target_reward)
                    console.log(object.income.attestation_head_reward)



                    newRewardsArray.push({ income: totalIncome, epoch: object.epoch })





                }


                console.log("New Rewards Array:" + newRewardsArray)


                setTableRewards(newRewardsArray)

            }








        }



        getLiveAttestations();
        getLiveRewards();

    }, [param1])










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


            if (minAddress === "Null minipool") {



                seperateMinipoolObjects.push({
                    address: address !== undefined ? address.toString() : "",
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
                    minipoolBalance: "",
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


                let currentStatus = "";

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

                const balance = await browserProvider.getBalance(minAddress)

                let beaconObject = [];
                let newValProposals = 0;
                let newValBalance = 0;
                let newValVariance = 0;





                setChecked2(smoothingBool)

                if (MinipoolStatus[statusResult] === "Staking" && beaconStatus !== "") {

                    beaconObject = await getValBeaconStats(pubkey)

                    if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject) {
                        newValBalance = beaconObject[0].end_balance

                        
                    for (const beaconLog of beaconObject) {

                        let blocks = beaconLog.proposed_blocks

                        newValProposals += blocks
                    }

                    } else {

                        newValBalance = 0

                    }






                    if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" ||
                        beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject) {

                        newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance

                    }
                }






                if (Number(ethers.formatEther(balance)) === 0 && beaconStatus === "withdrawal_done") {

                    currentStatus = "Empty"



                } else {

                    currentStatus = MinipoolStatus[statusResult];

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
                    minipoolBalance: ethers.formatEther(balance),
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


    const setIncrementerWithDelay = (value: number, delay: number) => {
        setTimeout(() => {
            setIncrementer(value);
        }, delay);
    };



    const [turnOffStakeButton, setTurnOffStakeButton] = useState(true)

    function delayedExecution() {
        setTimeout(() => {
            setTriggerNewAccount(true);
            dispatch(getData([{ address: "NO VALIDATORS" }]));
        }, 4000); // 10000 milliseconds = 10 seconds
    }



    const stakeMinipool = async () => {

        setIncrementer(0)
        setShowFormStakeMinipool(true);


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
            setIncrementer(1)

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



            // Call the function to start the delayed execution





            await fetch(`https://api.vrün.com/${currentChain}/${address}/${params.param2}`, {
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
                    setIncrementer(2)


                })
                .catch(error => {
                    // Handle error here
                    console.log(error);
                });

            if (canStakeResult) {






                const tx = await minipool.stake(depositSignature, depositDataRoot);



                const receipt = await tx.wait()


                if (receipt.status === 1) {

                    setIncrementer(3)


                    setTurnOffStakeButton(false)

                    setIncrementerWithDelay(4, 1500);

                    delayedExecution();


                } else {

                    setIncrementer(5)


                    setStakeErrorMessage("An unknown error has occured. Please try again.")




                }




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




                const tx = await minipool.stake(depositSignature, depositDataRoot);



                const receipt = await tx.wait()


                if (receipt.status === 1) {

                    setIncrementer(3)

                    setTurnOffStakeButton(false)


                    setIncrementerWithDelay(4, 1500);

                    delayedExecution();


                } else {

                    setIncrementer(5)


                    setStakeErrorMessage("An unknown error has occured. Please try again.")




                }




            }

        } catch (e: any) {
            setIncrementer(5)

            if (e.reason !== undefined) {
                setStakeErrorMessage(e.reason)


            } else if (e.error) {
                setStakeErrorMessage(e.error["message"].toString())
            } else {
                setStakeErrorMessage("An Unknown error occured.")

            }


        }

    }


    const [stakeErrorMessage, setStakeErrorMessage] = useState("")

    const [distributeErrorBoxText, setDistributeErrorBoxText] = useState("")











    const [turnOffDistributeButton, setTurnOffDistributeButton] = useState(true)



    const distributeBalanceOfMinipool = async () => {


        setShowFormDistribute(true)
        setIncrementer(0)


        try {

            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()
            const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





            const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

            const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


            const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


            console.log("Mini Address:" + minipoolAddress)
            const minipool = new ethers.Contract(minipoolAddress, ['function distributeBalance(bool)'], signer)
            const tx = await minipool.distributeBalance(false)

            setIncrementer(1)



            const receipt = await tx.wait();



            console.log("Transaction confirmed:", receipt);



            if (receipt.status === 1) {

                setTurnOffDistributeButton(false)

                setIncrementer(2)





                const data = await getMinipoolData();


                setIncrementerWithDelay(4, 300)
                delayedExecution()


            } else {

                setIncrementer(5)
                setDistributeErrorBoxText("An Unknown error has occured. Please try again.")





            }


        } catch (e: any) {

            if (e.reason) {
                setDistributeErrorBoxText(e.reason.toString())

            }
            else if (e.error) {
                setDistributeErrorBoxText(e.error["message"].toString())
            } else {
                setDistributeErrorBoxText("An Unknown error occured")

            }

            setIncrementer(5)



        }



    }


    const [closeDissolvedErrorMessage, setCloseDissolvedErrorMessage] = useState("")


    const [turnOffCloseButton, setTurnOffCloseButton] = useState(false)





    const closeMinipool = async () => {


        setShowFormDissolve(true)
        setIncrementer(0)


        try {

            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
            let signer = await browserProvider.getSigner()
            const storageContract = new ethers.Contract(storageAddress, storageABI, signer);





            const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

            const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


            const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(params.param1);


            console.log("Mini Address:" + minipoolAddress)
            const minipool = new ethers.Contract(minipoolAddress, ['function close()'], signer)
            const tx = await minipool.close()

            setIncrementer(1)


            const receipt = await tx.wait()

            if (receipt.status === 1) {

                setTurnOffCloseButton(false)

                setIncrementer(2)

                const data = await getMinipoolData();



                setIncrementerWithDelay(4, 300)
                delayedExecution()


            } else {

                setIncrementer(5)
                setCloseDissolvedErrorMessage("An Unknown error has occured. Please try again.")

            }






        } catch (e: any) {


            if (e.reason) {
                setCloseDissolvedErrorMessage(e.reason.toString());


            } else if (e.error) {
                setCloseDissolvedErrorMessage(e.error["message"].toString())
            } else {
                setCloseDissolvedErrorMessage("An Unknown error occured.")

            }


            setIncrementer(5)

        }






    }




    const [validatorsInNeedOfAction, setValidatorsInNeedOfAction] = useState({
        withdrawn: 0,
        stake: 0,
        close: 0
    })


    const [showFormAlert, setShowFormAlert] = useState(false)
    const [showFormAlertEffect, setShowFormAlertEffect] = useState(false)


    useEffect(() => {


        setShowFormAlertEffect(showFormAlert);


    }, [showFormAlert]);

    const [modalRendered, setModalRendered] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    const handleScrollToElement = () => {

        if (targetRef.current) {
            setShowFormAlert(false);
            window.scrollTo({
                top: targetRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {

        if ((validatorsInNeedOfAction.close > 0 || validatorsInNeedOfAction.withdrawn > 0 || validatorsInNeedOfAction.stake > 0) && modalRendered === false) {

            setShowFormAlert(true)


            setModalRendered(true)

        }

    }, [validatorsInNeedOfAction])




    const getValidatorsInNeedOfAction = () => {

        let withdrawnNum = 0;
        let stakeNum = 0;
        let closeNum = 0;





        if (reduxData.beaconStatus === "withdrawl_done" && Number(reduxData.minipoolBalance) > 0) {
            withdrawnNum += 1
        }

        if (reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) <= 0 && Number(reduxData.minipoolBalance) > 0) {
            stakeNum += 1

        }

        if (reduxData.statusResult === "Dissolved") {
            closeNum += 1
        }



        return {
            withdrawn: withdrawnNum,
            stake: stakeNum,
            close: closeNum


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


        setShowForm(false);
        setShowFormEditGraffiti(true)
        setIncrementer(0)

        if (newGrafitti !== "") {
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
                        setGraffitiError(error.toString())
                        setIncrementer(5)
                    });


                setIncrementer(1)
                const data = await getMinipoolData();

                setIncrementer(2)


                setIncrementerWithDelay(4, 400)

            } catch (e: any) {

                if (e.reason === "rejected") {
                    setGraffitiError(e.info.error.message.toString())

                } else if (e.error) {
                    setGraffitiError(e.error["message"].toString())

                }
                else {
                    setGraffitiError("An Unknown error occured, please try again")
                }
                setIncrementer(5)

            }


        } else {
            setIncrementer(5)
            setGraffitiError("You must input a new Graffiti!")
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



    const [presignedShortcutData, setPresignedShortcutData] = useState("")






    useEffect(() => {


        if (!isInitialRender) {


            postPresignedExitMessageShortcut()



        } else {

            setIsInitialRender(false)


        }



    }, [presignedShortcutData])



    const getPresignedExitMessageShortcut = async (pubkey: string, index: number) => {


        try {





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
                const theTime = Date.now() - 1000000000

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
                setPresignedShortcutData(data);
                setIncrementer(1)

            } else {
                setIncrementer(5)


                setPostPresignedShortcutErrorBoxText("Data from Get Message call undefined. Please try again.")


            }


        } catch (e: any) {


            setIncrementer(5)

            if (e.reason !== undefined) {
                setPostPresignedShortcutErrorBoxText(e.reason.toString());


            } else if (e.error) {
                setPostPresignedShortcutErrorBoxText(e.error["message"].toString())
            } else {
                setPostPresignedShortcutErrorBoxText("An Unknown error occured.")

            }



        }

    }


    const [turnOffPostButtons, setTurnOffPostButtons] = useState(true)



    const postPresignedExitMessageShortcut = async () => {



        const currentRPC = currentChain === 17000
            ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
            : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

        const handleError = (message: string) => {
            setPostPresignedShortcutErrorBoxText(message);
            setIncrementer(5);
        };


        console.log("POST PRESIGNED AT THE TIME OF POSTING IN SHORTCUT:" + presignedShortcutData)

        try {
            const response = await fetch(`${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: presignedShortcutData
            });

            if (response.status === 200) {

                setTurnOffPostButtons(false)
                setIncrementer(2);
                const data = await getMinipoolData();
                setIncrementerWithDelay(4, 700);
                delayedExecution();

            }

            const resString = await response.text();
            console.log("POST exit message response: ", Object.entries(response));

            if (resString) {
                try {
                    const convertedObject = JSON.parse(resString);
                    console.log("Post Presigned Converted Object: ", convertedObject);
                    console.log("Type of convertedObject: ", typeof convertedObject);

                    if (typeof convertedObject === "object" && convertedObject !== null && convertedObject.message) {
                        handleError(convertedObject.message);
                        return;
                    }
                } catch (e) {
                    // If JSON parsing fails, handle as a plain string error
                    handleError(resString);
                    return;
                }
            }

            // Successful transaction case

        } catch (e: any) {
            if (e.reason) {
                handleError(e.reason.toString());
            } else if (e.error) {
                handleError(e.error["message"].toString());
            } else {
                handleError("An unknown error occurred.");
            }
        }
    };







    const getPresignedExitMessage = async (pubkey: string, index: number) => {


        try {


            setIncrementer(0)
            setShowForm2(false)
            setShowFormGetPresigned(true)



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
                setIncrementer(1)
                setIncrementerWithDelay(4, 700)
            } else {
                setIncrementer(5)
                setGetPresignedErrorBoxText("An Unknown error occured, data was undefined.");


            }


        } catch (e: any) {

            if (e.reason !== undefined) {
                setGetPresignedErrorBoxText(e.reason.toString());


            } else if (e.error) {
                setGetPresignedErrorBoxText(e.error["message"].toString())
            } else {
                setGetPresignedErrorBoxText("An Unknown error occured.")

            }

            setIncrementer(5)

        }

    }


    const [showFormConfirmPostPresigned, setShowFormConfirmPostPresigned] = useState(false)
    const [showFormConfirmPostPresignedEffect, setShowFormConfirmPostPresignedEffect] = useState(false)


    useEffect(() => {


        setShowFormConfirmPostPresignedEffect(showFormConfirmPostPresigned);


    }, [showFormConfirmPostPresigned]);



    const confirmPostPresigned = () => {
        setShowFormConfirmPostPresigned(true)
        setShowForm4(false)

    }





    const postPresignedExitMessage = async () => {
        setShowFormConfirmPostPresigned(false);
        setIncrementer(0);
        setShowFormPostPresigned(true);

        const currentRPC = currentChain === 17000
            ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
            : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

        const handleError = (message: string) => {
            setPostPresignedErrorBoxText(message);
            setIncrementer(5);
        };

        try {
            const response = await fetch(`${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: exitMessage
            });

            if (response.status === 200) {
                setIncrementer(1);

                setTurnOffPostButtons(false)

                setIncrementerWithDelay(4, 700);

                delayedExecution()

            }

            const resString = await response.text();
            console.log("POST exit message response: ", Object.entries(response));

            if (resString) {
                try {
                    const convertedObject = JSON.parse(resString);
                    console.log("Post Presigned Converted Object: ", convertedObject);
                    console.log("Type of convertedObject: ", typeof convertedObject);

                    if (typeof convertedObject === "object" && convertedObject !== null && convertedObject.message) {
                        handleError(convertedObject.message);
                        return;
                    }
                } catch (e) {
                    // If JSON parsing fails, handle as a plain string error
                    handleError(resString);
                    return;
                }
            }

            // Successful transaction case

        } catch (e: any) {
            if (e.reason) {
                handleError(e.reason.toString());
            } else if (e.error) {
                handleError(e.error["message"].toString());
            } else {
                handleError("An unknown error occurred.");
            }
        }
    };





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





    const [isPresignedPosted, setIsPresignedPosted] = useState(false)







    useEffect(() => {


        const getPostedPresignedLog = async () => {


            const currentRPC = currentChain === 17000
                ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
                : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;


            const response = await fetch(`${currentRPC}eth/v1/beacon/pool/voluntary_exits`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },

            });



            if (response.status === 200) {


            }

            const resString = await response.json();
            console.log("POST exit message response: ", Object.entries(response));


            console.log("Presigned Logs Response:" + Object.entries(response))

            console.log("ResString:" + Object.keys(resString))


            for (const object of resString.data) {



                if (object.message.validator_index === reduxData.valIndex) {

                    setIsPresignedPosted(true)

                    console.log("FOOOOOUUUUUNNNNDD IIIIIIIT!")

                }
            }









        }


        getPostedPresignedLog();


    }, [])




    const graphData = getGraphData(graphState, xAxisData, TotalGraphPlotPoints);


    const options = {

        scales: {
            y: {
                min: 0,
                max: 0.1
            }
        }

    }






    const [enChecked, setEnChecked] = useState(false)



    useEffect(() => {
        console.log(enChecked)

    }, [enChecked])


    const [showFormDisclaimer, setShowFormDisclaimer] = useState(false)

    const [showFormEffectDisclaimer, setShowFormEffectDisclaimer] = useState(false)


    useEffect(() => {


        setShowFormEffectDisclaimer(showFormDisclaimer);








    }, [showFormDisclaimer]);


    const setDisableDisclaimer = () => {

        setEnChecked(false)

        setShowFormDisclaimer(true)

    }


    const [noEnable, setNoEnable] = useState(false)




    const toggleEnableDisable = async () => {



        setShowFormDisclaimer(false)
        setShowFormSetEnabled(true)
        setIncrementer(0)


        if (typeof params.param1 === "string" && typeof params.param2 === "string") {

            try {
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
                        setIncrementer(1)

                        setNoEnable(true)



                        setIncrementer(2)

                        setIncrementerWithDelay(4, 700)

                        delayedExecution()

                    })
                    .catch(e => {
                        // Handle error here



                        setErrorBoxTest2(e.toString())
                        setIncrementer(5)
                    });


            } catch (e: any) {

                if (e.reason) {
                    setErrorBoxTest2(e.reason.toString())

                }
                else if (e.error) {
                    setErrorBoxTest2(e.error["message"].toString())
                } else {

                    setErrorBoxTest2("An Unknown error occured. Please try again.")

                }
                setIncrementer(5)


            }


        } else {
            setErrorBoxTest2("An unknown error occured")
            setIncrementer(5)
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


    const [showFormStakeMinipool, setShowFormStakeMinipool] = useState(false)
    const [showFormEffectStakeMinipool, setShowFormEffectStakeMinipool] = useState(false)


    useEffect(() => {


        setShowFormEffectStakeMinipool(showFormStakeMinipool);


    }, [showFormStakeMinipool]);




    const [errorBoxText2, setErrorBoxTest2] = useState("")

    const [graphTimeout, setGraphTimeout] = useState(false)


    useEffect(() => {
        const timer = setTimeout(() => {
            if (reduxData.address !== "NO VALIDATORS") {

                setGraphTimeout(true);

            }
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



    const [currentStakeStatus1, setCurrentStakeStatus1] = useState(0)
    const [currentStakeStatus2, setCurrentStakeStatus2] = useState(0)
    const [currentStakeStatus3, setCurrentStakeStatus3] = useState(0)
    const [incrementer, setIncrementer] = useState(0);


    useEffect(() => {


        if (incrementer === 1) {

            setCurrentStakeStatus1(1)
            setCurrentStakeStatus2(1)

        } else if (incrementer === 2) {
            setCurrentStakeStatus2(2)
            setCurrentStakeStatus3(1)


        } else if (incrementer === 3) {

            setCurrentStakeStatus3(2)



        } else if (incrementer === 4) {
            setCurrentStakeStatus3(3)
        } else if (incrementer === 5) {
            setCurrentStakeStatus3(4)
        }



        else {

            setCurrentStakeStatus1(0)
            setCurrentStakeStatus2(0)
            setCurrentStakeStatus3(0)



        }

    }, [incrementer])



    const [showFormPostPresigned, setShowFormPostPresigned] = useState(false)
    const [showFormEffectPostPresigned, setShowFormEffectPostPresigned] = useState(false)


    const [showFormPostPresignedShortcut, setShowFormPostPresignedShortcut] = useState(false)
    const [showFormEffectPostPresignedShortcut, setShowFormEffectPostPresignedShortcut] = useState(false)


    useEffect(() => {


        setShowFormEffectPostPresigned(showFormPostPresigned);

        if (showFormPostPresigned === false) {
            setIncrementer(0)
        }


    }, [showFormPostPresigned]);




    useEffect(() => {


        setShowFormEffectPostPresignedShortcut(showFormPostPresignedShortcut);

        if (showFormPostPresignedShortcut === false) {
            setIncrementer(0)
        }


    }, [showFormPostPresignedShortcut]);




    const [postPresignedErrorBoxText, setPostPresignedErrorBoxText] = useState("")


    const [postPresignedShortcutErrorBoxText, setPostPresignedShortcutErrorBoxText] = useState("")


    const [currentPostPresignedStatus1, setCurrentPostPresignedStatus1] = useState(0)

    const [currentPostPresignedStatus3, setCurrentPostPresignedStatus3] = useState(0)






    const [currentPostPresignedShortcutStatus1, setCurrentPostPresignedShortcutStatus1] = useState(0)
    const [currentPostPresignedShortcutStatus2, setCurrentPostPresignedShortcutStatus2] = useState(0)

    const [currentPostPresignedShortcutStatus3, setCurrentPostPresignedShortcutStatus3] = useState(0)


    const triggerConfetti = () => {
        confetti();
    };




    useEffect(() => {

        if (currentPostPresignedStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentPostPresignedStatus3])


    useEffect(() => {

        if (currentPostPresignedShortcutStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentPostPresignedShortcutStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentPostPresignedStatus1(1)


        } else if (incrementer === 4) {
            setCurrentPostPresignedStatus3(3)
        } else if (incrementer === 5) {
            setCurrentPostPresignedStatus3(4)
        }



        else {

            setCurrentPostPresignedStatus1(0)

            setCurrentPostPresignedStatus3(0)



        }

    }, [incrementer])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentPostPresignedShortcutStatus1(1)
            setCurrentPostPresignedShortcutStatus2(1)


        } else if (incrementer === 2) {

            setCurrentPostPresignedShortcutStatus2(2)



        }


        else if (incrementer === 4) {
            setCurrentPostPresignedShortcutStatus3(3)
        } else if (incrementer === 5) {
            setCurrentPostPresignedShortcutStatus3(4)
        }



        else {

            setCurrentPostPresignedShortcutStatus1(0)
            setCurrentPostPresignedShortcutStatus2(0)
            setCurrentPostPresignedShortcutStatus3(0)



        }

    }, [incrementer])








    const [showFormGetPresigned, setShowFormGetPresigned] = useState(false)
    const [showFormEffectGetPresigned, setShowFormEffectGetPresigned] = useState(false)
    const [getPresignedErrorBoxText, setGetPresignedErrorBoxText] = useState("")


    useEffect(() => {


        setShowFormEffectGetPresigned(showFormGetPresigned);


    }, [showFormGetPresigned]);



    const [currentGetPresignedStatus1, setCurrentGetPresignedStatus1] = useState(0)

    const [currentGetPresignedStatus3, setCurrentGetPresignedStatus3] = useState(0)


    useEffect(() => {

        if (currentGetPresignedStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentGetPresignedStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentGetPresignedStatus1(1)


        } else if (incrementer === 4) {
            setCurrentGetPresignedStatus3(3)
        } else if (incrementer === 5) {
            setCurrentGetPresignedStatus3(4)
        }



        else {

            setCurrentGetPresignedStatus1(0)

            setCurrentGetPresignedStatus3(0)



        }

    }, [incrementer])



    const [showFormEditGraffiti, setShowFormEditGraffiti] = useState(false)
    const [showFormEditGraffitiEffect, setShowFormEditGraffitiEffect] = useState(false)


    useEffect(() => {


        setShowFormEditGraffitiEffect(showFormEditGraffiti);

        if (showFormEditGraffiti === false) {
            setIncrementer(0)
        }


    }, [showFormEditGraffiti]);



    const [currentEditGraffitiStatus1, setCurrentEditGraffitiStatus1] = useState(0)

    const [currentEditGraffitiStatus2, setCurrentEditGraffitiStatus2] = useState(0)
    const [currentEditGraffitiStatus3, setCurrentEditGraffitiStatus3] = useState(0)



    useEffect(() => {

        if (currentEditGraffitiStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentEditGraffitiStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentEditGraffitiStatus1(1)
            setCurrentEditGraffitiStatus2(1)

        } else if (incrementer === 2) {
            setCurrentEditGraffitiStatus2(2)



        } else if (incrementer === 4) {
            setCurrentEditGraffitiStatus3(3)
        } else if (incrementer === 5) {
            setCurrentEditGraffitiStatus3(4)
        }



        else {

            setCurrentEditGraffitiStatus1(0)
            setCurrentEditGraffitiStatus2(0)
            setCurrentEditGraffitiStatus3(0)



        }

    }, [incrementer])






    const [showFormSetEnabled, setShowFormSetEnabled] = useState(false)
    const [showFormSetEnabledEffect, setShowFormSetEnabledEffect] = useState(false)


    useEffect(() => {


        setShowFormSetEnabledEffect(showFormSetEnabled);

        if (showFormSetEnabled === false) {
            setIncrementer(0)
        }


    }, [showFormSetEnabled]);



    const [currentSetEnabledStatus1, setCurrentSetEnabledStatus1] = useState(0)

    const [currentSetEnabledStatus2, setCurrentSetEnabledStatus2] = useState(0)
    const [currentSetEnabledStatus3, setCurrentSetEnabledStatus3] = useState(0)



    useEffect(() => {

        if (currentSetEnabledStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentSetEnabledStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentSetEnabledStatus1(1)
            setCurrentSetEnabledStatus2(1)

        } else if (incrementer === 2) {
            setCurrentSetEnabledStatus2(2)



        } else if (incrementer === 4) {
            setCurrentSetEnabledStatus3(3)
        } else if (incrementer === 5) {
            setCurrentSetEnabledStatus3(4)
        }



        else {

            setCurrentSetEnabledStatus1(0)
            setCurrentSetEnabledStatus2(0)
            setCurrentSetEnabledStatus3(0)



        }

    }, [incrementer])




    const [showFormDistribute, setShowFormDistribute] = useState(false)
    const [showFormEffectDistribute, setShowFormEffectDistribute] = useState(false)


    useEffect(() => {


        setShowFormEffectDistribute(showFormDistribute);


        if (showFormDistribute === false) {
            setIncrementer(0)
        }


    }, [showFormDistribute]);



    const [currentDistributeStatus1, setCurrentDistributeStatus1] = useState(0)
    const [currentDistributeStatus2, setCurrentDistributeStatus2] = useState(0)
    const [currentDistributeStatus3, setCurrentDistributeStatus3] = useState(0)


    useEffect(() => {

        if (currentDistributeStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentDistributeStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentDistributeStatus1(1)
            setCurrentDistributeStatus2(1)


        } else if (incrementer === 2) {
            setCurrentDistributeStatus2(2)




        } else if (incrementer === 4) {
            setCurrentDistributeStatus3(3)
        } else if (incrementer === 5) {
            setCurrentDistributeStatus3(4)
        }



        else {

            setCurrentDistributeStatus1(0)
            setCurrentDistributeStatus2(0)
            setCurrentDistributeStatus3(0)



        }

    }, [incrementer])






    useEffect(() => {


        if (incrementer === 1) {

            setCurrentSetEnabledStatus1(1)
            setCurrentSetEnabledStatus2(1)

        } else if (incrementer === 2) {
            setCurrentSetEnabledStatus2(2)



        } else if (incrementer === 4) {
            setCurrentSetEnabledStatus3(3)
        } else if (incrementer === 5) {
            setCurrentSetEnabledStatus3(4)
        }



        else {

            setCurrentSetEnabledStatus1(0)
            setCurrentSetEnabledStatus2(0)
            setCurrentSetEnabledStatus3(0)



        }

    }, [incrementer])



    const [showFormRewards, setShowFormRewards] = useState(false)
    const [showFormEffectRewards, setShowFormEffectRewards] = useState(false)


    useEffect(() => {


        setShowFormEffectRewards(showFormRewards);



    }, [showFormRewards]);



    const [showFormDissolve, setShowFormDissolve] = useState(false)
    const [showFormEffectDissolve, setShowFormEffectDissolve] = useState(false)


    useEffect(() => {


        setShowFormEffectDissolve(showFormDissolve);


        if (showFormDissolve === false) {
            setIncrementer(0)
        }


    }, [showFormDissolve]);



    const [currentDissolveStatus1, setCurrentDissolveStatus1] = useState(0)
    const [currentDissolveStatus2, setCurrentDissolveStatus2] = useState(0)
    const [currentDissolveStatus3, setCurrentDissolveStatus3] = useState(0)


    useEffect(() => {

        if (currentDissolveStatus3 === 3) {

            triggerConfetti();
        }

    }, [currentDissolveStatus3])




    useEffect(() => {


        if (incrementer === 1) {

            setCurrentDissolveStatus1(1)
            setCurrentDistributeStatus2(1)


        } else if (incrementer === 2) {
            setCurrentDissolveStatus2(2)




        } else if (incrementer === 4) {
            setCurrentDissolveStatus3(3)
        } else if (incrementer === 5) {
            setCurrentDissolveStatus3(4)
        }



        else {

            setCurrentDissolveStatus1(0)
            setCurrentDissolveStatus2(0)
            setCurrentDissolveStatus3(0)



        }

    }, [incrementer])




    const [showFormConfirmPostPresignedShortcut, setShowFormConfirmPostPresignedShortcut] = useState(false)
    const [showFormConfirmPostPresignedShortcutEffect, setShowFormConfirmPostPresignedShortcutEffect] = useState(false)


    useEffect(() => {


        setShowFormConfirmPostPresignedShortcutEffect(showFormConfirmPostPresignedShortcut);


    }, [showFormConfirmPostPresignedShortcut]);






    const handleCloseActiveModal = async () => {


        setShowFormConfirmPostPresignedShortcut(false);
        setIncrementer(0);
        setShowFormPostPresignedShortcut(true);



        if (typeof params.param1 === "string" && typeof params.param2 === "string") {


            await getPresignedExitMessageShortcut(params.param1, Number(params.param2));








        } else {
            setIncrementer(5)
            setPostPresignedShortcutErrorBoxText("Invalid params");
        }



    }




    useEffect(() => {

        console.log("EnChecked:" + enChecked)

    }, [enChecked])









    return (
        <div style={{ backgroundColor: reduxDarkMode ? "#222" : "white", color: reduxDarkMode ? "white" : "#222" }} className="flex w-full h-auto flex-col  gap-2 items-center justify-center  ">
            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
                    name="Vrün  | Nodes & Staking"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <Navbar />




            {address === undefined || triggerNewAccount || !reduxData ? (

                <div className='h-[100vh] w-full flex items-center gap-6 py-6 justify-center flex-col'>

                    <h1 className="text-center max-w-[90%]">Looks like you&apos;re not signed in or this link is expired! </h1>


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

                        <div className="flex flex-col w-full items-center justify-center pt-[5vh] lg:pt-[0vh] px-[3vh] lg:px-[0vh] h-auto gap-[6vh] lg:h-[90vh]">

                            <div className="w-full flex flex-col justify-center items-center   ">
                                <h2 className="text-2xl lg:text-4xl font-bold">Validator Detail</h2>

                            </div>

                            <div className="w-full h-auto lg:h-auto flex-col flex gap-[10vh] items-center justify-center lg:flex-row lg:pt-0 ">


                                <div className="h-auto w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl md:h-auto ">

                                    <div className=" h-full w-full gap-4 overflow-hidden rounded-2xl ">

                                        <div style={{ backgroundColor: reduxDarkMode ? "#333" : "#fff" }} className="flex items-center w-auto  h-auto justify-center p-3 lg:p-6  ">


                                            {graphData.labels.length > 0 || graphTimeout ? (


                                                <div className="w-[270px] sm:w-auto h-auto  flex flex-col items-center justify-center p-2 lg:p-8 px-[0.5vh] lg:px-[6vh]">





                                                    <Line

                                                        data={graphData}
                                                        options={options}
                                                        onClick={onClick}
                                                        ref={charRef}

                                                    >



                                                    </Line>

                                                    <div className='flex gap-2 items-center my-2 mt-5 justify-center'>

                                                        <button onClick={() => { setGraphState("All") }} style={graphState === "All" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">All</button>
                                                        <button onClick={() => { setGraphState("Year") }} style={graphState === "Year" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">Year</button>
                                                        <button onClick={() => { setGraphState("Month") }} style={graphState === "Month" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4  ">Month</button>
                                                        <button onClick={() => { setGraphState("Week") }} style={graphState === "Week" ? { backgroundColor: "orange" } : { backgroundColor: "grey" }} className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 ">Week</button>



                                                    </div>
                                                    <p className=" w-[100%] self-center text-wrap text-xs lg:text-sm py-2 text-gray-500">Claim Your Validator rewards on <a className="font-bold hover:text-blue-300 cursor-pointer" target="_blank" href="https://rocketsweep.app/">rocketsweep.app. </a></p>

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

                                                <span className='text-green-500 text-lg  font-bold' style={Number(reduxData.minipoolBalance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>
                                                    {Number(reduxData.minipoolBalance) > 0 ? (
                                                        <div className='flex items-center justify-center'>
                                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-green-500 bg-green-100 rounded-full mr-3">
                                                                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>

                                                            </div>

                                                            <div className="px-3">
                                                                <h3 style={{ color: reduxDarkMode ? "white" : "#222" }} className="block text-md font-bold ">Skimmed balance:</h3>

                                                                <p className="text-green-400"> {reduxData.statusResult === "Staking" ? reduxData.minipoolBalance : "0"}</p>
                                                                <span className="mb-2 block text-sm font-normal text-gray-500 ">

                                                                    Rewards button coming soon!


                                                                </span>

                                                            </div>

                                                        </div>


                                                    ) : (
                                                        <div className='flex items-center justify-center'>
                                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-green-500 bg-green-100 rounded-full mr-6">
                                                                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                </svg>
                                                            </div>

                                                            <div>
                                                                <h3 style={{ color: reduxDarkMode ? "white" : "#222" }} className="block text-md font-bold">Skimmed balance:</h3>

                                                                <p className='text-green-400'>{reduxData.statusResult === "Staking" ? reduxData.minipoolBalance : "0"}</p>
                                                                <span className="mb-2 block font-normal text-sm text-gray-500 ">

                                                                    Rewards button coming soon!


                                                                </span>

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


                                                    {reduxData.statusResult === "Staking" && reduxData.beaconStatus !== "" && (reduxData.beaconStatus !== "active_exiting" && reduxData.beaconStatus !== "exited_unslashed" && reduxData.beaconStatus !== "withdrawal_possible" && reduxData.beaconStatus !== "withdrawal_done" && reduxData.beaconStatus !== "exited_slashed" && reduxData.beaconStatus !== "active_slashed") && !isPresignedPosted && reduxData.isEnabled === true && (

                                                        <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>)

                                                    }


                                                    {reduxData.statusResult === "Staking" && reduxData.beaconStatus === "active_ongoing" && isPresignedPosted && (

                                                        <p className="text-yellow-500  text-md">waiting_for_beaconchain</p>)}




                                                    {
                                                        reduxData.statusResult === "Staking" && reduxData.beaconStatus === "" && reduxData.isEnabled === true && (

                                                            <p className="text-yellow-500  text-md">waiting_for_beaconchain</p>

                                                        )

                                                    }





                                                    {
                                                        reduxData.statusResult === "Prelaunch" && (

                                                            <p className="text-yellow-500  text-md">prelaunch</p>

                                                        )

                                                    }


                                                    {reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) > 0 && reduxData.isEnabled === true &&
                                                        <>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.timeRemaining} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until this Validator can be Staked</p>


                                                        </>
                                                    }



                                                    {(reduxData.beaconStatus === "exited_slashed" || reduxData.beaconStatus === "active_slashed") && (


                                                        <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>



                                                    )}



                                                    {(reduxData.beaconStatus !== "active_exiting" && reduxData.beaconStatus !== "exited_unslashed" && reduxData.beaconStatus !== "withdrawal_possible" && reduxData.beaconStatus !== "withdrawal_done" && reduxData.beaconStatus !== "exited_slashed" && reduxData.beaconStatus !== "active_slashed" && reduxData.statusResult !== "Dissolved" && reduxData.statusResult !== "Prelaunch") && reduxData.isEnabled === false && !isPresignedPosted && (

                                                        <p className="text-yellow-500  text-md">disabled_by_user</p>


                                                    )}



                                                    {(reduxData.beaconStatus === "active_exiting" || reduxData.beaconStatus === "exited_unslashed" || reduxData.beaconStatus === "withdrawal_possible") && (Number(reduxData.withdrawalCountdown) > 0) &&



                                                        <>
                                                            <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.withdrawalCountdown} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until the &quot;withdrawal_possible&quot; epoch</p>


                                                        </>
                                                    }

                                                    {(reduxData.beaconStatus === "withdrawal_possible") && (Number(reduxData.withdrawalCountdown) <= 0) &&
                                                        <>

                                                            <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>
                                                            <p className='text-xs max-w-[200px]'>Funds will be available to withdraw when status is &quot;withdrawal_done&quot; </p>


                                                        </>
                                                    }

                                                    {(reduxData.beaconStatus === "withdrawal_done") && (

                                                        <>

                                                            <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>



                                                        </>

                                                    )

                                                    }








                                                    {/*reduxData.statusResult === "Staking" && reduxData.beaconStatus !== "active_staking" &&
                                                        <>
                                                            <CountdownComponentScrub initialMilliseconds={reduxData.timeRemaining} reset={getMinipoolData} />

                                                            <p className='text-xs'>Until the next stage...</p>




                                                        </>
                                                */}
                                                    {reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) <= 0 && turnOffStakeButton && reduxData.isEnabled === true &&

                                                        <button onClick={() => { stakeMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake Minipool</button>



                                                    }


                                                    {(reduxData.statusResult === "Staking" || reduxData.statusResult === "Dissolved") && reduxData.beaconStatus !== "" &&
                                                        <a className=" hover:text-blue-300  font-bold hover:text-blue-300 cursor-pointer text-md" href={`https://${currentChain === 17000 ? "holesky." : ""}beaconcha.in/validator/${reduxData.valIndex}`} target="_blank">View</a>
                                                    }
                                                </div>
                                            </div>
                                        </div>


                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">


                                            {reduxData.isEnabled ? (

                                                <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-blue-600 bg-blue-100 rounded-full mr-6">
                                                    <VscActivateBreakpoints className="text-blue-500 text-2xl" />

                                                </div>

                                            ) : (

                                                <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-red-600 bg-red-100 rounded-full mr-6">
                                                    <VscActivateBreakpoints className="text-red-500 text-2xl" />

                                                </div>

                                            )

                                            }


                                            <div className='flex gap-4 items-center justify-center w-full'>

                                                <div className='flex gap-1 flex-col items-center justify-center w-full'>


                                                    {reduxData.isEnabled ? (

                                                        reduxData.isEnabled && !noEnable && <button onClick={() => { setDisableDisclaimer() }} className="bg-red-500 mt-2 w-auto text-xs hover:bg-red-700 text-white font-bold py-2 px-2 rounded-md" >
                                                            Disable Validator
                                                        </button>

                                                    ) : (

                                                        <button style={{ pointerEvents: "none" }} className="bg-red-700 mt-2 text-xs text-white font-bold py-2 px-2 rounded-md">Disabled</button>

                                                    )}
                                                </div>

                                                <div className='w-full flex gap-2 text-xs items-start justify-start'>
                                                    { }



                                                </div>


                                            </div>

                                        </div>








                                    </section>

                                </div>

                            </div>




                        </div>


                        <div className='flex w-full h-auto flex-col py-[2vh] mb-10 justify-center items-center gap-6 lg:min-h-[35vh]'>

                            <div className="w-full my-5 mx-5 mb-1 overflow-hidden">
                                <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">

                                    <div ref={targetRef} className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
                                        <h3 className="text-2xl lg:text-4xl font-bold  ">Validator Actions</h3>


                                    </div>

                                </div>
                            </div>

                            <div className="xl:flex xl:flex-row lg:flex-col w-[85%] lg:w-[auto] items-center justify-center xl:gap-5 lg:gap-5">

                                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 xl:grid-rows-2 gap-4">

                                    <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">
                                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                                            <PiSignatureBold className="text-purple-500 text-3xl" />
                                        </div>
                                        <div>
                                            <div className="flex items-start flex-col gap-0.5 ">
                                                <span className="text-md font-bold">Change Graffiti</span>
                                                <p className="text-s mb-1.5 text-gray-600">    {reduxData.graffiti}</p>
                                                <button className="bg-blue-500 self-start  text-xs hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(reduxData.graffiti) }}>
                                                    Change
                                                </button>

                                            </div>
                                        </div>
                                    </div>


                                    {reduxData.statusResult === "Dissolved" && turnOffCloseButton &&

                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-md font-bold">Close Failed Minipool</p>


                                                <button onClick={() => { closeMinipool() }} className="bg-red-500   text-xs  hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Close Minipool</button>
                                            </div>

                                        </div>}




                                    {reduxData.statusResult === "Prelaunch" && Number(reduxData.timeRemaining) <= 0 && turnOffStakeButton &&
                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <Image
                                                    width={70}
                                                    height={70}
                                                    alt="Rocket Pool Logo"
                                                    src={"/images/rocketlogo.webp"} />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-md  font-bold">Stake Prelaunched Minipool</p>

                                                <button onClick={() => { stakeMinipool() }} className="bg-blue-500   text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Stake Minipool</button>
                                            </div>
                                        </div>}


                                    {reduxData.statusResult === "Staking" && reduxData.beaconStatus === "active_ongoing" && turnOffPostButtons && !isPresignedPosted &&
                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                                                <GrSatellite className=" text-2xl" />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-md  font-bold">Post Presigned Exit Message</p>

                                                <button onClick={handlePostExitModal} className="bg-yellow-500  text-xs  hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md">Post Exit Message</button>
                                            </div>
                                        </div>
                                    }

                                    {reduxData.statusResult === "Staking" && reduxData.beaconStatus === "active_ongoing" && tableRewards.length > 0 &&

                                        <div className="flex w-auto items-center p-6  shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-400 bg-green-100 rounded-full mr-6">
                                                <FaCoins className=" text-2xl" />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-md  font-bold">Rewards History</p>

                                                <button onClick={() => { setShowFormRewards(!showFormRewards) }} className="bg-yellow-500  text-xs  hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md">View</button>
                                            </div>
                                        </div>


                                    }




                                    {reduxData.beaconStatus === "withdrawal_done" && turnOffDistributeButton &&
                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">
                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-yellow-100 rounded-full mr-6">
                                                <FaCoins className="text-yellow-500 text-xl" />
                                            </div>

                                            <div className="flex items-start flex-col gap-2 text-l ">

                                                <p className="text-md  font-bold">Distribute Minipool Balance</p>

                                                <button onClick={() => { distributeBalanceOfMinipool() }} className="bg-blue-500  text-xs  hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded-md">Distribute Balance</button>
                                            </div>
                                        </div>

                                    }


                                    {reduxData.statusResult !== "Empty" && reduxData.beaconStatus === "active_ongoing" && turnOffPostButtons && !isPresignedPosted &&
                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                                                <FaEthereum className=" text-2xl" />
                                            </div>


                                            <div className="flex w-auto items-start flex-col gap-2 text-l ">


                                                <p className="text-md font-bold width-[80%]">Get Presigned Exit Message</p>


                                                <button onClick={() => { handleGetPresignedModal() }} className="bg-blue-500   text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Get Exit Message</button>
                                            </div>
                                        </div>
                                    }


                                    {reduxData.statusResult !== "Empty" && reduxData.beaconStatus === "active_ongoing" && turnOffPostButtons && !isPresignedPosted &&
                                        <div className="flex w-auto items-center p-6 shadow-xl border rounded-lg">

                                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                                                <GrSatellite className=" text-2xl" />
                                            </div>


                                            <div className="flex w-auto items-start flex-col gap-2 text-l ">


                                                <p className="text-md font-bold width-[80%]">Close Active Minipool</p>


                                                <button onClick={() => { setShowFormConfirmPostPresignedShortcut(true) }} className="bg-red-500   text-xs  hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Initiate Close</button>
                                            </div>
                                        </div>
                                    }










                                </section>


                            </div>


                        </div>











                        <div className="w-full h-auto flex flex-col items-center justify-center  gap-[7vh] p-[2vh] ">
                            <div className="w-full overflow-hidden">
                                <div className="w-full flex flex-col items-center justify-center ">


                                    <h3 className="text-2xl lg:text-4xl font-bold ">Validator Info</h3>




                                </div>
                            </div>

                            <div className="flex  flex-col items-center justify-center gap-3 p-4  w-[90%] lg:w-auto border h-auto shadow-xl rounded-lg">



                                <div className=' w-full flex flex-col items-start justify-center  gap-3 text-l '>
                                    <span className="text-md lg:text-2xl text-center font-bold">Pubkey:</span>

                                    <p className="text-wrap text-gray-400"><ContractTag pubkey={params?.param1} /></p>

                                </div>

                                <div className=' w-full flex flex-col items-start justify-center  gap-3 text-l '>
                                    <span className="text-md lg:text-2xl text-center  font-bold">Minipool Address:</span>
                                    <p className="text-wrap text-gray-400"> <ContractTag pubkey={reduxData.address} /></p>
                                </div>

                            </div>


                            <div className="w-[auto] h-[auto] overflow-hidden shadow-xl border rounded-lg mb-5 ">

                                <table className="w-full ">
                                    <tbody>

                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 text-white bg-[#333] text-s font-bold w-auto text-center">
                                                <p>Graffiti</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">

                                                {reduxData.graffiti}

                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  bg-[#333] text-white py-3 text-s font-bold w-auto text-center">
                                                <p>Balance</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {Number(reduxData.valBalance) > 0 && reduxData.beaconStatus !== "withdrawal_done" && <p className='font-bold '>{reduxData.valBalance}</p>}
                                                {Number(reduxData.valBalance) === 0 && reduxData.beaconStatus !== "withdrawal_done" && <p className='font-bold '>Pending...</p>}
                                                {Number(reduxData.valBalance) === 0 && reduxData.beaconStatus === "withdrawal_done" && <p className='font-bold '>Exited from Beaconchain</p>}
                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3  text-white bg-[#333]   text-s font-bold w-auto text-center">
                                                <p>Validator Index</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.valIndex}

                                            </td>
                                        </tr>

                                        <tr className="border-b-2 ">

                                            <td className="px-5  py-3 bg-[#333] text-white text-s font-bold w-auto text-center">
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
                                            <td className="px-5  py-3 bg-[#333] text-white font-bold text-s w-auto text-center">
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
                            isOpen={showFormRewards}
                            onRequestClose={() => setShowFormRewards(false)}
                            contentLabel="Rewards Income Modal"

                            className={`${styles.modal} ${showFormEffectRewards ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                                    maxHeight: '600px',
                                    minWidth: "280px",
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',

                                    overflowY: 'scroll',

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


                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowFormRewards(false)
                                    }} />

                                </div>

                                <h3 className="font-bold text-[30px] mb-2">Rewards History</h3>


                                {tableRewards.length > 0 && (

                                    <div id="accountTable" className="w-[90%] sm:w-[80%] lg:w-auto  shadow-xl border">


                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className=" px-4 bg-gray-700  text-white py-5 w-[200px] ">



                                                        <span className='text-center  text-sm lg:text-xl'>
                                                            EPOCH
                                                        </span>



                                                    </th>
                                                    <th className=" px-4 bg-gray-700 text-white py-5 w-[200px] ">



                                                        <span className='text-center  text-sm lg:text-xl'>
                                                            INCOME:
                                                        </span>



                                                    </th>


                                                </tr>
                                            </thead>

                                            <tbody>

                                                {tableRewards.map((data, index) => (
                                                    <tr key={index} >



                                                        <td className=" px-4  py-5 w-[200px] ">



                                                            <span className='text-center  text-sm lg:text-xl'>
                                                                {Number(data.epoch)}
                                                            </span>



                                                        </td>

                                                        <td className="px-4 py-5  w-[200px]">



                                                            <span className='text-center  text-sm lg:text-xl'>
                                                                <p className='text-green-500'>+{ethers.formatUnits(data.income, "gwei")}</p>

                                                            </span>






                                                        </td>







                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>)

                                }

                            </div>


                        </Modal>







                        <Modal
                            isOpen={showFormDissolve}
                            onRequestClose={() => setShowFormDissolve(false)}
                            contentLabel="Dissolve Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormEffectDissolve ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentDistributeStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Minipool Dissolved!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormDissolve(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentDistributeStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Dissolve Minipool Failed!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{closeDissolvedErrorMessage}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormDissolve(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Distribute Balance of Minipool</h3>
                                            {/* <p className="text-[25px]">{RPLinput} RPL</p> */}
                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaCoins /></p>

                                                    <p className="text-left">Dissolve Minipool </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentDissolveStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>




                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p><FaEthereum /></p>

                                                    <p className="text-left">Confirming change...</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentDissolveStatus2 === 0 ? (
                                                            <p></p>

                                                        ) : currentDissolveStatus2 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>


                                            </div>







                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>


                        <Modal
                            isOpen={showFormDisclaimer}
                            onRequestClose={() => setShowFormDisclaimer(false)}
                            contentLabel="Disclaimer Modal"

                            className={`${styles.modal} ${showFormEffectDisclaimer ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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


                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowFormDisclaimer(false)
                                    }} />

                                </div>



                                <h3 className="font-bold text-[30px]">WARNING!</h3>

                                <p className="text-lg text-center text-red-500">Proceeding with this action means re-enabling your validator will only be possible by us! Get in touch with us on <a href="https://discord.gg/eUhuZfnyVr" target="_blank" className='font-bold hover:text-red-600'> Discord</a> via the Vrün channel for more information. </p>

                                <div >
                                    <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={toggleEnableDisable}>GO!</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowFormDisclaimer(false)}>Cancel</button>
                                </div>

                            </div>


                        </Modal>






                        <Modal
                            isOpen={showFormDistribute}
                            onRequestClose={() => setShowFormDistribute(false)}
                            contentLabel="Distribute Balance Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormEffectDistribute ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentDistributeStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Balance Distributed!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormDistribute(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentDistributeStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Distribute Balance Failed!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{distributeErrorBoxText}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormDistribute(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Distribute Balance of Minipool</h3>
                                            {/* <p className="text-[25px]">{RPLinput} RPL</p> */}
                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaCoins /></p>

                                                    <p className="text-left">Confirm distribution </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentDistributeStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>




                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p><FaEthereum /></p>

                                                    <p className="text-left">Confirming change...</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentDistributeStatus2 === 0 ? (
                                                            <p></p>

                                                        ) : currentDistributeStatus2 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>


                                            </div>







                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>






                        <Modal
                            isOpen={showFormSetEnabled}
                            onRequestClose={() => setShowFormSetEnabled(false)}
                            contentLabel="Set Enabled Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormSetEnabledEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentSetEnabledStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Change succesful!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormSetEnabled(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentSetEnabledStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[27px]">Failed to Change Enabled Status!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{errorBoxText2}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormSetEnabled(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Change Enabled Status: </h3>

                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <HiOutlinePaperAirplane /></p>

                                                    <p className="text-left">Signed Typed Data </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentSetEnabledStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p><FaEthereum /></p>

                                                    <p className="text-left">Confirming change...</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentSetEnabledStatus2 === 0 ? (
                                                            <p></p>

                                                        ) : currentSetEnabledStatus2 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>


                                            </div>










                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>





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
                            <div className="flex relative w-full h-full flex-col rounded-lg gap-4 bg-gray-100 px-6 py-6 pt-[45px] text-center">
                                <div id={styles.icon} className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowForm2(false)
                                    }} />

                                </div>
                                <h2 className="text-[23px] font-bold">Get Presigned Exit Message</h2>

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


                                <p className='text-red-400'><span className="text-red-500 font-bold">WARNING:</span> Submitting your exit message (by copy and pasting it into the box below) will mean this validator will begin the exit process. </p>





                                <textarea className="border h-[200px] " value={exitMessage} onChange={handleChangeExitMessage} />



                                <div>
                                    <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={confirmPostPresigned}>Post</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm4(false)}>Cancel</button>
                                </div>
                            </div>
                        </Modal>


                        <Modal
                            isOpen={showForm6}
                            onRequestClose={() => setShowForm6(false)}
                            contentLabel="Enable/Disable Initial Modal"
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
                                            checked={enChecked === false}
                                            onChange={() => setEnChecked(false)}
                                        />
                                        No
                                    </label>
                                </div>


                                <div className='w-full flex gap-2 items-center justify-center'>
                                    {enChecked === false ? (


                                        <button onClick={() => { setDisableDisclaimer() }} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                                            Confirm Changes
                                        </button>


                                    ) : (


                                        <></>



                                    )

                                    }





                                </div>





                            </div>


                        </Modal>

                        <Modal
                            isOpen={showFormStakeMinipool}
                            onRequestClose={() => setShowFormStakeMinipool(false)}
                            contentLabel="Stake Minipool Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormEffectStakeMinipool ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentStakeStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Validator Staked</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormStakeMinipool(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentStakeStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Validator Stake Failed!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{stakeErrorMessage}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormStakeMinipool(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Stake Minipool</h3>

                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaEthereum /></p>

                                                    <p className="text-left">Checking eligibility for Staking</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentStakeStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>



                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p><HiOutlinePaperAirplane /></p>

                                                    <p className="text-left" >Sign Typed Data</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentStakeStatus2 === 0 ? (
                                                            <p></p>

                                                        ) : currentStakeStatus2 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>


                                            </div>



                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaSignature /></p>
                                                    <p className="text-left">Stake your Minipool</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentStakeStatus3 === 0 ? (
                                                            <p></p>

                                                        ) : currentStakeStatus3 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>

                                            </div>



                                        </div>







                                    </>






                                )}








                            </div>


                        </Modal>


                        <Modal
                            isOpen={showFormAlert}
                            onRequestClose={() => setShowFormAlert(false)}
                            contentLabel="Alert Validators Modal"
                            className={`${styles.modal} ${showFormAlertEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col  rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">

                                <div id={styles.icon} className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowFormAlert(false)
                                    }} />

                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">NEW VAIDATOR ACTIONS!</h2>

                                {validatorsInNeedOfAction.stake > 0 &&

                                    <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                                        You have {validatorsInNeedOfAction.stake} in Prelaunch and ready to STAKE!
                                    </p>}

                                {validatorsInNeedOfAction.withdrawn > 0 &&
                                    <p className="my-4 w-[90%] text-gray-500 sm:text-l">


                                        You have {validatorsInNeedOfAction.withdrawn} withdrawn Validators, ready to distribute the balance of.
                                    </p>
                                }

                                {validatorsInNeedOfAction.close > 0 &&

                                    <p className="my-4 w-[90%] text-gray-500 sm:text-l">

                                        You have {validatorsInNeedOfAction.close} dissolved Minipools that need closing.
                                    </p>

                                }



                                <div className='w-full flex gap-2 items-center justify-center'>
                                    <button onClick={handleScrollToElement} className="bg-blue-500 mt-2   hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                                        SEE ACTIONS
                                    </button>
                                </div>





                            </div>


                        </Modal>



                        <Modal
                            isOpen={showFormPostPresigned}
                            onRequestClose={() => setShowFormPostPresigned(false)}
                            contentLabel="Post Presigned Transaction Modal"
                            className={`${styles.modal} ${showFormEffectPostPresigned ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
                            ariaHideApp={false}
                            shouldCloseOnOverlayClick={false}
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentPostPresignedStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Exit Message Posted!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormPostPresigned(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentPostPresignedStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Failed to Post Exit Message.</h3>

                                        <p className='my-3 text-lg text-red-400 '>{postPresignedErrorBoxText}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormPostPresigned(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Post Presigned Exit Message</h3>

                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <HiOutlinePaperAirplane /></p>

                                                    <p className="text-left">Post Exit Message </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentPostPresignedStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>










                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>


                        <Modal
                            isOpen={showFormPostPresignedShortcut}
                            onRequestClose={() => setShowFormPostPresignedShortcut(false)}
                            contentLabel="Post Presigned SHORTCUT Transaction Modal"
                            className={`${styles.modal} ${showFormEffectPostPresignedShortcut ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
                            ariaHideApp={false}
                            shouldCloseOnOverlayClick={false}
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentPostPresignedShortcutStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Close Initiated!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormPostPresignedShortcut(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentPostPresignedShortcutStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Failed to Initiate Close</h3>

                                        <p className='my-3 text-lg text-red-400 '>{postPresignedShortcutErrorBoxText}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormPostPresignedShortcut(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) :





                                    (


                                        <>




                                            <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                                <h3 className="font-bold text-[30px]">Initiate Close of Active Minipool</h3>

                                            </div>

                                            <hr className="w-full my-3" />

                                            <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                                <div className='flex items-start justify-between gap-6 w-full'>
                                                    <div className="flex items-center justify-start gap-4">
                                                        <p> <FaSignature /></p>

                                                        <p className="text-left">Get Exit Message </p>
                                                    </div>
                                                    <p className='self-end'>

                                                        {

                                                            currentPostPresignedShortcutStatus1 === 0 ? (
                                                                <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                            ) : (

                                                                <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                            )




                                                        }


                                                    </p>
                                                </div>



                                                <div className='flex items-start justify-between gap-6 w-full'>
                                                    <div className="flex items-center justify-start gap-4">
                                                        <p> <HiOutlinePaperAirplane /></p>

                                                        <p className="text-left">Post Exit Message </p>
                                                    </div>
                                                    <p className='self-end'>

                                                        {

                                                            currentPostPresignedShortcutStatus2 === 0 ? (
                                                                <p></p>

                                                            ) : currentPostPresignedShortcutStatus2 === 1 ? (

                                                                <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                            ) : (

                                                                <div className="flex items-center justify-center text-green-400 text-[25px]"> <TiTick /></div>



                                                            )




                                                        }


                                                    </p>
                                                </div>










                                            </div>







                                        </>






                                    )}


                            </div>


                        </Modal>


                        <Modal
                            isOpen={showFormConfirmPostPresigned}
                            onRequestClose={() => setShowFormConfirmPostPresigned(false)}
                            contentLabel="WARNING Presigned Modal"
                            className={`${styles.modal} ${showFormConfirmPostPresignedEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col  rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">

                                <div id={styles.icon} className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowFormConfirmPostPresigned(false)
                                    }} />

                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Are you sure you want to begin closing this Validator?</h2>
                                <p className="text-red-400"><span className="text-red-500 font-bold">WARNING:</span>  Upon the success of posting your Exit Message, the Validator will begin the exit process on the Beacon Chain. Do you wish to proceed?</p>




                                <div className='w-full flex gap-2 items-center justify-center'>
                                    <button onClick={postPresignedExitMessage} className="bg-red-500 mt-2   hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md" >
                                        POST!
                                    </button>
                                </div>





                            </div>


                        </Modal>

                        <Modal
                            isOpen={showFormConfirmPostPresignedShortcut}
                            onRequestClose={() => setShowFormConfirmPostPresignedShortcut(false)}
                            contentLabel="WARNING Presigned Modal SHORTCUT"
                            className={`${styles.modal} ${showFormConfirmPostPresignedShortcutEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col  rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">

                                <div id={styles.icon} className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 ">
                                    <AiOutlineClose className='self-end cursor-pointer' onClick={() => {
                                        setShowFormConfirmPostPresignedShortcut(false)
                                    }} />

                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">Are you sure you want to begin closing this Validator?</h2>
                                <p className="text-red-400"><span className="text-red-500 font-bold">WARNING:</span>  Upon the successful posting of an Exit Message to the Beacon chain, the Validator will begin the exit process. Do you wish to proceed?</p>




                                <div className='w-full flex gap-2 items-center justify-center'>
                                    <button onClick={handleCloseActiveModal} className="bg-red-500 mt-2   hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md" >
                                        POST!
                                    </button>
                                </div>





                            </div>


                        </Modal>

                        <Modal
                            isOpen={showFormEditGraffiti}
                            onRequestClose={() => setShowFormEditGraffiti(false)}
                            contentLabel="Graffiti Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormEditGraffitiEffect ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentEditGraffitiStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Graffiti Edit Successful!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormEditGraffiti(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentEditGraffitiStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Failed to change Validator Graffiti!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{graffitiError}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormEditGraffiti(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Batch Change Graffiti </h3>
                                            <p className="text-[19px]">Change the Graffiti for all your Validators...</p>
                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaSignature /></p>

                                                    <p className="text-left">Signed Typed Data </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentEditGraffitiStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p><HiOutlinePaperAirplane /></p>

                                                    <p className="text-left">Confirming change</p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentEditGraffitiStatus2 === 0 ? (
                                                            <p></p>

                                                        ) : currentEditGraffitiStatus2 === 1 ? (

                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>


                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>



                                                        )




                                                    }


                                                </p>


                                            </div>










                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>


                        <Modal
                            isOpen={showFormGetPresigned}
                            onRequestClose={() => setShowFormGetPresigned(false)}
                            contentLabel="Get Presigned Transaction Modal"
                            shouldCloseOnOverlayClick={false}
                            className={`${styles.modal} ${showFormEffectGetPresigned ? `${styles.modalOpen}` : `${styles.modalClosed}`}`} // Toggle classes based on showForm state
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
                            <div className="flex relative w-full h-full items-center justify-center flex-col rounded-lg gap-2 bg-gray-100 px-8 py-8 pt-[45px] text-center">


                                {currentGetPresignedStatus3 === 3 ? (


                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Message Received!</h3>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]"> <TiTick /></div>
                                        <button onClick={() => { setShowFormGetPresigned(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>




                                ) : currentGetPresignedStatus3 === 4 ? (

                                    <div className='w-full flex items-center flex-col gap-2 justify-center'>
                                        <h3 className="font-bold text-[30px]">Failed to generate Exit Message!</h3>

                                        <p className='my-3 text-lg text-red-400 '>{getPresignedErrorBoxText}</p>

                                        <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]"><BiSolidErrorAlt /></div>
                                        <button onClick={() => { setShowFormGetPresigned(false) }} className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Close</button>
                                    </div>





                                ) : (


                                    <>




                                        <div className='w-full flex items-start flex-col gap-2 justify-center'>
                                            <h3 className="font-bold text-[30px]">Get Presigned Exit Message</h3>

                                        </div>

                                        <hr className="w-full my-3" />

                                        <div className='flex flex-col gap-3 items-center justify-center w-full'>


                                            <div className='flex items-start justify-between gap-6 w-full'>
                                                <div className="flex items-center justify-start gap-4">
                                                    <p> <FaEthereum /></p>

                                                    <p className="text-left">Sign Typed Data </p>
                                                </div>
                                                <p className='self-end'>

                                                    {

                                                        currentGetPresignedStatus1 === 0 ? (
                                                            <div className="flex items-center justify-center"><BounceLoader size={25} /></div>

                                                        ) : (

                                                            <div className="flex items-center justify-center  text-green-400 text-[25px]"> <TiTick /></div>


                                                        )




                                                    }


                                                </p>
                                            </div>










                                        </div>







                                    </>






                                )}


                            </div>


                        </Modal>


                    </>) : (

                        <div className='h-[100vh] w-full flex items-center gap-2 justify-center flex-col'>

                            <h3 className='text-center max-w-[90%]'>Please wait while we retrieve your validator detail...</h3>

                            <BounceLoader />


                        </div>




                    )}

                </>



            )}








            <Footer />  </div>
    )
}

export default ValidatorDetail