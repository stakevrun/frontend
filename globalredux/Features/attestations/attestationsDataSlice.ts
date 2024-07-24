'use client'

import { createSlice } from '@reduxjs/toolkit'





type rowArray = [
    []
]

type stateType = {
    data: rowArray
}


const initialState: stateType =  {

   data: [[]]

}



















export const attestationsDataSlice = createSlice({
    name: 'attestationsData',
    initialState,
    reducers: {
        attestationsData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
            console.log(state)
        }
    }
})

export const { attestationsData } = attestationsDataSlice.actions;

export default attestationsDataSlice.reducer;