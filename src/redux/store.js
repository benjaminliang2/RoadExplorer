import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import tripReducer, {saveTrip, fetchTrip, setDestination, setOrigin, setTitle, setWaypoints, setTripId, } from "../Features/tripSlice";
import userAuthReducer from '../Features/userAuthSlice'


const listenerMiddleWare = createListenerMiddleware()

listenerMiddleWare.startListening({
    matcher: isAnyOf(setOrigin, setDestination, setTitle, setWaypoints),
    effect: async(action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        await listenerAPI.delay(1000)
        listenerAPI.dispatch(saveTrip(action.payload))
    }
})

listenerMiddleWare.startListening({
    matcher: isAnyOf(setTripId),
    effect: async(action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        await listenerAPI.delay(1000)
        //action.payload is the tripId 
        listenerAPI.dispatch(fetchTrip(action.payload))
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