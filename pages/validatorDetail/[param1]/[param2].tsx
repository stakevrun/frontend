import React, { useEffect, useState, useRef } from 'react'
import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../../../components/navbar';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import * as openpgp from 'openpgp';
import storageABI from "../../../json/storageABI.json"
import miniManagerABI from "../../../json/miniManagerABI.json"
import daoABI from "../../../json/daoABI.json"
import feeABI from "../../../json/feeABI.json"
import CountdownComponent from '../../../components/countdown.jsx';
import QuickNode from '@quicknode/sdk';
import Modal from 'react-modal';
import ContractTag from "../../../components/contractTag"
import { GrSatellite } from "react-icons/gr";
import { AiOutlineClose } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import { PieChart, LineChart } from '@mui/x-charts'
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import { PiSignatureBold } from "react-icons/pi";
import { FaEthereum } from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import managerABI from "../../../json/managerABI.json"
import BounceLoader from "react-spinners/BounceLoader";
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from "../../../globalredux/Features/counter/counterSlice"
import type { RootState } from '../../../globalredux/store';
import { getData } from "../../../globalredux/Features/validator/valDataSlice"
import { attestationsData } from '../../../globalredux/Features/attestations/attestationsDataSlice';
import { getGraphPointsData } from "../../../globalredux/Features/graphpoints/graphPointsDataSlice"
import Link
    from 'next/link';

