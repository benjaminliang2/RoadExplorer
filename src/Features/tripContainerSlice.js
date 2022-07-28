import { createSlice } from '@reduxjs/toolkit'
import { fetchTrip } from './tripSlice'
const initialState = {
    view: 'loading',
    yelpCategory: 'tourist',
}

const tripContainerSlice = createSlice({
    name: 'tripContainer',
    initialState,
    reducers:{
        setView: (state, {payload}) => {
            state.view = payload
        },
        setYelpCategory: (state, {payload}) => {
            state.yelpCategory = payload
        }
    }, 
    extraReducers:{
        [fetchTrip.fulfilled]: (state, action) => {
            state.view = 'trip'
        }
    }
})

export const { setView, setYelpCategory } = tripContainerSlice.actions
export default tripContainerSlice.reducer