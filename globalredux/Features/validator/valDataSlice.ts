'use client'


import { createSlice } from '@reduxjs/toolkit'







export type beaconLog = {
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


export type beaconLogs = Array<beaconLog>



 type rowObject2 =  {
    
 
    address: string,
    statusResult: string,
    statusTimeResult: string,
    timeRemaining: string,
    pubkey: string
    beaconStatus: string
    activationEpoch: string
    smoothingPoolTruth: boolean
 withdrawalEpoch: string
 withdrawalCountdown: string
    feeRecipient: string
    valBalance: string
    valProposals: string
    valDayVariance: string
    minipoolBalance: string
    graffiti: string
    valIndex: string
    isEnabled: boolean
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

}

type rowArray = [
    rowObject2
]

type stateType = {
    data: rowArray
}


const initialState: stateType =  {

   data: [{
    address: "NO VALIDATORS",
    statusResult: "Empty",
    statusTimeResult: "",
    timeRemaining: "",
    graffiti: "",
    beaconStatus: "",
    valBalance: "",
    valProposals: "",
    valDayVariance: "",
    minipoolBalance: "",
    activationEpoch: "", 
    smoothingPoolTruth: false,
    withdrawalEpoch: "", 
    withdrawalCountdown: "",
  
    feeRecipient: "",
    pubkey: "",
    valIndex: "",
    isEnabled: false,
    nodeAddress: ""
   }]

}



















export const valDataSlice = createSlice({
    name: 'valData',
    initialState,
    reducers: {
        getData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
        },
      
    }
})

export const { getData} = valDataSlice.actions;

export default valDataSlice.reducer;