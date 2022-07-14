import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: false
}

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setUserAuthStatus: (state, {payload}) => {
            state.status = payload
        },
    }
})

export const { setUserAuthStatus } = userAuthSlice.actions;
export default userAuthSlice.reducer