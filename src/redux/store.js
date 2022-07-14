import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import tripReducer, {saveTrip, setDestination, setOrigin} from "../Features/tripSlice";
import userAuthReducer from '../Features/userAuthSlice'

const listenerMiddleWare = createListenerMiddleware()

listenerMiddleWare.startListening({
    actionCreator: setOrigin,
    effect: async(action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        // await listenerAPI.delay(1000)
        console.log("side effect origin");
        listenerAPI.dispatch(saveTrip(action.payload))

    }
})

listenerMiddleWare.startListening({
    actionCreator: setDestination,
    effect: async(action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        // await listenerAPI.delay(1000)
        console.log("side effect destination");
        listenerAPI.dispatch(saveTrip(action.payload))

    }
})
export default configureStore({
    reducer: {
        trip: tripReducer,
        userAuth: userAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleWare.middleware)
    
})