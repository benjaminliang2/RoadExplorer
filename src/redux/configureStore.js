import { configureStore } from "@reduxjs/toolkit";
import originDestinationReducer from "../Slices/originDestinationSlice";
import userAuthReducer from '../Slices/userAuthSlice'

export default configureStore({
    reducer: {
        originDestination: originDestinationReducer,
        userAuth: userAuthReducer,

    }


})