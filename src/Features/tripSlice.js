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
            'http://localhost:5000/user/trip', {
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

export const fetchTrip = createAsyncThunk(
    'trip/fetchTrip',
    async (payload, thunkAPI) => {
        const result = await fetch(
            'http://localhost:5000/user/trip/' + payload, {
            mode: 'cors',
            credentials: 'include',
            method: "get",
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
        },
        setTripId: (state, { payload }) => {
            state._id = payload
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

        [fetchTrip.pending]: (state) => {
            state.isLoading = true
        },
        [fetchTrip.fulfilled]: (state, action) => {
            state.isLoading = false
            const trip = action.payload.trips[0]
            console.log(action.payload.trips[0]);
            //put fetched data into the redux store
            state.title = trip.title
            state.origin = trip.origin
            state.destination = trip.destination
        },
        [fetchTrip.rejected]: (state) => {
            state.isLoading = false
        },

    }
})


export const { setOrigin, setDestination, setTitle, setWaypoints, setTripId } = tripSlice.actions;
export default tripSlice.reducer
