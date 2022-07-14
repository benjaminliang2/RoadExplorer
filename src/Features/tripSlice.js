import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import debounce from 'lodash.debounce'
// const axios = require('axios')

const initialState = {
    title: "untitled",
    origin: false,
    destination: false,
    waypoints: [],
    isLoading: false,
    _id: undefined,
}

export const saveTrip = createAsyncThunk(
    'trip/saveTrip',
    async (payload, thunkAPI) => {
        const trip = thunkAPI.getState().trip

        const result = await fetch(
            'http://localhost:5000/savetrip', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({trip}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await result.json()
        console.log(response)
        return response
    }
)

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        setOrigin: (state, { payload }) => {
            state.origin = payload
        },
        setDestination: (state, { payload }) => {
            state.destination = payload
        },
        setTitle:(state, {payload}) => {
            state.title = payload
        },
        // setMongoID: (state, {payload}) => {
        //     state._id = payload
        // }
    },
    extraReducers:{
        [saveTrip.pending]: (state) =>{
            state.isLoading = true
        },
        [saveTrip.fulfilled]: (state, action) =>{
            state._id = action.payload
            state.isLoading = false
        },
        [saveTrip.rejected]: (state) =>{
            state.isLoading = false
            console.log("save trip failed")
        }
    }
})


export const { setOrigin, setDestination, setTitle } = tripSlice.actions;
export default tripSlice.reducer
