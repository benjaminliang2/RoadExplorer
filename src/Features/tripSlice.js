import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// const axios = require('axios')

//_id is the trip's specific id
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
        console.log("saving trip");
        const trip = thunkAPI.getState().trip
        const result = await fetch(
            'http://localhost:5000/user/savetrip', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({ trip }),
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
        setTitle: (state, { payload }) => {
            state.title = payload
        },
        setWaypoints: (state, { payload }) => {
            state.waypoints = payload
        }
    },
    extraReducers: {
        [saveTrip.pending]: (state) => {
            state.isLoading = true
        },
        [saveTrip.fulfilled]: (state, action) => {
            state._id = action.payload
            state.isLoading = false
        },
        [saveTrip.rejected]: (state) => {
            state.isLoading = false
            console.log("save trip failed")
        },

    }
})


export const { setOrigin, setDestination, setTitle, setWaypoints } = tripSlice.actions;
export default tripSlice.reducer
