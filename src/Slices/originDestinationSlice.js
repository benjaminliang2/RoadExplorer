import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    origin: false,
    destination: false
}

const originDestinationSlice = createSlice({
    name: 'originDestination',
    initialState,
    reducers: {
        setOrigin: (state, {payload}) => {
            state.origin = payload
        },
        setDestination: (state, {payload}) => {
            state.destination = payload
        }
    }
})


export const { setOrigin, setDestination } = originDestinationSlice.actions;
export default originDestinationSlice.reducer