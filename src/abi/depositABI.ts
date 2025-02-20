export const abi = [
  {
    "inputs": [
      {
        "internalType": "contract RocketStorageInterface",
        "name": "_rocketStorageAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "DepositReceived",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bondAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minimumNodeFee",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_validatorPubkey",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_salt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_expectedMinipoolAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_currentBalance",
        "type": "uint256"
      }
    ],
    "name": "createVacantMinipool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bondAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minimumNodeFee",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_validatorPubkey",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_validatorSignature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_depositDataRoot",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_salt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_expectedMinipoolAddress",
        "type": "address"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bondAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minimumNodeFee",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_validatorPubkey",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_validatorSignature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_depositDataRoot",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_salt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_expectedMinipoolAddress",
        "type": "address"
      }
    ],
    "name": "depositWithCredit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDepositAmounts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nodeOperator",
        "type": "address"
      }
    ],
    "name": "getNodeDepositCredit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nodeOperator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "increaseDepositCreditBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nodeAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "increaseEthMatched",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "isValidDepositAmount",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;
export default abi;
