'use client'


import { createSlice } from '@reduxjs/toolkit'


type StateType = {
    data: number,
}

const initialState: StateType = {
    data: 0 // Initialize total as empty string
}


















export const chargesDataSlice = createSlice({
    name: 'chargesData',
    initialState,
    reducers: {
        getChargesData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
          
        },
      
    }
})

export const { getChargesData} = chargesDataSlice.actions;

export default chargesDataSlice.reducer;