'use client'


import { createSlice } from '@reduxjs/toolkit'




type StateType = {
    data: number
   
}

const initialState: StateType = {
    data: 0,

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
      
    }
})

export const { getPaymentsData} = paymentsDataSlice.actions;

export default paymentsDataSlice.reducer;