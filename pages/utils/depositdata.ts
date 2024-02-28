import bls from 'chia-bls'
import { ContainerType, ByteVectorType, UintNumberType } from '@chainsafe/ssz'
import { BytesLike, arrayify, hexlify, hexConcat, hexZeroPad } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'
import { pack as solidityPack } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'

export type HexString = string
export type Address = string

export class PrivateKey {
  private blsPrivateKey: bls.PrivateKey

  constructor(bytes: BytesLike) {
    this.blsPrivateKey = bls.PrivateKey.fromBytes(arrayify(bytes))
  }

  static fromSeed(seed: BytesLike): PrivateKey {
    return new PrivateKey(bls.PrivateKey.fromSeed(arrayify(seed)).toBytes())
  }

  sign(message: BytesLike): HexString {
    return hexlify(bls.PopSchemeMPL.sign(this.blsPrivateKey, arrayify(message)).toBytes())
  }

  getPublicKey(): HexString {
    return hexlify(this.blsPrivateKey.getG1().toBytes())
  }

  toHex(): HexString {
    return hexlify(this.toBytes())
  }

  toBytes(): Uint8Array {
    return this.blsPrivateKey.toBytes()
  }
}

export class DepositData {
  private validatorPrivateKey: PrivateKey
  private withdrawalCredentials: HexString
  private amount: number
  private forkVersion: HexString
  private genesisValidatorRoot: HexString

  constructor({
    validatorPrivateKey,
    withdrawalCredentials,
    amount,
    forkVersion = '0x00000000',
    genesisValidatorRoot = '0x0000000000000000000000000000000000000000000000000000000000000000'
  }: {
    validatorPrivateKey: BytesLike
    withdrawalCredentials: BytesLike
    amount: number // gwei
    forkVersion?: BytesLike
    genesisValidatorRoot?: BytesLike
  }) {
    this.validatorPrivateKey = new PrivateKey(validatorPrivateKey)
    this.withdrawalCredentials = hexlify(withdrawalCredentials)
    this.amount = amount
    this.forkVersion = hexlify(forkVersion)
    this.genesisValidatorRoot = hexlify(genesisValidatorRoot)
  }

  sign(): { signature: HexString; depositDataRoot: HexString } {
    return {
      signature: this.getSignature(),
      depositDataRoot: this.getDepositDataRootHash()
    }
  }

  getValidatorPrivateKey(): HexString {
    return this.validatorPrivateKey.toHex()
  }

  getValidatorPubKey(): HexString {
    return this.validatorPrivateKey.getPublicKey()
  }

  getSignature(): HexString {
    return this.validatorPrivateKey.sign(this.getSigningRootHash())
  }

  getDepositDataRootHash(): HexString {
    const DepositData = new ContainerType({
      pubkey: new ByteVectorType(48),
      withdrawalCredentials: new ByteVectorType(32),
      amount: new UintNumberType(8),
      signature: new ByteVectorType(96)
    })

    return hexlify(DepositData.hashTreeRoot(DepositData.fromJson(this.getDepositData())))
  }

  getDepositData(): {
    pubkey: HexString
    withdrawalCredentials: HexString
    amount: number
    signature: HexString
  } {
    const depositData = this.getUnsignedDepositData()
    const signature = this.getSignature()
    return {
      ...depositData,
      signature
    }
  }

  getSigningRootHash(): HexString {
    const SigningData = new ContainerType({
      objectRoot: new ByteVectorType(32),
      domain: new ByteVectorType(32)
    })

    return hexlify(SigningData.hashTreeRoot(SigningData.fromJson(this.getSigningRoot())))
  }

  getSigningRoot(): { objectRoot: HexString; domain: HexString } {
    const DepositMessage = new ContainerType({
      pubkey: new ByteVectorType(48),
      withdrawalCredentials: new ByteVectorType(32),
      amount: new UintNumberType(8)
    })

    return {
      objectRoot: hexlify(DepositMessage.hashTreeRoot(DepositMessage.fromJson(this.getUnsignedDepositData()))),
      domain: this.getDomain()
    }
  }

  getUnsignedDepositData(): {
    pubkey: HexString
    withdrawalCredentials: HexString
    amount: number
  } {
    return {
      pubkey: this.getValidatorPubKey(),
      withdrawalCredentials: this.withdrawalCredentials,
      amount: this.amount
    }
  }

  getDomain(): HexString {
    const domainType = '0x03000000' // Deposit
    const forkDataRootHash = this.getForkDataRootHash()
    return hexlify([...arrayify(domainType), ...arrayify(forkDataRootHash).slice(0, 28)])
  }

  getForkDataRootHash(): HexString {
    const ForkData = new ContainerType({
      currentVersion: new ByteVectorType(4),
      genesisValidatorsRoot: new ByteVectorType(32)
    })

    return hexlify(ForkData.hashTreeRoot(ForkData.fromJson(this.getForkDataRoot())))
  }

  getForkDataRoot(): { currentVersion: HexString; genesisValidatorsRoot: HexString } {
    return {
      currentVersion: this.forkVersion,
      genesisValidatorsRoot: this.genesisValidatorRoot
    }
  }
}

export function getMinipoolExpectedAddress({
  storageAddress,
  minipoolFactoryAddress,
  nodeAddress,
  salt,
  bytecode,
  depositType = 2
}: {
  storageAddress: Address
  minipoolFactoryAddress: Address
  nodeAddress: Address
  salt: bigint | number
  bytecode: HexString
  depositType: number
}): Address {
  const from = minipoolFactoryAddress
  const saltHash = keccak256(solidityPack(['address', 'uint256'], [nodeAddress, salt]))
  const constructorArgs = solidityPack(['uint256', 'uint256', 'uint256'], [storageAddress, nodeAddress, depositType])
  const initCodeHash = keccak256([...arrayify(bytecode), ...arrayify(constructorArgs)])
  return getCreate2Address(from, saltHash, initCodeHash)
}

export function getMinipoolWithdrawalCredentials(minipoolAddress: Address): Address {
  return hexConcat(['0x01', hexZeroPad(minipoolAddress, 31)])
}