import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from '../../../Features/tripSlice'

import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { useTrip } from "../useTrip";

export const SearchOrigin = ({ placeholder, label }) => {
    const isAuth = useSelector((auth) => 
        auth.userAuth
    )
    const dispatch = useDispatch()
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();


    const handleSelect = async (val) => {
        const results = await getGeocode({ address: val });
        const { lat, lng } = await getLatLng(results[0])
        dispatch(setOrigin({
            coordinates: { lat, lng },
            name: val
        }))
        // setCookie('origin', {coordinates: {lat, lng}, name: val}, {
        //     path: '/'
        // })
    }
    return <>
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={data.map(({ description }) => description)}
            onChange={(event, value) => handleSelect(value)}
            renderInput={(params) =>
                <TextField {...params} label={label} onChange={(e) => setValue(e.target.value, true)} placeholder={placeholder} variant="standard" required={true} />
            }
            sx={{ margin: '0px 10px 0px 10px' }}
        />
    </>
}
export const SearchDestination = ({ placeholder, label }) => {
    const dispatch = useDispatch()
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();


    const handleSelect = async (val) => {
        const results = await getGeocode({ address: val });
        const { lat, lng } = await getLatLng(results[0])

        dispatch(setDestination({
            coordinates: { lat, lng },
            name: val
        }))

    }
    return <>
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={data.map(({ description }) => description)}
            onChange={(event, value) => handleSelect(value)}
            renderInput={(params) =>
                <TextField {...params} label={label} onChange={(e) => setValue(e.target.value, true)} placeholder={placeholder} variant="standard" required={true} />
            }
            sx={{ margin: '0px 10px 0px 10px' }}
        />
    </>
}

export const SearchBox = ({ panTo, setShowTripDetails }) => {
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
    const {getCustomBusinesses} = useTrip()
    const handleSelect = async (val) => {
        // setValue(val, false);
        // clearSuggestions();
        const results = await getGeocode({ address: val });
        const name = val.substr(0, val.indexOf(','));
        const { lat, lng } = await getLatLng(results[0])
        
        setShowTripDetails(false)
        getCustomBusinesses(name, lat, lng)
        panTo({ lat, lng })
    }

    return <>

        <Autocomplete
            id='custom-search-box'
            freeSolo
            options={data.map(({description}) => description)}
            onChange={(event,value) => handleSelect(value)}
            renderInput={(params) =>
                <TextField {...params}  onChange={(e) => setValue(e.target.value, true)} placeholder='e.g. Yellowstone National Park...' variant="standard" required={true} />
            }
        />
    </>

}




