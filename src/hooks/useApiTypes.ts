import { useChainId } from "wagmi";

export const types = {
  AcceptTermsOfService:
    [{type: "string",  name: "declaration"}],
  CreateKey:
    [{type: "uint256", name: "index"}],
  GetDepositData: [
    {type: "bytes",   name: "pubkey"},
    {type: "bytes32", name: "withdrawalCredentials"},
    {type: "uint256", name: "amountGwei"},
  ],
  GetPresignedExit: [
    {type: "bytes",   name: "pubkey"},
    {type: "uint256", name: "validatorIndex"},
    {type: "uint256", name: "epoch"},
  ],
  SetFeeRecipient: [
    {type: "uint256", name: "timestamp"},
    {type: "bytes[]", name: "pubkeys"},
    {type: "address", name: "feeRecipient"},
    {type: "string",  name: "comment"},
  ],
  SetGraffiti: [
    {type: "uint256", name: "timestamp"},
    {type: "bytes[]", name: "pubkeys"},
    {type: "string",  name: "graffiti"},
    {type: "string",  name: "comment"},
  ],
  SetEnabled: [
    {type: "uint256", name: "timestamp"},
    {type: "bytes[]", name: "pubkeys"},
    {type: "bool",    name: "enabled"},
    {type: "string",  name: "comment"},
  ],
  AddValidators: [
    {type: "uint256",   name: "timestamp"},
    {type: "uint256",   name: "firstIndex"},
    {type: "uint256",   name: "amountGwei"},
    {type: "address",   name: "feeRecipient"},
    {type: "string",    name: "graffiti"},
    {type: "address[]", name: "withdrawalAddresses"},
    {type: "string",    name: "comment"},
  ],
  CreditAccount: [
    {type: "uint256",   name: "timestamp"},
    {type: "address",   name: "nodeAccount"},
    {type: "uint256",   name: "numDays"},
    {type: "bool",      name: "decreaseBalance"},
    {type: "uint256",   name: "tokenChainId"},
    {type: "address",   name: "tokenAddress"},
    {type: "bytes32",   name: "transactionHash"},
    {type: "string",    name: "comment"},
  ],
} as const;

export const useApiDomain = () => {
  const chainId = useChainId();
  return { name: "vrün", version: "1", chainId };
}

// TODO: update this declaration to include a hash instead of (or in addition to) the version number
// TODO: possibly fetch the required declaration from the API?
export const declaration = "I accept the terms of service specified at https://vrün.com/terms (with version identifier 20240229).";

