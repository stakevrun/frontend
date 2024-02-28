import { getMinipoolExpectedAddress } from "./depositdata"
import { getMinipoolWithdrawalCredentials } from "./depositdata"
import { PrivateKey } from "./depositdata"
import { DepositData } from "./depositdata"



const nodeAddress = '0x'
const salt = 0 // nodeAddress nonce aka provider.getTransactionCount(nodeAddress)

const minipoolAddress = getMinipoolExpectedAddress({
  minipoolFactoryAddress: '0x',
  storageAddress: '0x',
  nodeAddress,
  bytecode: '0x',
  salt,
  depositType: 2 // half
})

const withdrawalCredentials = getMinipoolWithdrawalCredentials(minipoolAddress)

const validatorKey = PrivateKey.fromSeed('0x123456')

const depositData = new DepositData({
  validatorPrivateKey: validatorKey.toHex(),
  withdrawalCredentials,
  amount: 16000000000, // gwei
  forkVersion: '0x00000000' // 0x00000000 mainnet, 0x00001020 goerli, 0x00000069 zhejiang
})

const { signature, depositDataRoot } = depositData.sign()

const contract = new contract('0x', ['function deposit(uint256 minimumNodeFee, bytes validatorPubkey, bytes validatorSignature, bytes32 depositDataRoot, uint256 salt, address expectedMinipoolAddress) external payable'], provider)
await contract.deposit(15%, validatorKey.getPublicKey(), signature, depositDataRoot, salt, minipoolAddress)