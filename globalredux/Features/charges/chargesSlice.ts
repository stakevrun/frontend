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

















export const chargesDataSlice = createSlice({
    name: 'chargesData',
    initialState,
    reducers: {
        getChargesData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
          
        },
        getChargesEntryData: (state, action) => {
            // Mutate the state to update it
            state.entryData = action.payload;
          
        },
      
    }
})

export const { getChargesData, getChargesEntryData} = chargesDataSlice.actions;

export default chargesDataSlice.reducer;