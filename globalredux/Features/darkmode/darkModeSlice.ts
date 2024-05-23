'use client'


import { createSlice } from '@reduxjs/toolkit'


type StateType = {
    darkModeOn: boolean,
}

const initialState: StateType = {
    darkModeOn: false // Initialize total as empty string
}










export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        changeDarkMode: (state) => {
            // Mutate the state to update it
            state.darkModeOn = !state.darkModeOn
          
        },
    }
})

export const { changeDarkMode} = darkModeSlice.actions;

export default darkModeSlice.reducer;