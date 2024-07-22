import React, { useEffect, useState, useRef } from "react";
import { PieChart, LineChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { NextPage } from "next";
import { useAccount, useChainId } from "wagmi";
import { ethers } from "ethers";
import storageABI from "../json/storageABI.json";
import miniManagerABI from "../json/miniManagerABI.json";
import managerABI from "../json/managerABI.json";
import daoABI from "../json/daoABI.json";
import distributorABI from "../json/distributorABI.json";
import networkABI from "../json/networkABI.json";
import stakingABI from "../json/stakingABI.json";
import styles from "../styles/Home.module.css";
import CountdownComponent from "./countdown.jsx";
import QuickNode from "@quicknode/sdk";
import Modal from "react-modal";
import * as openpgp from "openpgp";
import { AiOutlineClose } from "react-icons/ai";
import NoRegistration from "./noRegistration";
import NoConnection from "./noConnection";
import Link from "next/link";
import { useRouter } from "next/router";
import RPLBlock from "./RPL";
import ContractTag from "../components/contractTag";
import feeABI from "../json/feeABI.json";
import { GrSatellite } from "react-icons/gr";
import { FaEthereum } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import BounceLoader from "react-spinners/BounceLoader";
import Image from "next/image";

import RollingNumber from "./rollingNumber";
import { Line, getElementsAtEvent } from "react-chartjs-2";
import type { RootState } from "../globalredux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../globalredux/Features/counter/counterSlice";
import { getData } from "../globalredux/Features/validator/valDataSlice";
import { attestationsData } from "../globalredux/Features/attestations/attestationsDataSlice";
import { getGraphPointsData } from "../globalredux/Features/graphpoints/graphPointsDataSlice";
import { getPaymentsData } from "../globalredux/Features/payments/paymentSlice";
import { getChargesData } from "../globalredux/Features/charges/chargesSlice";
import { getCollateralData } from "../globalredux/Features/collateral/collateralSlice";
import { TiTick } from "react-icons/ti";
import confetti from "canvas-confetti";
import { PiSignatureBold } from "react-icons/pi";
import { BiSolidErrorAlt } from "react-icons/bi";
import { HiOutlinePaperAirplane } from "react-icons/hi";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

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
  const triggerConfetti = () => {
    confetti();
  };

  const [data, setData] = useState("");
  const [publicKeyArmored, setPublicKeyArmored] = useState(``);

  const beaconAPIKey = process.env.BEACON;
  const holeskyRPCKey = process.env.HOLESKY_RPC;
  const mainnetRPCKey = process.env.MAINNET_RPC;

  useEffect(() => {
    console.log(publicKeyArmored);
  }, [publicKeyArmored]);

  const encryptData = async (jsonData: string) => {
    try {
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      const encrypted: string = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: jsonData }), // input as Message object
        encryptionKeys: publicKey,
      });
      return encrypted;
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  };

  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const reduxData = useSelector((state: RootState) => state.valData.data);
  const reduxGraphPoints = useSelector(
    (state: RootState) => state.graphPointsData.data
  );
  const reduxAttestations = useSelector(
    (state: RootState) => state.attestationsData.data
  );
  const reduxPayments = useSelector(
    (state: RootState) => state.paymentsData.data
  );
  const reduxCharges = useSelector(
    (state: RootState) => state.chargesData.data
  );
  const reduxCollateral = useSelector(
    (state: RootState) => state.collateralData.data
  );

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

    const blob = new Blob([encryptedData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_data.txt";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getBeaconchainStatus = async (pubkey: string) => {
    let newString;

    const currentRPC =
      currentChain === 17000
        ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
        : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

    await fetch(
      `${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`,
      {
        method: "GET",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json(); // Note: response will be opaque, won't contain data

        newString = jsonString.data.status;
        console.log(
          "Activation Epoch:" + jsonString.data.validator.activation_epoch
        );
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });

    return newString;
  };

  const getBeaconchainStatusObject = async (pubkey: string) => {
    let newObject;

    const currentRPC =
      currentChain === 17000
        ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
        : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

    await fetch(
      `${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`,
      {
        method: "GET",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json(); // Note: response will be opaque, won't contain data

        newObject = jsonString.data;
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });

    return newObject;
  };

  const getBeaconchainActivation = async (pubkey: string) => {
    let newString;

    const currentRPC =
      currentChain === 17000
        ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
        : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

    await fetch(
      `${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`,
      {
        method: "GET",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json(); // Note: response will be opaque, won't contain data

        newString = jsonString.data.validator.activation_epoch;
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });

    return newString;
  };

  const [graphTimeout, setGraphTimeout] = useState(false);

  const [checked5, setChecked5] = useState(false);

  useEffect(() => {
    const getMinipoolTruth = async () => {
      let newBool = false;

      try {
        let browserProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );

        let signer = await browserProvider.getSigner();

        // Only required when `chainId` is not provided in the `Provider` constructor

        const storageContract = new ethers.Contract(
          storageAddress,
          storageABI,
          signer
        );

        const NodeManagerAddress = await storageContract["getAddress(bytes32)"](
          ethers.id("contract.addressrocketNodeManager")
        );

        const rocketNodeManager = await new ethers.Contract(
          NodeManagerAddress,
          managerABI,
          signer
        );

        const bool = await rocketNodeManager.getSmoothingPoolRegistrationState(
          address
        );

        console.log("Bool:" + bool);

        if (typeof bool === "boolean") {
          setChecked5(bool);

          newBool = bool;
        }
      } catch (error) {
        console.log(error);
        setChecked5(false);
      }

      return newBool;
    };

    getMinipoolTruth();
  }, []);

  useEffect(() => {
    if (reduxData.length > 0 && reduxData[0].address !== "NO VALIDATORS") {
      setGraphTimeout(true);
    }

    const timer = setTimeout(() => {
      setGraphTimeout(true);
    }, 7000);

    return () => clearTimeout(timer);
    // Cleanup timeout if the component unmounts
  }, [reduxData]);

  const getMinipoolTruth = async () => {
    let newBool = false;

    try {
      let browserProvider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      let signer = await browserProvider.getSigner();

      // Only required when `chainId` is not provided in the `Provider` constructor

      const storageContract = new ethers.Contract(
        storageAddress,
        storageABI,
        signer
      );

      const NodeManagerAddress = await storageContract["getAddress(bytes32)"](
        ethers.id("contract.addressrocketNodeManager")
      );

      const rocketNodeManager = await new ethers.Contract(
        NodeManagerAddress,
        managerABI,
        signer
      );

      const bool = await rocketNodeManager.getSmoothingPoolRegistrationState(
        address
      );

      console.log("Bool:" + bool);

      if (typeof bool === "boolean") {
        setChecked2(bool);

        newBool = bool;
      }
    } catch (error) {
      console.log(error);
      setChecked2(false);
    }

    return newBool;
  };

  const getValBeaconBalance = async (pubkey: string) => {
    let newString;

    const currentRPC =
      currentChain === 17000
        ? `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
        : `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`;

    await fetch(
      `${currentRPC}eth/v1/beacon/states/finalized/validator_balances?id=${pubkey}`,
      {
        method: "GET",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json(); // Note: response will be opaque, won't contain data

        newString = jsonString.data[0].balance;

        console.log("Val Balance:" + newString);
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
      });

    if (typeof newString === "string") {
      return BigInt(newString);
    }
  };

  const [exitMessage, setExitMessage] = useState("");
  const [showForm4, setShowForm4] = useState(false);

  const handleChangeExitMessage = (e: any) => {
    setExitMessage(e.target.value);
  };

  const handlePostExitModal = () => {
    setShowForm4(true);
  };

  const getPresignedExitMessage = async (pubkey: string, index: number) => {
    /*struct GetPresignedExit {
    bytes pubkey;
    uint256 validatorIndex;
    uint256 epoch;
  }*/

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    let signer = await browserProvider.getSigner();

    //https://beaconcha.in/api/v1/slot/1?apikey=<your_key>

    const genesisTime = 1695902400 * 1000;

    let epoch;

    if (dateTime === "") {
      const theTime = Date.now();

      epoch = Math.ceil((theTime - genesisTime) / 12 / 32 / 1000);
    } else {
      const dateTimeObject = new Date(dateTime);

      // Convert the JavaScript Date object to a Unix timestamp (in milliseconds)
      const timestampValue = dateTimeObject.getTime();

      epoch = Math.ceil((timestampValue - genesisTime) / 12 / 32 / 1000);
    }

    console.log("EPOCH:" + epoch);

    const chainString = currentChain === 17000 ? "holesky." : "";

    const valIndex = await fetch(
      `https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        for (const object of jsonString.data) {
          if (object.publickey === pubkey) {
            return object.validatorindex;
          }
        }
        console.log("Result of Logs GET" + Object.entries(jsonString));
        console.log(typeof jsonString);
      })
      .catch((error) => {
        console.log(error);
      });

    const types = {
      GetPresignedExit: [
        { name: "pubkey", type: "bytes" },
        { name: "validatorIndex", type: "uint256" },
        { name: "epoch", type: "uint256" },
      ],
    };

    console.log(valIndex);

    const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
    const APItype = "GetPresignedExit";

    const value = { pubkey: pubkey, validatorIndex: valIndex, epoch: epoch };

    let signature = await signer.signTypedData(EIP712Domain, types, value);

    const data: string = await fetch(
      `https://api.vrün.com/${currentChain}/${address}/${index}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: APItype,
          data: value,
          signature: signature,
        }),
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var text = await response.text(); // Note: response will be opaque, won't contain data

        return text;
      })
      .catch((error) => {
        // Handle error here
        console.log(error);
        return "";
      });

    if (typeof data !== "undefined") {
      downloadEncryptedJSON(data);
    }
  };

  const startCountdown = (timeString: string): any => {
    // Parse time string into milliseconds
    const parts = timeString.split(" ");
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
      const formattedTime: any = (
        <div>
          ${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds
        </div>
      );
    }, 1000);
  };

  const currentChain = useChainId();

  const storageAddress =
    currentChain === 17000
      ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1"
      : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46";

  function formatTime(milliseconds: number) {
    // Convert milliseconds to seconds
    var seconds = Math.floor(milliseconds / 1000);

    // Calculate days, hours, minutes, and remaining seconds
    var days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Construct the string
    var timeString = "";
    if (days > 0) {
      timeString += days + " days ";
    }
    if (hours > 0) {
      timeString += hours + " hours ";
    }
    if (minutes > 0) {
      timeString += minutes + " minutes ";
    }
    if (seconds > 0) {
      timeString += seconds + " seconds ";
    }

    console.log(timeString);

    return timeString.trim();
  }

  const { address } = useAccount({
    onConnect: async ({ address }) => {
      console.log("Ethereum Wallet Connected!");

      if (address !== undefined) {
        try {
          const reg = await registrationCheck(address);
          setIsRegistered(reg);

          if (reg === true) {
            getMinipoolData();
            getPayments();
            getNodeCollateral(address);

            getMinipoolTruth();
            getCharges();
          }
        } catch (error) {
          // Handle any errors that occur during registration check
          console.error("Error during registration check:", error);
        }
      }
    },
  });

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (!isInitialRender && address !== undefined) {
      // This block will run after the initial render
      setPreloader(true);
      dispatch(getData([{ address: "NO VALIDATORS" }]));

      fetchData();
      dispatch(getGraphPointsData([]));
      dispatch(attestationsData([]));

      getMinipoolTruth();
      getMinipoolData();
      getNodeCollateral(address);
      getPayments();
      getCharges();
    } else {
      // This block will run only on the initial render
      setPreloader(true);
      setIsInitialRender(false);
    }
  }, [currentChain, address]);

  const [registrationResult, setRegistrationResult] = useState({ result: "" });
  const [isRegistered, setIsRegistered] = useState(true);

  const handleRegistrationResult = (result: any) => {
    setRegistrationResult(result);
    // Do whatever you need with the result here
  };

  const fetchData = async () => {
    console.log("triggered");
    // Your async code here
    try {
      if (address !== undefined) {
        const result = await registrationCheck(address);

        setIsRegistered(result);
      }
      // Example async function call
      // Do something with the result
    } catch (error) {
      // Handle errors
    }
  };

  useEffect(() => {
    console.log("Receiving result");

    console.log(registrationResult);

    fetchData(); // Call the async function
  }, [registrationResult]);

  const registrationCheck = async (add: string) => {
    if (typeof (window as any).ethereum !== "undefined") {
      console.log("Reg Spot 1");

      try {
        let browserProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        let signer = await browserProvider.getSigner();

        const storageContract = new ethers.Contract(
          storageAddress,
          storageABI,
          signer
        );
        console.log("Storage Contract:" + storageContract);

        const NodeManagerAddress = await storageContract["getAddress(bytes32)"](
          ethers.id("contract.addressrocketNodeManager")
        );

        const rocketNodeManager = await new ethers.Contract(
          NodeManagerAddress,
          managerABI,
          signer
        );
        console.log("Rocket Node Manager:" + rocketNodeManager);
        const bool = await rocketNodeManager.getNodeExists(add);

        console.log("Bool:" + bool);

        return bool;
      } catch (error) {
        console.log(error);

        return false;
      }
    } else {
      console.log("Window not working");

      return false;
    }
  };

  const nullAddress = "0x0000000000000000000000000000000000000000";

  const [totalValidators, setTotalValidators] = useState("0");
  const [runningValidators, setRunningValidators] = useState("0");

  const getValIndex = async (pubkey: string) => {
    const chainString = currentChain === 17000 ? "holesky." : "";

    const valIndex = await fetch(
      `https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        for (const object of jsonString.data) {
          if (object.publickey === pubkey) {
            return object.validatorindex;
          }
        }
        console.log("Result of Logs GET" + Object.entries(jsonString));
        console.log(typeof jsonString);
      })
      .catch((error) => {
        console.log(error);
      });

    return valIndex;
  };

  const getEnabled = async (pubkey: string) => {
    const enabled = await fetch(
      `https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetEnabled&start=-1`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        console.log("GET Enabled" + Object.entries(jsonString));

        const entries = Object.entries(jsonString);

        console.log("grafitti entries:" + entries);
        const entriesOfEntries = Object.entries(entries);

        const newObject = Object(entriesOfEntries[0][1][1]);

        let currentEnablement = newObject.enabled;

        console.log(currentEnablement);

        return currentEnablement;
      })
      .catch((error) => {
        console.log(error);
      });

    return enabled;
  };

  const getFeeRecipient = async (pubkey: string, bool: boolean) => {
    let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    let signer = await browserProvider.getSigner();
    const storageContract = new ethers.Contract(
      storageAddress,
      storageABI,
      signer
    );
    const distributorAddress = await storageContract["getAddress(bytes32)"](
      ethers.id("contract.addressrocketNodeDistributorFactory")
    );
    const distributorContract = new ethers.Contract(
      distributorAddress,
      distributorABI,
      signer
    );

    let feeRecipient;

    if (bool) {
      feeRecipient = await storageContract["getAddress(bytes32)"](
        ethers.id("contract.addressrocketSmoothingPool")
      );
    } else {
      feeRecipient = await distributorContract.getProxyAddress(address);
    }

    return feeRecipient;
  };

  const [preloader, setPreloader] = useState(true);

  const [validatorsInNeedOfAction, setValidatorsInNeedOfAction] = useState({
    withdrawn: 0,
    stake: 0,
    close: 0,
  });

  const getValidatorsInNeedOfAction = () => {
    let withdrawnNum = 0;
    let stakeNum = 0;
    let closeNum = 0;

    for (const object of reduxData) {
      if (
        object.beaconStatus === "withdrawl_done" &&
        Number(object.minipoolBalance) > 0
      ) {
        withdrawnNum += 1;
      }

      if (
        object.statusResult === "Prelaunch" &&
        Number(object.timeRemaining) <= 0 &&
        Number(object.minipoolBalance) > 0
      ) {
        stakeNum += 1;
      }

      if (object.statusResult === "Dissolved") {
        closeNum += 1;
      }
    }

    return {
      withdrawn: withdrawnNum,
      stake: stakeNum,
      close: closeNum,
    };
  };

  const [timeToStake, setTimeToStake] = useState(false);

  const getMinipoolData = async () => {
    let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    let signer = await browserProvider.getSigner();
    const storageContract = new ethers.Contract(
      storageAddress,
      storageABI,
      signer
    );
    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](
      ethers.id("contract.addressrocketMinipoolManager")
    );
    const MinipoolManager = new ethers.Contract(
      MinipoolManagerAddress,
      miniManagerABI,
      signer
    );

    //Get latest index

    const newNextIndex = await fetch(
      `https://api.vrün.com/${currentChain}/${address}/nextindex`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        console.log("Result of get next index" + jsonString);

        return jsonString;
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Next index:" + newNextIndex);

    let minipoolObjects: Array<rowObject> = [];
    let seperateMinipoolObjects: Array<rowObject2> = [];

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
      withdrawals_amount: BigInt(0),
    };

    if (newNextIndex === 0) {
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
        pubkey: "",
      });

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
        minipoolBalance: "",
        pubkey: "",
        isEnabled: false,
        valIndex: "",
        nodeAddress: "",
      });

      setRunningValidators("0");
      setTotalValidators("0");
      setCurrentRowData(minipoolObjects);
      dispatch(getData(seperateMinipoolObjects));
    } else {
      //Get all pubkeys

      let attachedPubkeyArray: Array<Array<string>> = [];

      for (let i = 0; i <= newNextIndex - 1; i++) {
        await fetch(
          `https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
            },
        mode: "no-cors",
          }
        )
          .then(async (response) => {
            let pubkey = await response.json();

            let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(
              pubkey
            );

            if (minipoolAddress === nullAddress) {
              attachedPubkeyArray.push(["Null minipool", pubkey]);
            } else {
              attachedPubkeyArray.push([minipoolAddress, pubkey]);
            }

            console.log("Get minipool result:" + minipoolAddress);
          })
          .catch((error) => {});
      }

      let newRunningVals = 0;
      let newTotalVals = 0;

      for (const [minAddress, pubkey] of attachedPubkeyArray) {
        if (minAddress === "Null minipool") {
          minipoolObjects.push({
            address: address !== undefined ? address.toString() : "",
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
            nodeAddress: "",
          });
        } else {
          const minipool = new ethers.Contract(
            minAddress,
            [
              "function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)",
              " function canStake() view returns (bool)",
              " function  getStatus() view returns (uint8)",
              "function getStatusTime() view returns (uint256)",
              "function getNodeDepositBalance() view returns (uint256)",
              "function getNodeRefundBalance() view returns (uint256)",
              "function getUserDistributed() view returns (bool)",
              "function getVacant() view returns (bool)",
              "function getUserDepositBalance() view returns (uint256)",
            ],
            signer
          );

          const statusResult = await minipool.getStatus();
          const statusTimeResult = await minipool.getStatusTime();
          const nodeDepositBalance = await minipool.getNodeDepositBalance();
          const balance = await browserProvider.getBalance(minAddress);

          console.log("Minipool balance:" + balance);

          const numStatusTime = Number(statusTimeResult) * 1000;

          console.log("Status Result:" + statusResult);

          console.log("Status Time Result:" + statusTimeResult);

          console.log(Date.now());
          console.log(numStatusTime);

          const MinipoolStatus = [
            "Initialised",
            "Prelaunch",
            "Staking",
            "Withdrawable",
            "Dissolved",
          ];

          let currentStatus = "";

          if (MinipoolStatus[statusResult] === "Staking") {
            newRunningVals += 1;
            newTotalVals += 1;
          } else {
            newTotalVals += 1;
          }

          const DAOAddress = await storageContract["getAddress(bytes32)"](
            ethers.id("contract.addressrocketDAONodeTrustedSettingsMinipool")
          );

          const DAOContract = new ethers.Contract(DAOAddress, daoABI, signer);

          const scrubPeriod: any = await DAOContract.getScrubPeriod();

          const numScrub = Number(scrubPeriod) * 1000;
          console.log(numScrub);

          const timeRemaining: number = numScrub - (Date.now() - numStatusTime);

          const string = formatTime(timeRemaining);

          console.log("Time Remaining:" + string);

          const printGraff = await getGraffiti(pubkey);

          type statusType = {
            index: string;
            balance: string;
            status: string;
            validator: {
              pubkey: string;
              withdrawal_credentials: string;
              effective_balance: string;
              slashed: boolean;
              activation_eligibility_epoch: string;
              activation_epoch: string;
              exit_epoch: string;
              withdrawable_epoch: string;
            };
          };

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
              withdrawable_epoch: "",
            },
          };

          let newBeaconStatusObject = await getBeaconchainStatusObject(pubkey);

          beaconStatusObject =
            newBeaconStatusObject !== undefined
              ? newBeaconStatusObject
              : beaconStatusObject;
          const beaconStatus =
            typeof beaconStatusObject === "object"
              ? beaconStatusObject.status
              : "";
          const activationEpoch =
            beaconStatusObject !== undefined
              ? beaconStatusObject.validator.activation_epoch
              : "";
          const withdrawalEpoch =
            beaconStatusObject !== undefined
              ? beaconStatusObject.validator.withdrawable_epoch
              : "";
          const valIndex =
            beaconStatusObject !== undefined ? beaconStatusObject.index : "";

          const smoothingBool = await getMinipoolTruth();

          const genesisTime = 1695902400 * 1000;

          const theTime = Date.now();

          const currentEpoch = Math.ceil(
            (theTime - genesisTime) / 12 / 32 / 1000
          );

          const withdrawalCountdown =
            (Number(withdrawalEpoch) - Number(currentEpoch)) * 12 * 32 * 1000;

          const isEnabled = await getEnabled(pubkey);

          console.log("Status:" + beaconStatusObject.status);

          const newFeeRecipient = await getFeeRecipient(pubkey, smoothingBool);

          let beaconObject = [];

          let newValProposals = 0;
          let newValBalance = 0;
          let newValVariance = 0;

          if (
            MinipoolStatus[statusResult] === "Staking" &&
            beaconStatus !== ""
          ) {
            beaconObject = await getValBeaconStats(pubkey);

            if (
              (beaconStatus === "active_ongoing" ||
                beaconStatus === "active_exiting" ||
                beaconStatus === "exited_unslashed" ||
                beaconStatus === "exited_slashed" ||
                beaconStatus === "active_slashed" ||
                beaconStatus === "withdrawal_possible" ||
                beaconStatus === "withdrawal_done") &&
              beaconObject
            ) {
              newValBalance = beaconObject[0].end_balance;

              for (const beaconLog of beaconObject) {
                let blocks = beaconLog.proposed_blocks;

                newValProposals += blocks;
              }
            } else {
              newValBalance = 0;
            }

            if (
              (beaconStatus === "active_ongoing" ||
                beaconStatus === "active_exiting" ||
                beaconStatus === "exited_unslashed" ||
                beaconStatus === "exited_slashed" ||
                beaconStatus === "active_slashed" ||
                beaconStatus === "withdrawal_possible" ||
                beaconStatus === "withdrawal_done") &&
              beaconObject
            ) {
              newValVariance =
                beaconObject[0].end_balance - beaconObject[0].start_balance;
            }
          }

          if (
            Number(ethers.formatEther(balance)) === 0 &&
            beaconStatus === "withdrawal_done"
          ) {
            currentStatus = "Empty";
          } else {
            currentStatus = MinipoolStatus[statusResult];
          }

          minipoolObjects.push({
            address: minAddress,
            statusResult: currentStatus,
            statusTimeResult: numStatusTime.toString(),
            timeRemaining: timeRemaining.toString(),
            graffiti: typeof printGraff === "string" ? printGraff : "",
            beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",

            beaconLogs:
              typeof beaconObject === "object"
                ? beaconObject
                : [emptyValidatorData],
            valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
            valProposals: newValProposals.toString(),
            valDayVariance: ethers
              .formatUnits(newValVariance, "gwei")
              .toString(),

            pubkey: pubkey,
          });

          seperateMinipoolObjects.push({
            address: minAddress,
            statusResult: currentStatus,
            statusTimeResult: numStatusTime.toString(),
            timeRemaining: timeRemaining.toString(),
            graffiti: typeof printGraff === "string" ? printGraff : "",
            beaconStatus: typeof beaconStatus === "string" ? beaconStatus : "",
            activationEpoch:
              activationEpoch !== undefined ? activationEpoch : "",
            smoothingPoolTruth: smoothingBool,
            withdrawalEpoch: withdrawalEpoch,
            withdrawalCountdown: withdrawalCountdown.toString(),
            feeRecipient: newFeeRecipient,

            valBalance: ethers.formatUnits(newValBalance, "gwei").toString(),
            valProposals: newValProposals.toString(),
            valDayVariance: ethers
              .formatUnits(newValVariance, "gwei")
              .toString(),
            minipoolBalance: ethers.formatEther(balance),
            isEnabled: isEnabled,
            valIndex: valIndex,
            pubkey: pubkey,
            nodeAddress: address !== undefined ? address.toString() : "",
          });
        }
      }

      setRunningValidators(newRunningVals.toString());
      setTotalValidators(newTotalVals.toString());
      setCurrentRowData(minipoolObjects);
      dispatch(getData(seperateMinipoolObjects));
    }
  };

  useEffect(() => {
    if (reduxData.length > 0 && reduxData[0].address !== "NO VALIDATORS") {
      setPreloader(true);
      getPayments();
      getCharges();

      getMinipoolTruth();

      setValidatorsInNeedOfAction(getValidatorsInNeedOfAction());

      console.log("WOOOH!");
      setChecked2(reduxData[0].smoothingPoolTruth);

      let newRunningVals = 0;
      let newTotalVals = 0;

      for (const log of reduxData) {
        console.log("Log of reduxData:" + Object.entries(log));
        console.log("Redux loop running");

        if (log.beaconStatus === "active_ongoing") {
          newRunningVals += 1;
          newTotalVals += 1;
        } else {
          if (log.statusResult === "Prelaunch") {
            newTotalVals += 1;
          } else if (log.statusResult === "Initialised") {
            newTotalVals += 1;
          } else if (
            log.statusResult === "Staking" &&
            log.beaconStatus === "withdrawal_done" &&
            Number(log.minipoolBalance) > 0
          ) {
            newTotalVals += 1;
          } else if (
            log.statusResult === "Staking" &&
            log.beaconStatus !== "withdrawal_done"
          ) {
            newTotalVals += 1;
          }
        }
      }

      setRunningValidators(newRunningVals.toString());
      setTotalValidators(newTotalVals.toString());
      setPreloader(false);
    } else {
      setPreloader(true);
      setRunningValidators("0");
      setTotalValidators("0");
    }
  }, [reduxData]);

  const setFeeRecipient = async (inOutBool: boolean) => {
    let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    let signer = await browserProvider.getSigner();

    /*  struct SetFeeRecipient {
  uint256 timestamp;
  bytes pubkey;
  address feeRecipient;
} */

    const newNextIndex = await fetch(
      `https://api.vrün.com/${currentChain}/${address}/nextindex`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        console.log("Result of get next index" + jsonString);

        return jsonString;
      })
      .catch((error) => {
        console.log(error);
      });

    if (newNextIndex === 0) {
      setErrorBoxTest2("No Validators to change the Fee Recipient for");
    } else {
      const storageContract = new ethers.Contract(
        storageAddress,
        storageABI,
        signer
      );
      const distributorAddress = await storageContract["getAddress(bytes32)"](
        ethers.id("contract.addressrocketNodeDistributorFactory")
      );
      const distributorContract = new ethers.Contract(
        distributorAddress,
        distributorABI,
        signer
      );

      let newPubkeyArray: Array<string> = [];
      let newIndexArray: Array<number> = [];

      for (let i = 0; i <= newNextIndex - 1; i++) {
        await fetch(
          `https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
            },
        mode: "no-cors",
          }
        )
          .then(async (response) => {
            let pubkey = await response.json();

            newPubkeyArray.push(pubkey);
            newIndexArray.push(i);

            console.log("pUBKEY:" + pubkey);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      console.log(newPubkeyArray);
      console.log(newIndexArray);

      const types = {
        SetFeeRecipient: [
          { name: "timestamp", type: "uint256" },
          { name: "pubkeys", type: "bytes[]" },
          { name: "feeRecipient", type: "address" },
        ],
      };

      let newFeeRecipient;

      if (inOutBool === true) {
        newFeeRecipient = await storageContract["getAddress(bytes32)"](
          ethers.id("contract.addressrocketSmoothingPool")
        );
        console.log("It is true dough!");
        console.log(newFeeRecipient);
      } else {
        newFeeRecipient = await distributorContract.getProxyAddress(address);
        console.log(newFeeRecipient);
      }

      const EIP712Domain = {
        name: "vrün",
        version: "1",
        chainId: currentChain,
      };
      const APItype = "SetFeeRecipient";

      const date = Math.floor(Date.now() / 1000);

      const value = {
        timestamp: date,
        pubkeys: newPubkeyArray,
        feeRecipient: newFeeRecipient,
      };

      let signature = await signer.signTypedData(EIP712Domain, types, value);

      await fetch(`https://api.vrün.com/${currentChain}/${address}/batch`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: APItype,
          data: value,
          signature: signature,
          indices: newIndexArray,
        }),
        mode: "no-cors",
      })
        .then(async (response) => {
          var resString = await response.text(); // Note: response will be opaque, won't contain data

          console.log("Get Deposit Data response" + resString);
          alert(
            "Success! There should be Confetti here and preloader over buttons!"
          );

          alert("setFeeRecipient success!");
        })
        .catch((error) => {
          // Handle error here
          console.log(error);
          setErrorBoxTest2(error.toString());
        });
    }
  };

  const [graffitiError, setGraffitiError] = useState("");

  useEffect(() => {
    if (graffitiError !== "") {
      const handleText = () => {
        setGraffitiError("");
      };

      const timeoutId = setTimeout(handleText, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [graffitiError]);

  const setIncrementerWithDelay = (value: number, delay: number) => {
    setTimeout(() => {
      setIncrementer(value);
    }, delay);
  };

  const setGraffiti = async (newGrafitti: string) => {
    if (newGrafitti !== "") {
      setShowForm(false);
      setShowFormEditGraffiti(true);
      setIncrementer(0);
      try {
        let browserProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        let signer = await browserProvider.getSigner();

        /*  struct SetFeeRecipient {
      uint256 timestamp;
      bytes pubkey;
      address feeRecipient;
    } */

        const types = {
          SetGraffiti: [
            { name: "timestamp", type: "uint256" },
            { name: "pubkeys", type: "bytes[]" },
            { name: "graffiti", type: "string" },
          ],
        };

        let pubkeyArray = [];
        let indexArray = [];

        let i = 0;

        for (const data of reduxData) {
          indexArray.push(i);

          pubkeyArray.push(data.pubkey);

          i++;
        }

        const EIP712Domain = {
          name: "vrün",
          version: "1",
          chainId: currentChain,
        };
        const APItype = "SetGraffiti";

        const date = Math.floor(Date.now() / 1000);

        const value = {
          timestamp: date,
          pubkeys: pubkeyArray,
          graffiti: newGrafitti,
        };

        let signature = await signer.signTypedData(EIP712Domain, types, value);

        await fetch(`https://api.vrün.com/${currentChain}/${address}/batch`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: APItype,
            data: value,
            signature: signature,
            indices: indexArray,
          }),
        mode: "no-cors",
        })
          .then(async (response) => {
            var jsonString = await response.json(); // Note: response will be opaque, won't contain data

            console.log("Get Deposit Data response" + jsonString);
          })
          .catch((error) => {
            // Handle error here
            console.log(error);

            setGraffitiError(error.toString());
            setIncrementer(5);
          });

        setIncrementer(1);
        const data = await getMinipoolData();

        setIncrementer(2);

        setIncrementerWithDelay(4, 400);
      } catch (e: any) {
        if (e.reason === "rejected") {
          setGraffitiError(e.info.error.message.toString());
        } else if (e.error) {
          setGraffitiError(e.error["message"].toString());
        } else {
          setGraffitiError("An Unknown error occured, please try again");
        }
        setIncrementer(5);
      }
    } else {
      setGraffitiError("You must input a new Graffiti!");
      setIncrementer(5);
    }
  };

  function truncateString(str: string) {
    if (str.length <= 15) {
      return str;
    } else {
      return str.slice(0, 15) + "...";
    }
  }

  const [currentRowData, setCurrentRowData] = useState<Array<rowObject>>([]);

  function calculateAveragePlotPoints(
    newPlotPointsArray: Array<Array<number>>
  ) {
    const averagePlotPoints = [];

    // Check if newPlotPointsArray is not empty
    if (newPlotPointsArray.length > 0) {
      const numArrays = newPlotPointsArray.length;

      // Find the maximum length among all inner arrays
      const maxLength = newPlotPointsArray.reduce(
        (max, arr) => Math.max(max, arr.length),
        0
      );

      // Iterate over each index up to the maximum length
      for (let i = 0; i < maxLength; i++) {
        let sum = 0;
        let count = 0;

        // Calculate the sum of values at the current index across all inner arrays
        for (let j = 0; j < numArrays; j++) {
          if (i < newPlotPointsArray[j].length) {
            sum += newPlotPointsArray[j][i];
            count++;
          }
        }

        // Calculate the average and push it to the averagePlotPoints array
        if (count > 0) {
          averagePlotPoints.push(sum / count);
        }
      }
    }

    return averagePlotPoints;
  }

  const [TotalGraphPlotPoints, setTotalGraphPlotPoints] = useState<
    Array<number>
  >([]);
  const [xAxisData, setXAxisData] = useState<Array<number>>([]);
  const [graphState, setGraphState] = useState("Week");

  const attestationsPerDay = 225;

  const [percentageAttestations, setPercentageAttestations] = useState(0);

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
    let average = 0;

    if (totalSum > 0 && totalCount > 0) {
      average = totalSum / totalCount;
    } else {
      average = 0;
    }

    return average;
  }

  const targetRef = useRef<HTMLDivElement>(null);

  const handleScrollToElement = () => {
    if (targetRef.current) {
      setShowForm5(false);
      window.scrollTo({
        top: targetRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const getAttestationData = async () => {
    let newMissedAttestationsArray: Array<Array<number>> = [];

    for (const object of currentRowData) {
      let newMissedAttestations: Array<number> = [];

      for (const log of object.beaconLogs) {
        if (object.statusResult === "Staking") {
          let newMissed;

          if (Number(log.missed_attestations) > 0) {
            newMissed =
              100 -
              Math.floor((log.missed_attestations / attestationsPerDay) * 100);
          } else {
            newMissed = 100;
          }

          console.log(newMissed);

          console.log("New Missed:" + newMissed);

          newMissedAttestations.push(newMissed);
        }
      }

      newMissedAttestationsArray.push(newMissedAttestations);
    }

    dispatch(attestationsData(newMissedAttestationsArray));
  };

  const convertToGraphPlotPoints = async () => {
    let newPlotPointsArray: Array<Array<number>> = [];

    for (const object of currentRowData) {
      let newPlotPoints: Array<number> = [];

      for (const log of object.beaconLogs) {
        if (
          object.statusResult === "Staking" &&
          Number(log.end_balance) !== 0
        ) {
          let variance = Math.abs(
            Number(log.end_effective_balance - log.end_balance)
          );

          let editedVariance = Number(ethers.formatUnits(variance, "gwei"));

          newPlotPoints.push(editedVariance);
        }
      }

      newPlotPointsArray.push(newPlotPoints);
    }

    if (newPlotPointsArray.length > 0) {
      dispatch(getGraphPointsData(newPlotPointsArray));
    }
  };

  useEffect(() => {
    if (TotalGraphPlotPoints.length > 0) {
      console.log(TotalGraphPlotPoints);

      const xAxisDataArray = Array.from(
        { length: TotalGraphPlotPoints.length },
        (_, i) => i + 1
      );
      setXAxisData(xAxisDataArray);
    }
  }, [TotalGraphPlotPoints]);

  useEffect(() => {
    if (currentRowData.length >= 1) {
      convertToGraphPlotPoints();
      getAttestationData();
    }
  }, [currentRowData]);

  type beaconLog = {
    attester_slashings: bigint;
    day: number;
    day_end: string;
    day_start: string;
    deposits: bigint;
    deposits_amount: bigint;
    end_balance: bigint;
    end_effective_balance: bigint;
    max_balance: bigint;
    max_effective_balance: bigint;
    min_balance: bigint;
    min_effective_balance: bigint;
    missed_attestations: number;
    missed_blocks: number;
    missed_sync: number;
    orphaned_attestations: number;
    orphaned_blocks: number;
    orphaned_sync: number;
    participated_sync: number;
    proposed_blocks: number;
    proposer_slashings: bigint;
    start_balance: bigint;
    start_effective_balance: bigint;
    validatorindex: number;
    withdrawals: bigint;
    withdrawals_amount: bigint;
  };

  type beaconLogs = Array<beaconLog>;

  type rowObject = {
    address: string;
    statusResult: string;
    statusTimeResult: string;
    timeRemaining: string;
    pubkey: string;
    beaconStatus: string;
    beaconLogs: beaconLogs;
    valBalance: string;
    valProposals: string;
    valDayVariance: string;

    graffiti: string;
  };

  type rowObject2 = {
    address: string;
    statusResult: string;
    statusTimeResult: string;
    timeRemaining: string;
    pubkey: string;
    beaconStatus: string;

    valBalance: string;
    valProposals: string;
    valDayVariance: string;
    minipoolBalance: string;
    activationEpoch: string;
    smoothingPoolTruth: boolean;
    withdrawalEpoch: string;
    withdrawalCountdown: string;
    feeRecipient: string;

    graffiti: string;
    isEnabled: boolean;
    valIndex: string;
    nodeAddress: string;
  };

  useEffect(() => {
    setTotalGraphPlotPoints(calculateAveragePlotPoints(reduxGraphPoints));
  }, [reduxGraphPoints]);

  useEffect(() => {
    setPercentageAttestations(calculateAverage(reduxAttestations));

    console.log("Redux attestations:" + reduxAttestations);
  }, [reduxAttestations]);

  const getValBeaconStats = async (pubkey: string) => {
    let newLogs: beaconLogs;

    const chainString = currentChain === 17000 ? "holesky." : "";

    const valIndex = await fetch(
      `https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        console.log();

        for (const object of jsonString.data) {
          if (object.publickey === pubkey) {
            return object.validatorindex;
          }
        }
        console.log("Result of Logs GET" + Object.entries(jsonString));
        console.log(typeof jsonString);
      })
      .catch((error) => {
        console.log(error);
      });

    //  https://holesky.beaconcha.in/api/v1/validator/stats/${valindex}

    const valStats = await fetch(
      `https://${chainString}beaconcha.in/api/v1/validator/stats/${valIndex}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        return jsonString.data;
      })
      .catch((error) => {
        console.log(error);
      });

    return valStats;
  };

  const [currentPayments, setCurrentPayments] = useState<number>(0);
  const [currentCharges, setCurrentCharges] = useState<number>(0);

  const getCharges = async () => {
    let totalCharges = 0;

    for (const data of reduxData) {
      console.log("Deffo here...");

      // https://fee.vrun.com

      const charges: number = await fetch(
        `https://fee.vrün.com/${currentChain}/${address}/${data.pubkey}/charges`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        mode: "no-cors",
        }
      )
        .then(async (response) => {
          var jsonObject = await response.json();

          console.log("An Object of Power:" + Object.entries(jsonObject));
          let numDays = 0;

          for (const object of jsonObject) {
            console.log("Charges object:" + Object.entries(object));

            numDays += object.numDays;
          }

          return numDays;
        })
        .catch((error) => {
          console.log("Charges" + error);
          return 0;
        });

      totalCharges += charges;
    }

    let totalETH = totalCharges * 0.0001;

    dispatch(getChargesData(totalETH));
  };

  useEffect(() => {
    console.log("Current Charges:" + currentCharges);
  }, [currentCharges]);

  const getPayments = async () => {
    type RowType = {
      payments: number; // Assuming payments are numbers for calculation
    };

    let paymentData: Array<RowType> = [];

    const payments: string = await fetch(
      `https://fee.vrün.com/${currentChain}/${address}/payments`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var jsonObject = await response.json();

        let balance = BigInt(0);
        for (const [tokenAddress, payments] of Object.entries(jsonObject)) {
          const paymentsObject = Object(payments);

          for (const { amount, timestamp, tx } of paymentsObject) {
            balance += BigInt(amount);
          }
        }

        return ethers.formatEther(balance);
      })
      .catch((error) => {
        console.log(error);
        return "";
      });

    setCurrentPayments(Number(payments));
    dispatch(getPaymentsData(Number(payments)));
  };

  const getGraffiti = async (pubkey: string) => {
    const graffiti = await fetch(
      `https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetGraffiti&start=-1`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      }
    )
      .then(async (response) => {
        var jsonString = await response.json();

        console.log("GET Graffiti" + Object.entries(jsonString));

        const entries = Object.entries(jsonString);

        console.log("grafitti entries:" + entries);
        const entriesOfEntries = Object.entries(entries);

        const newObject = Object(entriesOfEntries[0][1][1]);

        let currentGraffiti = newObject.graffiti;

        console.log(currentGraffiti);

        return currentGraffiti;
      })
      .catch((error) => {
        console.log(error);
      });

    return graffiti;
  };

  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [currentEditGraffiti, setCurrentEditGraffiti] = useState("");
  const [currentPubkey, setCurrentPubkey] = useState("");
  const [currentPubkeyIndex, setCurrentPubkeyIndex] = useState(0);

  const handleGraffitiChange = (e: any) => {
    setCurrentEditGraffiti(e.target.value);
  };

  const handlePublicKeyArmored = (e: any) => {
    setPublicKeyArmored(e.target.value);
  };

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [errorBoxText2, setErrorBoxTest2] = useState("");

  const handleChecked = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked(checked);
  };

  const handleChecked2 = (e: any) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setChecked2(checked);
  };

  const handleGraffitiModal = () => {
    setShowForm(true);
  };

  useEffect(() => {
    console.log(currentEditGraffiti);
  }, [currentEditGraffiti]);

  const confirmGraffiti = () => {
    setGraffiti(currentEditGraffiti);
  };

  const confirmGetPresigned = () => {
    getPresignedExitMessage(currentPubkey, currentPubkeyIndex);
  };

  const handleGetPresignedModal = (index: number, pubkey: string) => {
    setShowForm2(true);
    setCurrentPubkey(pubkey);
    setCurrentPubkeyIndex(index);
  };

  const [showForm3, setShowForm3] = useState(false);

  const handlePaymentModal = () => {
    setShowForm3(true);
  };

  const [dateTime, setDateTime] = useState("");

  const [feeETHInput, setFeeETHInput] = useState("");

  const handleETHInput = (e: any) => {
    setFeeETHInput(e.target.value);
  };

  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

  useEffect(() => {
    if (paymentErrorMessage !== "") {
      const handleText = () => {
        setPaymentErrorMessage("");
      };

      const timeoutId = setTimeout(handleText, 6000);

      return () => clearTimeout(timeoutId);
    }
  }, [paymentErrorMessage]);

  const makePayment = async () => {
    try {
      let browserProvider = new ethers.BrowserProvider(
        (window as any).ethereum
      );
      let signer = await browserProvider.getSigner();

      const feeAddress = "0x272347F941fb5f35854D8f5DbDcEdef1A515dB41";

      const FeeContract = new ethers.Contract(feeAddress, feeABI, signer);

      let result = await FeeContract.payEther({
        value: ethers.parseEther(feeETHInput),
      });

      let receipt = await result.wait();

      // Check if the transaction was successful (status === 1)
      if (receipt.status === 1) {
        // If successful, setShowForm3(false)

        setFeeETHInput("");
        getPayments();

        alert(
          "Success! There should be Confetti here and preloader over buttons!"
        );
        setShowForm3(false);
        console.log("Transaction successful:", receipt);
      } else {
        console.error("Transaction failed:", result);
        // Handle the failure if needed

        setPaymentErrorMessage(result);
      }
    } catch (e: any) {
      if (e.reason === "rejected") {
        setPaymentErrorMessage(e.reason.toString());
      } else {
        setPaymentErrorMessage(e.error["message"].toString());
      }
    }
  };

  const router = useRouter();

  const handleClick = (param1: string, param2: number) => {
    router.push(`/validatorDetail/${param1}/${param2}`);
  };

  const getGraphData = (
    graphState: string,
    xAxisData: Array<number>,
    TotalGraphPlotPoints: Array<number>
  ) => {
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
          label: "Daily Rewards Tracker",
          data: slicedData.reverse(),
          backgroundColor: "aqua",
          borderColor: "black",
          pointBorderColor: "aqua",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const graphData = getGraphData(graphState, xAxisData, TotalGraphPlotPoints);

  useEffect(() => {
    console.log("Datasets:" + Object.entries(graphData.datasets));

    const newOne = Object.entries(graphData.datasets);

    console.log(Object.entries(newOne));
  }, [graphData]);

  const options = {
    scales: {
      y: {
        min: 0,
        max: 0.05,
      },
    },
  };

  const charRef = useRef<any>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        charRef.current &&
        charRef
      ) {
        charRef.current.update();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const onClick = (event: any) => {
    console.log(charRef);

    if (typeof charRef.current !== "undefined") {
      console.log(getElementsAtEvent(charRef.current, event)[0].datasetIndex);
    }
  };

  const handleOptSmoothingPool = async () => {
    setIncrementer(0);
    setShowFormSmoothingPool(true);
    setShowForm6(false);

    if (typeof (window as any).ethereum !== "undefined") {
      try {
        let browserProvider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        let signer = await browserProvider.getSigner();

        const storageContract = new ethers.Contract(
          storageAddress,
          storageABI,
          signer
        );

        const NodeManagerAddress = await storageContract["getAddress(bytes32)"](
          ethers.id("contract.addressrocketNodeManager")
        );

        const rocketNodeManager = await new ethers.Contract(
          NodeManagerAddress,
          managerABI,
          signer
        );
        console.log("Rocket Node Manager:" + rocketNodeManager);
        const tx = await rocketNodeManager.setSmoothingPoolRegistrationState(
          checked2
        );
        console.log(tx);

        setIncrementer(1);

        // Listen for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        if (receipt.status === 1) {
          setIncrementer(2);

          const data = await getMinipoolData();

          setIncrementerWithDelay(4, 300);
        } else {
          setIncrementer(5);
          setErrorBoxTest2("An Unknown error has occured. Please try again.");
        }

        // Check if transaction was successful
      } catch (error) {
        let input: any = error;

        if (input.reason) {
          setErrorBoxTest2(input.info.error.message.toString());
        } else if (input.error) {
          setErrorBoxTest2(input.error["message"].toString());
        } else {
          setErrorBoxTest2("An Unknown error has occured");
        }

        setIncrementer(5);
      }
    }
  };

  const [showForm5, setShowForm5] = useState(false);
  const [modalRendered, setModalRendered] = useState(false);

  useEffect(() => {
    if (
      (validatorsInNeedOfAction.close > 0 ||
        validatorsInNeedOfAction.withdrawn > 0 ||
        validatorsInNeedOfAction.stake > 0) &&
      modalRendered === false
    ) {
      setShowForm5(true);

      console.log("TOTAL VAL:" + totalValidators);
      console.log("RUNNING VAL:" + runningValidators);
      console.log(
        "Total:" + (Number(totalValidators) - Number(runningValidators))
      );
      setModalRendered(true);
    }
  }, [validatorsInNeedOfAction]);

  const [showFormEffect, setShowFormEffect] = useState(false);
  const [showFormEffect3, setShowFormEffect3] = useState(false);
  const [showFormEffect5, setShowFormEffect5] = useState(false);

  useEffect(() => {
    setShowFormEffect(showForm);
  }, [showForm]);

  useEffect(() => {
    setShowFormEffect3(showForm3);
  }, [showForm3]);

  useEffect(() => {
    setShowFormEffect5(showForm5);
  }, [showForm5]);

  const [showFormEffect6, setShowFormEffect6] = useState(false);
  const [showForm6, setShowForm6] = useState(false);

  useEffect(() => {
    setShowFormEffect6(showForm6);
  }, [showForm6]);

  const [nodeCollateral, setNodeCollateral] = useState(0);

  function wei(number: number) {
    return number * Math.pow(10, -18);
  }

  const getNodeCollateral = async (add: string) => {
    let browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    let signer = await browserProvider.getSigner();

    const storageContract = new ethers.Contract(
      storageAddress,
      storageABI,
      signer
    );

    const rocketNetworkPrices = await storageContract["getAddress(bytes32)"](
      ethers.id("contract.addressrocketNetworkPrices")
    );
    const rocketNetworkContract = new ethers.Contract(
      rocketNetworkPrices,
      networkABI,
      signer
    );

    const rplPrice = await rocketNetworkContract.getRPLPrice();

    const NodeStakingAddress = await storageContract["getAddress(bytes32)"](
      ethers.id("contract.addressrocketNodeStaking")
    );

    const rocketNodeStaking = new ethers.Contract(
      NodeStakingAddress, // Replace with your staking contract address
      stakingABI, // Replace with your staking contract ABI
      signer
    );

    const amount = await rocketNodeStaking.getNodeRPLStake(add);

    console.log("Price of RPL:" + rplPrice);
    console.log(typeof rplPrice);

    console.log("Staked RPL" + amount);
    console.log(typeof amount);
    const borrowed = await rocketNodeStaking.getNodeETHMatched(add);

    console.log("Borrowed Eth value:" + borrowed);
    console.log(typeof borrowed);

    if (borrowed > BigInt(0)) {
      const newNodeCollateral = ethers.formatUnits(
        (rplPrice * amount) / borrowed,
        16
      );

      console.log("Node collateral:" + newNodeCollateral);

      const rounded = Math.ceil(Number(newNodeCollateral) * 100) / 100;

      dispatch(getCollateralData(rounded));
    } else {
      dispatch(getCollateralData(0));
    }
  };

  const reduxDarkMode = useSelector(
    (state: RootState) => state.darkMode.darkModeOn
  );

  const [showFormEditGraffiti, setShowFormEditGraffiti] = useState(false);
  const [showFormEditGraffitiEffect, setShowFormEditGraffitiEffect] =
    useState(false);

  useEffect(() => {
    setShowFormEditGraffitiEffect(showFormEditGraffiti);

    if (showFormEditGraffiti === false) {
      setIncrementer(0);
    }
  }, [showFormEditGraffiti]);

  const [currentEditGraffitiStatus1, setCurrentEditGraffitiStatus1] =
    useState(0);

  const [currentEditGraffitiStatus2, setCurrentEditGraffitiStatus2] =
    useState(0);
  const [currentEditGraffitiStatus3, setCurrentEditGraffitiStatus3] =
    useState(0);
  const [incrementer, setIncrementer] = useState(0);

  useEffect(() => {
    if (currentEditGraffitiStatus3 === 3) {
      triggerConfetti();
    }
  }, [currentEditGraffitiStatus3]);

  useEffect(() => {
    if (incrementer === 1) {
      setCurrentEditGraffitiStatus1(1);
      setCurrentEditGraffitiStatus2(1);
    } else if (incrementer === 2) {
      setCurrentEditGraffitiStatus2(2);
    } else if (incrementer === 4) {
      setCurrentEditGraffitiStatus3(3);
    } else if (incrementer === 5) {
      setCurrentEditGraffitiStatus3(4);
    } else {
      setCurrentEditGraffitiStatus1(0);
      setCurrentEditGraffitiStatus2(0);
      setCurrentEditGraffitiStatus3(0);
    }
  }, [incrementer]);

  const [showFormSmoothingPool, setShowFormSmoothingPool] = useState(false);
  const [showFormSmoothingPoolEffect, setShowFormSmoothingPoolEffect] =
    useState(false);

  useEffect(() => {
    setShowFormSmoothingPoolEffect(showFormSmoothingPool);

    if (showFormSmoothingPool === false) {
      setIncrementer(0);
    }
  }, [showFormSmoothingPool]);

  const [currentSmoothingPoolStatus1, setCurrentSmoothingPoolStatus1] =
    useState(0);

  const [currentSmoothingPoolStatus2, setCurrentSmoothingPoolStatus2] =
    useState(0);
  const [currentSmoothingPoolStatus3, setCurrentSmoothingPoolStatus3] =
    useState(0);

  useEffect(() => {
    if (currentSmoothingPoolStatus3 === 3) {
      triggerConfetti();
    }
  }, [currentSmoothingPoolStatus3]);

  useEffect(() => {
    if (incrementer === 1) {
      setCurrentSmoothingPoolStatus1(1);
      setCurrentSmoothingPoolStatus2(1);
    } else if (incrementer === 2) {
      setCurrentSmoothingPoolStatus2(2);
    } else if (incrementer === 4) {
      setCurrentSmoothingPoolStatus3(3);
    } else if (incrementer === 5) {
      setCurrentSmoothingPoolStatus3(4);
    } else {
      setCurrentSmoothingPoolStatus1(0);
      setCurrentSmoothingPoolStatus2(0);
      setCurrentSmoothingPoolStatus3(0);
    }
  }, [incrementer]);

  const [prelaunchTruth, setPrelaunchTruth] = useState(false);

  useEffect(() => {
    //DISCOVER GRAPH TIMEOUT

    let i = 0;

    for (const object of reduxData) {
      if (
        object.statusResult === "Prelaunch" ||
        object.statusResult === "Initialised"
      ) {
        setPrelaunchTruth(true);

        return;
      }
    }
  }, [reduxData]);

  const [waitBeaconchainTruth, setWaitBeaconchainTruth] = useState(false);

  useEffect(() => {
    //DISCOVER GRAPH TIMEOUT

    let i = 0;

    for (const object of reduxData) {
      if (
        object.statusResult === "Staking" ||
        object.beaconStatus !== "active_ongoing"
      ) {
        setWaitBeaconchainTruth(true);

        return;
      }
    }
  }, [reduxData]);

  const [stakeRPL, setStakeRPL] = useState(BigInt(0));

  function roundToTwoDecimalPlaces(numStr: string) {
    // Convert the string to a number
    let num = parseFloat(numStr);

    // Round the number to two decimal places
    let roundedNum = Math.round(num * 100) / 100;

    return roundedNum;
  }

  useEffect(() => {
    const handleCheckStakeRPL = async (add: string) => {
      if (typeof (window as any).ethereum !== "undefined") {
        try {
          let browserProvider = new ethers.BrowserProvider(
            (window as any).ethereum
          );
          let signer = await browserProvider.getSigner();

          const storageContract = new ethers.Contract(
            storageAddress,
            storageABI,
            signer
          );

          const NodeStakingAddress = await storageContract[
            "getAddress(bytes32)"
          ](ethers.id("contract.addressrocketNodeStaking"));

          const rocketNodeStaking = new ethers.Contract(
            NodeStakingAddress, // Replace with your staking contract address
            stakingABI, // Replace with your staking contract ABI
            signer
          );

          const amount = await rocketNodeStaking.getNodeRPLStake(add);

          console.log(typeof amount);

          setStakeRPL(amount);

          console.log("Stake RPL amount:" + amount);

          const rocketNetworkPrices = await storageContract[
            "getAddress(bytes32)"
          ](ethers.id("contract.addressrocketNetworkPrices"));
          const rocketNetworkContract = new ethers.Contract(
            rocketNetworkPrices,
            networkABI,
            signer
          );

          const rplPrice = await rocketNetworkContract.getRPLPrice();
          const rplRequiredPerLEB8 = ethers.parseEther("2.4") / rplPrice;

          console.log("rplRequiredPerLEB8: " + rplRequiredPerLEB8);

          const MinipoolManagerAddress = await storageContract[
            "getAddress(bytes32)"
          ](ethers.id("contract.addressrocketMinipoolManager"));

          const MinipoolManager = new ethers.Contract(
            MinipoolManagerAddress,
            miniManagerABI,
            signer
          );

          const activeMinipools =
            await MinipoolManager.getNodeStakingMinipoolCount(address);

          return amount;
        } catch (error) {
          console.log(error);

          return false;
        }
      } else {
        console.log("Window not working");

        return false;
      }
    };

    if (address !== undefined) {
      handleCheckStakeRPL(address);
    }
  }, [address]);

  return (
    <section
      style={{
        backgroundColor: reduxDarkMode ? "#222" : "white",
        color: reduxDarkMode ? "white" : "#222",
      }}
      className="flex w-full flex-col items-center   justify-center "
    >
      {address !== undefined ? (
        <>
          {isRegistered ? (
            <>
              {!preloader ? (
                <div className="w-full flex flex-col  items-center gap-7 lg:gap-0 justify-center">
                  <div className="w-full h-auto lg:h-[90vh] pt-[5vh] lg:pt-[0vh] flex flex-col items-center justify-center gap-[6vh]">
                    <div
                      style={{
                        backgroundColor: reduxDarkMode ? "#222" : "white",
                        color: reduxDarkMode ? "white" : "#222",
                      }}
                      className="w-full flex flex-col justify-center items-center gap-4 "
                    >
                      <h2 className=" text-2xl lg:text-4xl  font-bold  ">
                        Account Overview
                      </h2>
                    </div>

                    <div className="w-full h-auto lg:h-auto flex-col flex gap-[10vh] items-center justify-center lg:flex-row lg:pt-0 ">
                      <div className="h-auto w-auto rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-3 lg:p-5 shadow-2xl md:h-auto ">
                        <div className=" h-full w-full gap-4 overflow-hidden rounded-2xl ">
                          <div
                            style={{
                              backgroundColor: reduxDarkMode ? "#333" : "#fff",
                            }}
                            className="flex items-center w-auto  h-auto justify-center p-3 lg:p-6  "
                          >
                            {(graphData.labels.length > 0 && graphTimeout) ||
                            (reduxData[0].address === "NO VALIDATORS checked" &&
                              graphTimeout) ||
                            ((reduxData[0].statusResult === "Prelaunch" ||
                              reduxData[0].statusResult === "Initialised") &&
                              graphTimeout) ||
                            (prelaunchTruth && graphTimeout) ||
                            (waitBeaconchainTruth && graphTimeout) ? (
                              <div className="w-[270px] sm:w-auto h-auto  flex flex-col items-center justify-center p-2 lg:p-8 px-[0.5vh] lg:px-[6vh]">
                                <Line
                                  data={graphData}
                                  options={options}
                                  onClick={onClick}
                                  ref={charRef}
                                ></Line>

                                <div className="flex gap-2 items-center my-2 mt-5 justify-center">
                                  <button
                                    onClick={() => {
                                      setGraphState("All");
                                    }}
                                    style={
                                      graphState === "All"
                                        ? { backgroundColor: "orange" }
                                        : { backgroundColor: "grey" }
                                    }
                                    className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 "
                                  >
                                    All
                                  </button>
                                  <button
                                    onClick={() => {
                                      setGraphState("Year");
                                    }}
                                    style={
                                      graphState === "Year"
                                        ? { backgroundColor: "orange" }
                                        : { backgroundColor: "grey" }
                                    }
                                    className="bg-blue-500 mt-2 text-xs lg:text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 "
                                  >
                                    Year
                                  </button>
                                  <button
                                    onClick={() => {
                                      setGraphState("Month");
                                    }}
                                    style={
                                      graphState === "Month"
                                        ? { backgroundColor: "orange" }
                                        : { backgroundColor: "grey" }
                                    }
                                    className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4  "
                                  >
                                    Month
                                  </button>
                                  <button
                                    onClick={() => {
                                      setGraphState("Week");
                                    }}
                                    style={
                                      graphState === "Week"
                                        ? { backgroundColor: "orange" }
                                        : { backgroundColor: "grey" }
                                    }
                                    className="bg-blue-500 mt-2 text-xs lg:text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 "
                                  >
                                    Week
                                  </button>
                                </div>
                                <p className=" w-[100%] self-center text-wrap text-xs lg:text-sm py-2 text-gray-500">
                                  Claim Your Validator rewards on{" "}
                                  <a
                                    className="font-bold hover:text-blue-300 cursor-pointer"
                                    target="_blank"
                                    href="https://rocketsweep.app/"
                                  >
                                    rocketsweep.app.
                                  </a>
                                </p>
                              </div>
                            ) : (
                              <div className="w-auto h-auto gap-2  flex flex-col items-center justify-center p-8 px-[6vh]">
                                <h3>
                                  Please wait while we retrieve your rewards
                                  data...
                                </h3>

                                <BounceLoader />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="xl:flex xl:flex-row lg:flex-col w-auto  items-center justify-center xl:gap-5 lg:gap-5">
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-rows-2 gap-3 ">
                          <div className="flex w-auto items-center p-6  border shadow-xl rounded-lg mb-5">
                            <div className="inline-flex flex-shrink-4 items-center justify-center h-12 w-12 text-blue-600 bg-blue-100 rounded-full mr-6">
                              <FaEthereum className="text-lg text-blue-500" />
                            </div>
                            <div>
                              <span className="block text-lg font-bold">
                                {runningValidators} / {totalValidators}
                              </span>

                              {Number(totalValidators) > 0 ? (
                                <span className="block  text-sm text-gray-500">
                                  Fully-running Validators
                                </span>
                              ) : (
                                <span className="block  text-sm text-gray-500">
                                  No Active Validators
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center  p-6 border shadow-xl rounded-lg mb-5">
                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                              <FaCoins className="text-yellow-500 text-xl" />
                            </div>
                            <div className=" w-full max-w-3xl flex  flex-col lg:flex-row items-start lg:items-center justify-start gap-1.5 lg:gap-10 text-left">
                              <div className="mb-2 flex flex-col  lg:w-[100px] justify-start items-start">
                                <span className="block text-lg font-bold">
                                  <span
                                    style={
                                      reduxPayments - reduxCharges >= 0
                                        ? {
                                            color: reduxDarkMode
                                              ? "#fff"
                                              : "#222",
                                          }
                                        : { color: "red" }
                                    }
                                  >
                                    {reduxPayments - reduxCharges}
                                  </span>{" "}
                                  ETH
                                </span>
                                {reduxPayments - reduxCharges >= 0 ? (
                                  <span className="block text-sm text-gray-500 ">
                                    Vrün Balance
                                  </span>
                                ) : (
                                  <span className="block text-sm text-gray-500 ">
                                    in Arrears
                                  </span>
                                )}
                              </div>

                              <Link
                                className="w-auto flex items-center justify-center"
                                href="/payments"
                              >
                                <button className="bg-green-500 text-xs hover:bg-green-700 shadow-lg text-white font-bold py-2 px-4 rounded-md">
                                  Top-up
                                </button>
                              </Link>
                            </div>
                          </div>
                          <div className="flex  items-center p-6  border shadow-xl rounded-lg mb-5">
                            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-blue-600 bg-blue-100 rounded-full mr-6">
                              <Image
                                width={70}
                                height={70}
                                alt="Rocket Pool Logo"
                                src={"/images/rocketlogo.webp"}
                              />
                            </div>

                            <div className="w-full max-w-3xl flex  flex-col lg:flex-row items-start lg:items-center justify-start gap-0.5 lg:gap-10 text-left">
                              <div className="mb-1.5 w-auto max-w-full  lg:w-[100px] flex flex-col justify-start items-start">
                                <span className="block text-lg mb-1.1  font-bold">
                                  {roundToTwoDecimalPlaces(
                                    ethers.formatEther(stakeRPL)
                                  )}{" "}
                                  RPL
                                </span>

                                {reduxCollateral < 10 ? (
                                  <span className="block text-lg   text-red-400 font-bold">
                                    {reduxCollateral} %
                                  </span>
                                ) : (
                                  <span className="block  text-lg  text-green-400 font-bold">
                                    {reduxCollateral} %
                                  </span>
                                )}

                                <span className="mb-2 block text-sm text-gray-500 ">
                                  RPL Collateral
                                </span>
                              </div>

                              <Link
                                href="/rpl"
                                className="w-auto flex items-center justify-center"
                              >
                                <button className="bg-orange-500 text-xs  hover:bg-orange-700 shadow-lg text-white font-bold py-2 px-4 rounded-md">
                                  {" "}
                                  Stake RPL
                                </button>
                              </Link>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-auto min-h-auto flex flex-col items-center justify-start gap-3 lg:pb-[10vh] lg:min-h-[45vh] ">
                    <div className="w-full my-5 mx-5 mb-1 overflow-hidden">
                      <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">
                        <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto">
                          <h3 className=" text-2xl lg:text-4xl font-bold ">
                            Validators
                          </h3>
                          <Link href="/createValidator">
                            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16  rounded-full ">
                              <IoMdAddCircle className="text-green-500 hover:text-green-700 cursor-pointer w-full h-full" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={targetRef}
                      id="accountTable"
                      className="w-[90%] sm:w-auto overflow-scroll shadow-xl border rounded-lg "
                    >
                      <table className="w-auto">
                        <tbody>
                          {reduxData.map((data, index) => (
                            <tr
                              key={index}
                              className=" w-full flex hover:bg-gray-200 cursor-pointer"
                              style={
                                data.statusResult === "Empty"
                                  ? { display: "none" }
                                  : { display: "block" }
                              }
                              onClick={() => handleClick(data.pubkey, index)}
                            >
                              <td className=" px-2 py-3 pl-10 ">
                                <div className="flex items-center flex-col w-[100px] lg:w-[170px] text-sm lg:text-lg">
                                  <h3 className="text-center  text-sm lg:text-md">
                                    Balance on chain:
                                  </h3>

                                  <span className="text-green-500 self-center font-bold text-sm lg:text-lg ">
                                    {data.valBalance}
                                  </span>
                                </div>
                              </td>

                              <td className="px-4 py-3 ">
                                <div className="flex items-center flex-col w-[150px] lg:w-[200px] pr-4 text-sm lg:text-lg">
                                  <span
                                    className="text-green-500 font-bold"
                                    style={
                                      Number(data.minipoolBalance) >= 0
                                        ? { color: "rgb(34 197 94)" }
                                        : { color: "red" }
                                    }
                                  >
                                    {Number(data.minipoolBalance) >= 0 ? (
                                      <div className="flex items-center justify-center">
                                        <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-green-600 bg-green-100 rounded-full mr-3">
                                          <svg
                                            aria-hidden="true"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                          >
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                          </svg>
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                          <h3
                                            style={{
                                              color: reduxDarkMode
                                                ? "white"
                                                : "#222",
                                            }}
                                            className="text-center  font-normal text-sm lg:text-md"
                                          >
                                            Skimmed Balance:
                                          </h3>
                                          <p>
                                            {" "}
                                            {data.statusResult === "Staking"
                                              ? data.minipoolBalance
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center">
                                        {data.valDayVariance !== "" && (
                                          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-red-600 bg-red-100 rounded-full mr-3">
                                            <svg
                                              aria-hidden="true"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              className="h-6 w-6"
                                            >
                                              <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                              />
                                            </svg>
                                          </div>
                                        )}

                                        <div className="flex flex-col justify-center items-center">
                                          <h3
                                            style={{
                                              color: reduxDarkMode
                                                ? "white"
                                                : "#222",
                                            }}
                                            className="text-center font-normal text-sm lg:text-md"
                                          >
                                            Skimmed Balance:
                                          </h3>
                                          <p>
                                            {" "}
                                            {data.statusResult === "Staking"
                                              ? data.minipoolBalance
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </span>
                                </div>
                              </td>

                              <td className="px-4 py-3 ">
                                <div className="flex items-center pl-4 flex-col w-[100px] lg:w-[200px] text-sm lg:text-lg">
                                  <h3 className="text-center font-semibold text-sm lg:text-lg">
                                    Validator Status
                                  </h3>
                                  <GrSatellite />

                                  {data.statusResult === "Staking" &&
                                  data.beaconStatus !== "" ? (
                                    <p className="text-yellow-500  text-center  text-md">
                                      {data.isEnabled === true &&
                                        data.beaconStatus}

                                      {(data.beaconStatus ===
                                        "active_exiting" ||
                                        data.beaconStatus ===
                                          "exited_unslashed" ||
                                        data.beaconStatus ===
                                          "withdrawal_possible" ||
                                        data.beaconStatus ===
                                          "withdrawal_done" ||
                                        data.beaconStatus ===
                                          "exited_slashed" ||
                                        data.beaconStatus ===
                                          "active_slashed") &&
                                        data.isEnabled === false &&
                                        data.beaconStatus}

                                      {data.beaconStatus !== "active_exiting" &&
                                        data.beaconStatus !==
                                          "exited_unslashed" &&
                                        data.beaconStatus !==
                                          "withdrawal_possible" &&
                                        data.beaconStatus !==
                                          "withdrawal_done" &&
                                        data.beaconStatus !==
                                          "exited_slashed" &&
                                        data.beaconStatus !==
                                          "active_slashed" &&
                                        data.isEnabled === false &&
                                        "disabled_by_user"}
                                    </p>
                                  ) : (
                                    <p className="text-yellow-500 text-center  text-md">
                                      {data.statusResult === "Staking" &&
                                        data.beaconStatus === "" &&
                                        data.isEnabled &&
                                        "waiting_for_beaconchain"}

                                      {data.statusResult === "Prelaunch" &&
                                        data.statusResult.toLowerCase()}

                                      {data.statusResult === "Initialised" &&
                                        data.isEnabled &&
                                        data.statusResult.toLowerCase()}

                                      {data.statusResult === "Withdrawable" &&
                                        data.isEnabled &&
                                        data.statusResult.toLowerCase()}

                                      {data.statusResult === "Dissolved" &&
                                        data.statusResult.toLowerCase()}

                                      {data.statusResult === "Empty" &&
                                        data.statusResult.toLowerCase()}

                                      {data.statusResult !== "Dissolved" &&
                                        data.statusResult !== "Prelaunch" &&
                                        data.isEnabled === false &&
                                        "disabled_by_user"}
                                    </p>
                                  )}
                                </div>
                              </td>

                              <td className="px-4 pr-10 py-3 w-[auto]">
                                <div className="flex items-center flex-col w-[100px] lg:w-[200px] text-sm lg:text-lg">
                                  {data.valProposals !== "" && (
                                    <h3 className="text-center  font-semibold text-sm lg:text-lg">
                                      Blocks Proposed
                                    </h3>
                                  )}

                                  <p>{data.valProposals}</p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {Number(totalValidators) <= 0 && (
                      <p className="text-gray-400 font-bold text-lg max-w-[90%] text-center">
                        You currently have no active Validators...
                      </p>
                    )}
                  </div>

                  <div className="flex w-full h-auto py-[6vh] mb-[3vh] lg:mb-[13vh] lg:py-[0vh] flex-col justify-center items-center gap-4 lg:min-h-[40vh]  ">
                    <div className="w-full my-5 mx-5 mb-1 overflow-hidden">
                      <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-6">
                        <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto">
                          <h3 className=" text-2xl lg:text-4xl font-bold ">
                            Account Details
                          </h3>
                        </div>
                      </div>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 xl:grid-rows-2 gap-4">
                      {Number(totalValidators) > 0 && (
                        <div className="flex items-center p-6 shadow-xl border rounded-lg">
                          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                            <PiSignatureBold className="text-purple-500 text-3xl" />
                          </div>

                          <div className="flex h-full flex-col items-start gap-0.5 justify-center w-full">
                            <p className="block  text-md   font-bold">
                              Batch Change Graffiti
                            </p>

                            <div className="w-full flex flex-col gap-1 items-start justify-center">
                              <button
                                onClick={() => {
                                  handleGraffitiModal();
                                }}
                                className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white shadow-xl font-bold py-2 px-4 rounded-md"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex w-auto items-center p-6 shadow-xl border  rounded-lg">
                        <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                          <Image
                            width={70}
                            height={70}
                            alt="Rocket Pool Logo"
                            src={"/images/rocketlogo.webp"}
                          />
                        </div>
                        <div className="flex flex-col items-center justify-start w-full">
                          <div className="flex h-full flex-col items-start gap-0.5 justify-center w-full">
                            <span className="block text-md  font-bold">
                              Smoothing Pool
                            </span>

                            {checked5 ? (
                              <div className="flex items-center justify-center  text-green-400 text-[18px]">
                                {" "}
                                <p>Opted-in</p> <TiTick />
                              </div>
                            ) : (
                              <p className="text-red-400 text-md  text-sm">
                                Opted-out
                              </p>
                            )}
                          </div>

                          <div className="w-full flex gap-2 items-start justify-start">
                            <button
                              onClick={() => {
                                setShowForm6(true);
                              }}
                              className="bg-blue-500 mt-2 text-xs hover:bg-blue-700 shadow-xl text-white font-bold py-2 px-2 rounded-md"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/*MODALS*/}

                  <Modal
                    isOpen={showFormSmoothingPool}
                    onRequestClose={() => setShowFormSmoothingPool(false)}
                    contentLabel="Smoothing Pool Transaction Modal"
                    shouldCloseOnOverlayClick={false}
                    className={`${styles.modal} ${
                      showFormSmoothingPoolEffect
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`} // Toggle classes based on showForm state
                    ariaHideApp={false}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "999999999999999999999999999999999999",
                        transition: "0.2s transform ease-in-out",
                      },
                      content: {
                        width: "auto",
                        height: "auto",
                        minWidth: "280px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        color: "black",
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
                      {currentSmoothingPoolStatus3 === 3 ? (
                        <div className="w-full flex items-center flex-col gap-2 justify-center">
                          <h3 className="font-bold text-[30px]">
                            Change succesful!
                          </h3>

                          <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]">
                            {" "}
                            <TiTick />
                          </div>
                          <button
                            onClick={() => {
                              setShowFormSmoothingPool(false);
                            }}
                            className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      ) : currentSmoothingPoolStatus3 === 4 ? (
                        <div className="w-full flex items-center flex-col gap-2 justify-center">
                          <h3 className="font-bold text-[30px]">
                            Failed to Toggle Smoothing Pool!
                          </h3>

                          <p className="my-3 text-lg text-red-400 ">
                            {errorBoxText2}
                          </p>

                          <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]">
                            <BiSolidErrorAlt />
                          </div>
                          <button
                            onClick={() => {
                              setShowFormSmoothingPool(false);
                            }}
                            className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full flex items-start flex-col gap-2 justify-center">
                            <h3 className="font-bold text-[30px]">
                              Change Enabled Status:{" "}
                            </h3>
                          </div>

                          <hr className="w-full my-3" />

                          <div className="flex flex-col gap-3 items-center justify-center w-full">
                            <div className="flex items-start justify-between gap-6 w-full">
                              <div className="flex items-center justify-start gap-4">
                                <p>
                                  {" "}
                                  <HiOutlinePaperAirplane />
                                </p>

                                <p className="text-left">
                                  Change Smoothing Pool Status{" "}
                                </p>
                              </div>
                              <p className="self-end">
                                {currentSmoothingPoolStatus1 === 0 ? (
                                  <div className="flex items-center justify-center">
                                    <BounceLoader size={25} />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center  text-green-400 text-[25px]">
                                    {" "}
                                    <TiTick />
                                  </div>
                                )}
                              </p>
                            </div>

                            <div className="flex items-start justify-between gap-6 w-full">
                              <div className="flex items-center justify-start gap-4">
                                <p>
                                  <FaEthereum />
                                </p>

                                <p className="text-left">
                                  Confirming change...
                                </p>
                              </div>
                              <p className="self-end">
                                {currentSmoothingPoolStatus2 === 0 ? (
                                  <p></p>
                                ) : currentSmoothingPoolStatus2 === 1 ? (
                                  <div className="flex items-center justify-center">
                                    <BounceLoader size={25} />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center  text-green-400 text-[25px]">
                                    {" "}
                                    <TiTick />
                                  </div>
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Modal>

                  <Modal
                    isOpen={showFormEditGraffiti}
                    onRequestClose={() => setShowFormEditGraffiti(false)}
                    contentLabel="Graffiti Transaction Modal"
                    shouldCloseOnOverlayClick={false}
                    className={`${styles.modal} ${
                      showFormEditGraffitiEffect
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`} // Toggle classes based on showForm state
                    ariaHideApp={false}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "999999999999999999999999999999999999",
                        transition: "0.2s transform ease-in-out",
                      },
                      content: {
                        width: "auto",
                        height: "auto",
                        minWidth: "280px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        color: "black",
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
                        <div className="w-full flex items-center flex-col gap-2 justify-center">
                          <h3 className="font-bold text-[30px]">
                            Graffiti Edit Successful!
                          </h3>

                          <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-green-400 text-[50px]">
                            {" "}
                            <TiTick />
                          </div>
                          <button
                            onClick={() => {
                              setShowFormEditGraffiti(false);
                            }}
                            className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      ) : currentEditGraffitiStatus3 === 4 ? (
                        <div className="w-full flex items-center flex-col gap-2 justify-center">
                          <h3 className="font-bold text-[30px]">
                            Failed to change Validator Graffiti!
                          </h3>

                          <p className="my-3 text-lg text-red-400 ">
                            {graffitiError}
                          </p>

                          <div className="flex items-center justify-center  border-2 border-black-300 rounded-full text-red-400 text-[50px]">
                            <BiSolidErrorAlt />
                          </div>
                          <button
                            onClick={() => {
                              setShowFormEditGraffiti(false);
                            }}
                            className="bg-blue-500 mt-2 text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full flex items-start flex-col gap-2 justify-center">
                            <h3 className="font-bold text-[30px]">
                              Batch Change Graffiti{" "}
                            </h3>
                            <p className="text-[19px]">
                              Change the Graffiti for all your Validators...
                            </p>
                          </div>

                          <hr className="w-full my-3" />

                          <div className="flex flex-col gap-3 items-center justify-center w-full">
                            <div className="flex items-start justify-between gap-6 w-full">
                              <div className="flex items-center justify-start gap-4">
                                <p>
                                  {" "}
                                  <HiOutlinePaperAirplane />
                                </p>

                                <p className="text-left">Signed Typed Data </p>
                              </div>
                              <p className="self-end">
                                {currentEditGraffitiStatus1 === 0 ? (
                                  <div className="flex items-center justify-center">
                                    <BounceLoader size={25} />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center  text-green-400 text-[25px]">
                                    {" "}
                                    <TiTick />
                                  </div>
                                )}
                              </p>
                            </div>

                            <div className="flex items-start justify-between gap-6 w-full">
                              <div className="flex items-center justify-start gap-4">
                                <p>
                                  <HiOutlinePaperAirplane />
                                </p>

                                <p className="text-left">Confirming change</p>
                              </div>
                              <p className="self-end">
                                {currentEditGraffitiStatus2 === 0 ? (
                                  <p></p>
                                ) : currentEditGraffitiStatus2 === 1 ? (
                                  <div className="flex items-center justify-center">
                                    <BounceLoader size={25} />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center  text-green-400 text-[25px]">
                                    {" "}
                                    <TiTick />
                                  </div>
                                )}
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
                    contentLabel="Batch Graffiti Modal"
                    className={`${styles.modal} ${
                      showFormEffect
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`} // Toggle classes based on showForm state
                    ariaHideApp={false}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "999999999999999999999999999999999999",
                        transition: "0.2s transform ease-in-out",
                      },
                      content: {
                        width: "auto",
                        height: "auto",
                        minWidth: "280px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        color: "black",
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
                      <h2 className="text-[20px] font-bold">Graffiti Update</h2>

                      <input
                        value={currentEditGraffiti}
                        className=" border border-black-200 text-black-500"
                        type="text"
                        onChange={handleGraffitiChange}
                      />

                      <div>
                        <button
                          className="bg-blue-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md"
                          onClick={confirmGraffiti}
                        >
                          Update
                        </button>
                        <button
                          className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>

                  <Modal
                    isOpen={showForm3}
                    onRequestClose={() => setShowForm3(false)}
                    contentLabel="Top-up Credit Modal"
                    className={`${styles.modal} ${
                      showFormEffect3
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999, // Increase the z-index if needed
                      },
                      content: {
                        minWidth: "280px", // Adjust as per your modal's width
                        width: "auto",
                        height: "auto",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        backgroundColor: "#fff",
                        border: "0",
                        borderRadius: "20px",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch", // For iOS Safari
                        scrollbarWidth: "thin", // For modern browsers that support scrollbar customization
                        scrollbarColor: "rgba(255, 255, 255, 0.5) #2d2c2c", // For modern browsers that support scrollbar customization
                        animation: `swoopIn 0.3s ease-in-out forwards`, // Add animation
                      },
                    }}
                  >
                    <div className="flex relative w-full h-full flex-col rounded-lg gap-2 bg-gray-100 px-6 py-6 pt-[45px] text-center">
                      <div
                        id={styles.icon}
                        className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 "
                      >
                        <AiOutlineClose
                          className="self-end cursor-pointer"
                          onClick={() => {
                            setShowForm3(false);
                          }}
                        />
                      </div>
                      <h2 className="text-[20px] font-bold mb-2">
                        Add ETH Credit
                      </h2>

                      <input
                        className="w-[60%] self-center border border-black-200 text-black"
                        type="text"
                        value={feeETHInput}
                        onChange={handleETHInput}
                      />

                      <div>
                        <button
                          className="bg-green-500 mt-2  text-xs  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md"
                          onClick={makePayment}
                        >
                          Pay ETH
                        </button>
                        <button
                          className="bg-yellow-500 mt-2  text-xs  hover:bg-yellow-700 text-white font-bold mx-2 py-2 px-4 rounded-md"
                          onClick={() => setShowForm3(false)}
                        >
                          Cancel
                        </button>
                      </div>

                      {paymentErrorMessage !== "" && (
                        <p className="my-4 w-[80%] font-bold text-lg self-center text-center text-red-500 sm:text-l">
                          {paymentErrorMessage}
                        </p>
                      )}
                    </div>
                  </Modal>

                  <Modal
                    isOpen={showForm5}
                    onRequestClose={() => setShowForm5(false)}
                    contentLabel="Alert Validators Modal"
                    className={`${styles.modal} ${
                      showFormEffect5
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`} // Toggle classes based on showForm state
                    ariaHideApp={false}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "999999999999999999999999999999999999",
                        transition: "0.2s transform ease-in-out",
                      },
                      content: {
                        width: "auto",
                        height: "auto",
                        minWidth: "280px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        color: "black",
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
                      <div
                        id={styles.icon}
                        className="bg-gray-300 absolute cursor-pointer right-5 top-5 text-[15px]  hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 "
                      >
                        <AiOutlineClose
                          className="self-end cursor-pointer"
                          onClick={() => {
                            setShowForm5(false);
                          }}
                        />
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">
                        VALIDATORS IN NEED OF ACTION!
                      </h2>

                      {validatorsInNeedOfAction.stake > 0 && (
                        <p className="my-4 w-[90%] text-gray-500 sm:text-l">
                          You have {validatorsInNeedOfAction.stake} in Prelaunch
                          and ready to STAKE!
                        </p>
                      )}

                      {validatorsInNeedOfAction.withdrawn > 0 && (
                        <p className="my-4 w-[90%] text-gray-500 sm:text-l">
                          You have {validatorsInNeedOfAction.withdrawn}{" "}
                          withdrawn Validators, ready to distribute the balance
                          of.
                        </p>
                      )}

                      {validatorsInNeedOfAction.close > 0 && (
                        <p className="my-4 w-[90%] text-gray-500 sm:text-l">
                          You have {validatorsInNeedOfAction.close} dissolved
                          Minipools that need closing.
                        </p>
                      )}

                      <div className="w-full flex gap-2 items-center justify-center">
                        <button
                          onClick={handleScrollToElement}
                          className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                          SEE VALIDATORS
                        </button>
                      </div>
                    </div>
                  </Modal>

                  <Modal
                    isOpen={showForm6}
                    onRequestClose={() => setShowForm6(false)}
                    contentLabel="Smoothing Pool Opt Modal"
                    className={`${styles.modal} ${
                      showFormEffect6
                        ? `${styles.modalOpen}`
                        : `${styles.modalClosed}`
                    }`} // Toggle classes based on showForm state
                    ariaHideApp={false}
                    style={{
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "999999999999999999999999999999999999",
                        transition: "0.2s transform ease-in-out",
                      },
                      content: {
                        width: "auto",
                        height: "auto",
                        minWidth: "280px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",

                        color: "black",
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
                      <div
                        id={styles.icon}
                        className="bg-gray-300 absolute right-5 top-5 text-[15px] hover:text-[15.5px]  text-black w-auto h-auto rounded-full p-1 "
                      >
                        <AiOutlineClose
                          className="self-end cursor-pointer"
                          onClick={() => {
                            setShowForm6(false);
                          }}
                        />
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">
                        Do you want to be in the Smoothing Pool?
                      </h2>

                      <div className="flex items-center justify-center w-full gap-4">
                        <span>Opt in?</span>
                        <label className="flex items-center justify-center gap-1">
                          <input
                            type="radio"
                            name="optIn"
                            checked={checked2 === true}
                            onChange={() => setChecked2(true)}
                          />
                          Yes
                        </label>
                        <label className="flex items-center justify-center gap-1">
                          <input
                            type="radio"
                            name="optIn"
                            checked={checked2 === false}
                            onChange={() => setChecked2(false)}
                          />
                          No
                        </label>
                      </div>

                      <div className="w-full flex gap-2 items-center justify-center">
                        <button
                          onClick={handleOptSmoothingPool}
                          className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                          Confirm Changes
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              ) : (
                <div className="h-[100vh] w-full flex items-center gap-2 justify-center flex-col">
                  <h3 className="text-center w-[80%]">
                    Please wait while we retrieve your account info...
                  </h3>

                  <BounceLoader />
                </div>
              )}
            </>
          ) : (
            <NoRegistration onRegistrationResult={handleRegistrationResult} />
          )}
        </>
      ) : (
        <NoConnection />
      )}
    </section>
  );
};

export default AccountMain;
