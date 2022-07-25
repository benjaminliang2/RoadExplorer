import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const initialState = {
    isAuth: false,
    isLoading: false
}

export const login = createAsyncThunk(
    'userAuth/login',
    async (payload, thunkAPI) => {

        console.log(payload)
        const { email, password } = payload
        const result = await fetch(
            'http://localhost:5000/login', {
            mode: 'cors',
            credentials: 'include',
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        )
        const response = await result.json()
        // console.log(response.user)
        return response
    }
)

export const verify = createAsyncThunk(
    'userAuth/verify',
    async (payload, thunkAPI) => {
        console.log("slice is verifying user auth status ")
        const result = await fetch(
            'http://localhost:5000/login', {
            mode: 'cors',
            credentials: 'include',
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await result.json()
        // console.log(response)
        return response
    }
)

export const signup = createAsyncThunk(
    'userAuth/signup',
    async (payload, thunkAPI) => {
        console.log(payload)
        const {email, password} = payload
        const result = await fetch(
            'http://localhost:5000/signup', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        const response = await result.json()
        return response
    }
)

export const logout = createAsyncThunk(
    'userAuth/logout',
    async (payload, thunkAPI) => {
        
    }
)

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setUserAuthStatus: (state, { payload }) => {
            state.status = payload
        },
    },
    extraReducers:{
        [login.pending]: (state) => {
            state.isLoading = true
        },
        [login.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isAuth = true
        },
        [login.rejected]: (state) => {
            state.isLoading = false
        },
        [signup.pending]: (state) => {
            state.isLoading = true
        },
        [signup.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [signup.rejected]: (state) => {
            state.isLoading = false
        },
        [verify.pending]: (state) => {
            state.isLoading = true
        },
        [verify.fulfilled]: (state, action) => {
            // console.log(action.payload)
            state.isLoading = false
            state.isAuth = true
        },
        [verify.rejected]: (state) => {
            state.isLoading = false
        },
    }
    })

export const { setUserAuthStatus } = userAuthSlice.actions;
export default userAuthSlice.reducer