import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import tripReducer, { saveTrip, fetchTrip, setDestination, setOrigin, setTitle, setWaypoints, setTripId, } from "../Features/tripSlice";
import userAuthReducer from '../Features/userAuthSlice'
import tripContainerReducer from "../Features/tripContainerSlice";


const listenerMiddleWare = createListenerMiddleware()

listenerMiddleWare.startListening({
    matcher: isAnyOf(setOrigin, setDestination, setTitle, setWaypoints),
    effect: async (action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        await listenerAPI.delay(1000)
        //TODO only dispatch save trip if a state of origin and destination are both true. 
        const origin = listenerAPI.getState().trip.origin
        const dest = listenerAPI.getState().trip.destination
        if (origin && dest) {
            listenerAPI.dispatch(saveTrip(action.payload))
        }
    }
})

listenerMiddleWare.startListening({
    matcher: isAnyOf(setTripId),
    effect: async (action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        await listenerAPI.delay(1000)
        //action.payload is the tripId 
        listenerAPI.dispatch(fetchTrip(action.payload))
    }
})


export default configureStore({
    reducer: {
        trip: tripReducer,
        tripContainer: tripContainerReducer,
        userAuth: userAuthReducer,
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleWare.middleware)

})