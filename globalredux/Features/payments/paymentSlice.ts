'use client'


import { createSlice } from '@reduxjs/toolkit'


type edittedObject = {
    date: string
    fee: number
    pubkey: string
}




type StateType = {
    data: number
    entryData: Array<edittedObject>
   
}

const initialState: StateType = {
    data: 0,
    entryData: [{date: "defaultState", fee:0, pubkey: "defaultState"}]

}

// Calculate total payments based on the data array




















export const paymentsDataSlice = createSlice({
    name: 'paymentsData',
    initialState,
    reducers: {
        getPaymentsData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
          
        },
        getPaymentsEntryData: (state, action) => {
            // Mutate the state to update it
            state.entryData = action.payload;
          
        },
      
    }
})

export const { getPaymentsData, getPaymentsEntryData} = paymentsDataSlice.actions;

export default paymentsDataSlice.reducer;