import Image from 'next/image';


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
                    isEnabled: false,
                    valIndex: ""


                });




                seperateMinipoolObjects.push({
                    address: "NO VALIDATORS checked",
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


                const string = formatTime(timeRemaining);

                console.log("Time Remaining:" + string);


                const printGraff = await getGraffiti(pubkey);
                const beaconStatus = await getBeaconchainStatus(pubkey)
                const isEnabled = await getEnabled(pubkey)
                const valIndex = await getValIndex(pubkey)

                const smoothingBool = await getMinipoolTruth(pubkey)



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
                    isEnabled: isEnabled,
                    valIndex: valIndex,

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
                    pubkey: pubkey,
                    nodeAddress: address !== undefined ? address.toString() : ""
                })





            }



        }




        dispatch(getData(seperateMinipoolObjects))



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

        const currentRPC = currentChain === 17000 ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/` : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`




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

        getMinipoolData();



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
                { name: 'pubkeys', type: 'bytes[]' },
                { name: 'graffiti', type: 'string' },

            ]
        }


        const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
        const APItype = "SetGraffiti"

        const date = Math.floor(Date.now() / 1000);

        const value = { timestamp: date, pubkeys: [pubkey], graffiti: newGrafitti }


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

                var jsonString = await response.json()// Note: response will be opaque, won't contain data

                console.log("POST exit message response" + jsonString)

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


        console.log(reduxData)

        if (reduxData.address !== "" && reduxData.address !== "NO VALIDATORS") {
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




            await fetch(`https://db.vrün.com/${currentChain}/${address}/batch`, {
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
                })
                .catch(error => {
                    // Handle error here
                    console.log(error);
                });




        }


    }












    return (
        <div className="flex w-full flex-col gap-2 items-center justify-center  pb-8 ">
            <Head>
                <title>Vrün | Nodes & Staking</title>
                <meta
                    content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
                    name="Vrün  | Nodes & Staking"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <Navbar />




            {address === undefined  || reduxData.nodeAddress !== address ? (

                <div className='h-[100vh] w-full flex items-center gap-2 py-6 justify-center flex-col'>

                    <h1>Looks like you&apos;re not signed in or this link is expired! </h1>


                    <Link href="/">



                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                            Back to Home
                        </button>




                    </Link>



                </div>




            ) : (

                <>

                    {xAxisData.length > 0 ? (<>

                        <div className="w-full h-[auto] flex flex-col items-center justify-center py-10">
                            <div className="w-[50%] flex flex-col justify-center items-center">
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pubkey: </h2>

                                <p className="mt-4 text-gray-500 sm:text-xl">

                                    <ContractTag pubkey={params?.param1} />
                                </p>
                            </div>
                        </div>




                        <div className="xl:flex xl:flex-row lg:flex-col w-[auto] items-center justify-center xl:gap-5 lg:gap-5">






                            <section className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">

                                <div className="flex items-center p-6 bg-white shadow border rounded-lg">
                                    <div className="inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                                        <FaEthereum className="text-2xl text-blue-500" />
                                    </div>
                                    <div>

                                        <span className="block text-xl mb-1 font-bold">Validator Status:</span>
                                        <span className="block text-gray-500 mb-1">


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

                                        </span>


                                        {reduxData.statusResult !== "Prelaunch" && reduxData.statusResult !== "Staking" &&

                                            <CountdownComponent milliseconds={reduxData.timeRemaining} />}

                                        {reduxData.statusResult === "Prelaunch" &&

                                            <button onClick={() => { stakeMinipool() }} className="bg-green-500 mt-1  text-xs  hover:bg-green-700 text-white font-bold  py-2 px-4 rounded-md">Stake Minipool</button>

                                        }
                                        {reduxData.statusResult === "Dissolved" &&

                                            <button onClick={() => { closeMinipool() }} className="bg-red-500 mt-1  text-xs  hover:bg-red-700 text-white font-bold  py-2 px-4 rounded-md">Close Minipool</button>

                                        }


                                    </div>
                                </div>

                                <div className="flex w-auto items-center p-6 bg-white shadow border rounded-lg">
                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                                        <VscActivateBreakpoints className="text-blue-500 text-2xl" />

                                    </div>
                                    <div className='flex flex-col items-start justify-center w-full'>

                                        <div className='flex items-center gap-2 justify-start w-full'>

                                            <span className="block text-xl font-bold">Enabled?</span>

                                            <label className="self-center">

                                                <input
                                                    type="checkbox"
                                                    className="self-center"
                                                    checked={enChecked}
                                                    onChange={handleEnCheckedInput}
                                                />

                                            </label>
                                        </div>

                                        <div className='w-full flex gap-2 text-xs items-start justify-start'>
                                            <button onClick={() => { toggleEnableDisable() }} className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md" >
                                                Confirm Changes
                                            </button>
                                        </div>


                                    </div>

                                </div>
                                <div className="flex items-center p-6 bg-white shadow border rounded-lg">

                                    <div>

                                        <span className='text-green-500 text-lg  font-bold' style={Number(reduxData.valDayVariance) > 0 ? { color: "rgb(34 197 94)" } : { color: "red" }}>
                                            {Number(reduxData.valDayVariance) > 0 ? (
                                                <div className='flex items-center justify-center'>
                                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16  bg-green-100 rounded-full mr-3">
                                                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>

                                                    </div>

                                                    <div className="px-3">
                                                        <span className="block text-xl font-bold text-black">Daily ETH Tracker:</span>

                                                        <p className="text-green-600"> {reduxData.valDayVariance}</p>

                                                    </div>

                                                </div>


                                            ) : (
                                                <div className='flex items-center justify-center'>
                                                    {reduxData.valDayVariance !== "" && <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16  bg-red-100 rounded-full mr-6">
                                                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                        </svg>
                                                    </div>}

                                                    <div>
                                                        <span className="block text-xl font-bold text-black">Daily ETH Tracker:</span>

                                                        <p className='text-red-600'>{reduxData.valDayVariance !== "" && reduxData.valDayVariance}</p>

                                                    </div>

                                                </div>
                                            )}

                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center p-6 bg-white shadow border rounded-lg">
                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                                        <GrSatellite className="text-yellow-500 text-2xl" />
                                    </div>
                                    <div>
                                        <div className="flex items-start flex-col gap-0.5 text-l ">
                                            {reduxData.beaconStatus !== "" &&
                                                <h3 className='block text-xl mb-1 font-bold'>Beaconchain</h3>
                                            }

                                            <p className="text-yellow-500  text-md">{reduxData.beaconStatus}</p>
                                            <a className="text-black-500  hover:text-blue-300  text-md" href={`https://${currentChain === 17000 ? "holesky." : ""}beaconcha.in/validator/${reduxData.valIndex}`} target="_blank">View</a>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex items-center p-6 bg-white shadow border rounded-lg">
                                    <div className="inline-flex flex-shrink-0 items-center justify-center text-blue-600 bg-blue-100 rounded-full mr-6">
                                        <Image
                                            width={70}
                                            height={70}
                                            alt="Rocket Pool Logo"
                                            src={"/images/rocketPlogo.png"} />
                                    </div>
                                    <div>
                                        <div className='flex items-start flex-col gap-1 text-l '>
                                            <span className="text-xl font-bold">Minipool Address:</span>
                                            <p className=" w-[50%] text-wrap text-gray-500"> <ContractTag pubkey={truncateString(reduxData.address)} /></p>
                                        </div>
                                    </div>
                                </div>




                                <div className="flex items-center p-6 bg-white shadow border rounded-lg">
                                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                                        <PiSignatureBold className="text-purple-500 text-3xl" />
                                    </div>
                                    <div>
                                        <div className="flex items-start flex-col gap-1 text-l ">
                                            <p className="text-xs text-gray-600">    {reduxData.graffiti}</p>




                                            <button className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => { handleGraffitiModal(reduxData.graffiti) }}>
                                                Change
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>


                        <div className="w-full flex flex-col items-center justify-center py-10">




                        </div>



                        <div className=" w-full flex flex-col items-center justify-center gap-8  ">


                            <div className="w-[auto] h-[auto] overflow-hidden shadow border rounded-lg mb-10 ">

                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b-2">
                                            <td className="px-5  py-3 bg-gray-100 text-s font-bold w-auto text-center">

                                                <p className="text-black-500">Fee recipient</p>

                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">

                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 bg-gray-100 text-s font-bold w-auto text-center">
                                                <p>Graffiti</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">

                                                {reduxData.graffiti}

                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  bg-gray-100 py-3 text-s font-bold w-auto text-center">
                                                <p>Balance</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.valBalance}
                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 bg-gray-100 text-s font-bold w-auto text-center">
                                                <p>Validator Index</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                {reduxData.valIndex}

                                            </td>
                                        </tr>
                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                <p>Minipool Address</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">
                                                <ContractTag pubkey={truncateString(reduxData.address)} />

                                            </td>
                                        </tr>

                                        <tr className="border-b-2 ">
                                            <td className="px-5  py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                <p>Active since</p>
                                            </td>
                                            <td className="px-5  py-3 text-s w-auto text-center">

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>


                            </div>




                            <div className="w-[auto] h-[auto] overflow-hidden shadow border rounded-lg mb-10 ">

                                <table className="w-full">
                                    <tbody>

                                        {reduxData.statusResult === "Dissolved" &&

                                            <tr className="border-b-2 ">
                                                <td className="px-5 py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                    <p>Close Failed Minipool Instance</p>
                                                </td>
                                                <td className="px-5  py-3 text-s w-auto text-center">
                                                    <button onClick={() => { closeMinipool() }} className="bg-red-500 mt-2  text-xs  hover:bg-red-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Close Minipool</button>
                                                </td>
                                            </tr>

                                        }


                                        {reduxData.statusResult === "Prelaunch" &&
                                            <tr className="border-b-2 ">
                                                <td className="px-5  py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                    <p>Stake Prelaunched Minipool</p>
                                                </td>
                                                <td className="px-5 py-3 text-s w-auto text-center">
                                                    <button onClick={() => { stakeMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Stake Minipool</button>
                                                </td>
                                            </tr>
                                        }

                                        {reduxData.statusResult === "Staking" && reduxData.beaconStatus === "active_ongoing" &&
                                            <tr className="border-b-2 ">
                                                <td className="px-5 py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                    <p>Close Active Minipool</p>
                                                </td>
                                                <td className="px-5  py-3 text-s w-auto text-center">
                                                    <button onClick={handlePostExitModal} className="bg-red-500 mt-2  text-xs  hover:bg-red-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Initiate Close</button>
                                                </td>
                                            </tr>
                                        }


                                        {reduxData.beaconStatus === "withdrawal_done" &&
                                            <tr className="border-b-2 ">
                                                <td className="px-5  py-3 bg-gray-100 font-bold text-s w-auto text-center" >
                                                    <p >Distribute balance of  &quot;Withdrawn&quot; Minipool</p>
                                                </td>
                                                <td className="px-5  py-3 text-s w-auto text-center">
                                                    <button onClick={() => { distributeBalanceOfMinipool() }} className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Distribute Balance</button>
                                                </td>
                                            </tr>
                                        }

                                        {reduxData.statusResult !== "Empty" && reduxData.beaconStatus === "active_ongoing" &&
                                            <tr className="border-b-2 ">
                                                <td className="px-5  py-3 bg-gray-100 font-bold text-s w-auto text-center">
                                                    <p>Get Presigned Exit Message</p>
                                                </td>
                                                <td className="px-5 py-3 text-s w-auto text-center">
                                                    <button onClick={() => { handleGetPresignedModal() }} className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Get Exit Message</button>
                                                </td>
                                            </tr>
                                        }



                                    </tbody>
                                </table>


                            </div>

                        </div>



                        <div className="w-full h-[90vh] flex flex-col items-center justify-center">

                  <div className="mx-auto h-auto w-[50%] rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-6 shadow-2xl md:h-auto ">

                    <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-white">

                      <div className="flex items-center  h-full justify-center p-8 bg-white ">
                            {xAxisData.length > 0 && TotalGraphPlotPoints.length > 0 &&

                                <div className="w-[500px] h-[auto]  flex flex-col items-center justify-center py-3">


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
                                    <p className=" w-[100%] self-center text-wrap text-md py-2 text-gray-500">Claim Your Validator rewards on <a className=" text-blue-400 hover:text-blue-200" href="rocketsweep.app">rocketsweep.app</a></p>

                                </div>

                            }
                        </div>
                        </div>
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





                                <textarea className="border h-[200px] " value={exitMessage} onChange={handleChangeExitMessage} />



                                <div >
                                    <button className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={postPresignedExitMessage}>Post</button>
                                    <button className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md" onClick={() => setShowForm4(false)}>Cancel</button>
                                </div>
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






      <Footer/>  </div>
    )
}

export default ValidatorDetail