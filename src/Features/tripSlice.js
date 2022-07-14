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
    debounce(async (payload, thunkAPI) => {
        const trip = thunkAPI.getState().trip
        try {
            fetch(
                'http://localhost:5000/savetrip', {
                mode: 'cors',
                credentials: 'include',
                method: "post",
                body: JSON.stringify({trip}),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(response => {
                console.log(response)
                thunkAPI.dispatch(setMongoID(response))
            })
        } catch (error) {
            console.log(error);
        }
    }, 2000)
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
        setMongoID: (state, {payload}) => {
            state._id = payload
        }
    },
    extraReducers:{
        [saveTrip.pending]: (state) =>{
            state.isLoading = true
        },
        [saveTrip.fulfilled]: (state, action) =>{
            state.isLoading = false
        },
        [saveTrip.rejected]: (state) =>{
            state.isLoading = false
        }
    }
})


export const { setOrigin, setDestination, setMongoID } = tripSlice.actions;
export default tripSlice.reducer
