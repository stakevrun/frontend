'use client';

import {configureStore} from "@reduxjs/toolkit"


import counterReducer from "./Features/counter/counterSlice"
import valDataReducer from "./Features/validator/valDataSlice"
import attestationsDataReducer from "./Features/attestations/attestationsDataSlice"
import graphPointsDataReducer from "./Features/graphpoints/graphPointsDataSlice"


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        valData: valDataReducer,
        attestationsData: attestationsDataReducer,
        graphPointsData: graphPointsDataReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>