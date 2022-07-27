import { createSlice } from '@reduxjs/toolkit'

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
    }
})

export const { setView, setYelpCategory } = tripContainerSlice.actions
export default tripContainerSlice.reducer