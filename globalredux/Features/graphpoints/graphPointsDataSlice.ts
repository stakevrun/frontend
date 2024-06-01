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



















export const graphPointsDataSlice = createSlice({
    name: 'graphPointsData',
    initialState,
    reducers: {
        getGraphPointsData: (state, action) => {
            // Mutate the state to update it
            state.data = action.payload;
            console.log(state)
        }
    }
})

export const { getGraphPointsData } = graphPointsDataSlice.actions;

export default graphPointsDataSlice.reducer;