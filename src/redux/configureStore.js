import { configureStore } from "@reduxjs/toolkit";
import originDestinationReducer from "../Slices/originDestinationSlice";

export default configureStore({
    reducer: {
        originDestination: originDestinationReducer,

    }


})