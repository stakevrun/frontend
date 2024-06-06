import { ethers } from 'ethers';

import storageABI from "../json/storageABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import { useAccount, useChainId } from 'wagmi';
import { getData } from "../globalredux/Features/validator/valDataSlice"
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import daoABI from "../json/daoABI.json"

import managerABI from "../json/managerABI.json"
import distributorABI from "../json/distributorABI.json"
import type { RootState } from '../globalredux/store';



const nullAddress = "0x0000000000000000000000000000000000000000";

const beaconAPIKey = process.env.BEACON
const holeskyRPCKey = process.env.HOLESKY_RPC
const mainnetRPCKey = process.env.MAINNET_RPC




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







const GetMinipoolData = () => {



    const dispatch = useDispatch()

    const { address } = useAccount({
        onConnect: ({ address }) => {
            console.log("Ethereum Wallet Connected!")
        }
    })


    const currentChain = useChainId();

    const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"






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






    const getMinipoolTruth = async () => {


        let newBool = false



        try {



            let browserProvider = new ethers.BrowserProvider((window as any).ethereum)


            let signer = await browserProvider.getSigner()

            // Only required when `chainId` is not provided in the `Provider` constructor


            const storageContract = new ethers.Contract(storageAddress, storageABI, signer);


            const NodeManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketNodeManager"))

            const rocketNodeManager = await new ethers.Contract(NodeManagerAddress, managerABI, signer)

            const bool = await rocketNodeManager.getSmoothingPoolRegistrationState(address)




            console.log("Bool:" + bool)


            if (typeof bool === "boolean") {


                newBool = bool


            }

        } catch (error) {

            console.log(error)




        }


        return newBool






    }



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


                console.log()



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




    const getMinipoolFunction = async () => {
        if (address) {


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
            })
                .then(async response => {

                    var jsonString = await response.json()


                    console.log("Result of get next index" + jsonString)


                    return jsonString;

                })
                .catch(error => {

                    console.log(error);
                });

            console.log("Next index:" + newNextIndex)


            let seperateMinipoolObjects: Array<rowObject2> = [];







            if (newNextIndex === 0) {






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
                    pubkey: "",
                    isEnabled: false,
                    valIndex: "",
                    nodeAddress: ""

                })



                dispatch(getData(seperateMinipoolObjects))








            } else {


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


                        const string = formatTime(timeRemaining);

                        console.log("Time Remaining:" + string);




                        const printGraff = await getGraffiti(pubkey);

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

                        const smoothingBool = await getMinipoolTruth()

                        const theTime = Date.now()

                        const genesisTime = 1695902400 * 1000;

                        const currentEpoch = Math.ceil((theTime - genesisTime) / 12 / 32 / 1000)

                        const withdrawalCountdown = (Number(withdrawalEpoch) - Number(currentEpoch)) * 12 * 32 * 1000;

                        const isEnabled = await getEnabled(pubkey)



                        console.log("Status:" + beaconStatusObject.status)


                        const newFeeRecipient = await getFeeRecipient(pubkey, smoothingBool)














                        let beaconObject = []

                        let newValProposals = 0;
                        let newValBalance = 0
                        let newValVariance = 0


                        if (MinipoolStatus[statusResult] === "Staking" && beaconStatus !== "") {

                            beaconObject = await getValBeaconStats(pubkey);

                            if ((beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") && beaconObject[0].start_balance !== 0) {
                                newValBalance = beaconObject[0].end_balance


                            } else {

                                newValBalance = 0

                            }


                            for (const beaconLog of beaconObject) {

                                let blocks = beaconLog.proposed_blocks

                                newValProposals += blocks
                            }

                            if (beaconStatus === "active_ongoing" || beaconStatus === "active_exiting" || beaconStatus === "exited_unslashed" || beaconStatus === "exited_slashed" || beaconStatus === "active_slashed" || beaconStatus === "withdrawal_possible" || beaconStatus === "withdrawal_done") {

                                newValVariance = beaconObject[0].end_balance - beaconObject[0].start_balance

                            }

                        }


                        currentStatus = MinipoolStatus[statusResult];







                        seperateMinipoolObjects.push({
                            address: minAddress,
                            statusResult: currentStatus,
                            statusTimeResult: numStatusTime.toString(),
                            timeRemaining: timeRemaining.toString(),
                            graffiti: typeof printGraff === "string" ? printGraff : "",
                            beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",
                            activationEpoch: activationEpoch !== undefined ? activationEpoch : "",
                            smoothingPoolTruth: smoothingBool,
                            withdrawalEpoch: withdrawalEpoch,
                            withdrawalCountdown: withdrawalCountdown.toString(),
                            feeRecipient: newFeeRecipient,


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


        } else {
            console.log("Cannot run Minipool function without a connected account")
        }
    }




    useEffect(() => {


        getMinipoolFunction()




    }, [])



}





export default GetMinipoolData;