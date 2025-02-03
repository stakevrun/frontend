import type { FC } from "react";
import type { TransactionReceipt } from "viem";
import { TransactionSubmitter } from "./TransactionSubmitter";
import { useMemo } from "react";

export const CallClose: FC<{
  onSubmit: (result: string | undefined, error: string | undefined, hasError: boolean) => void;
  validatorAddress: `0x${string}`;
}> = ({ onSubmit, validatorAddress }) => {
  const abi = useMemo(() => {
    return [
      {
        name: "distributeBalance",
        type: "function",
        inputs: [
          {
            name: "_rewardsOnly",
            internalType: "bool",
            type: "bool",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ] as const;
  }, []);

  const setReceiptData = (receipt: TransactionReceipt) => {
    onSubmit(`Transaction ${receipt.status}`, undefined, false);
  };

  const setError = (error: string | undefined) => {
    onSubmit(undefined, error, true);
  };

  return (
    <TransactionSubmitter
      buttonText="Close Validator"
      address={validatorAddress}
      abi={abi}
      functionName="distributeBalance"
      args={[false]}
      onSuccess={setReceiptData}
      onError={setError}
    />
  );
};
