'use client'


import { createSlice } from '@reduxjs/toolkit'


type StateType = {
    data: number,
}

const initialState: StateType = {
    data: 0 // Initialize total as empty string
}








export const collateralDataSlice = createSlice({
    name: 'collateralData',
    initialState,
    reducers: {
        getCollateralData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
          
        },
      
    }
})

export const { getCollateralData} = collateralDataSlice.actions;

export default collateralDataSlice.reducer;