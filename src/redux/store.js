import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import tripReducer, {saveTrip, setDestination, setOrigin, setTitle, setWaypoints} from "../Features/tripSlice";
import userAuthReducer from '../Features/userAuthSlice'


const listenerMiddleWare = createListenerMiddleware()

listenerMiddleWare.startListening({
    matcher: isAnyOf( setDestination, setTitle, setWaypoints),
    effect: async(action, listenerAPI) => {
        listenerAPI.cancelActiveListeners();
        await listenerAPI.delay(1000)
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