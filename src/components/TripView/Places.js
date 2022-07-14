import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption, } from "@reach/combobox"
import "@reach/combobox/styles.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from '../../Features/tripSlice'
import { Cookies, useCookies } from "react-cookie";

import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';



export const SearchOrigin = ({ placeholder, label }) => {
    const isAuth = useSelector((auth) => 
        auth.userAuth
    )
    const dispatch = useDispatch()
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
    const [cookies, setCookie] = useCookies()

    // useEffect(() => {
    //     if(document.cookie){
    //         setCookie('origin', "home", {
    //             path: '/'
    //         });
    //         setCookie('destination', "office", {
    //             path: '/'
    //         });
    //         console.log(document.cookie)
    //         console.log(cookies.origin)
    //     }
    // }, [])
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
    const [cookies, setCookie] = useCookies()


    const handleSelect = async (val) => {
        const results = await getGeocode({ address: val });
        const { lat, lng } = await getLatLng(results[0])

        dispatch(setDestination({
            coordinates: { lat, lng },
            name: val
        }))

        // setCookie('destination', {coordinates: {lat, lng}, name: val}, {
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

export const SearchBox = ({ panTo, getCustomResults, setShowTripDetails }) => {
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
    const handleSelect = async (val) => {
        // setValue(val, false);
        // clearSuggestions();
        const results = await getGeocode({ address: val });
        const name = val.substr(0, val.indexOf(','));
        const { lat, lng } = await getLatLng(results[0])
        
        setShowTripDetails(false)
        getCustomResults(name, lat, lng)
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

{/* 
        <Combobox onSelect={handleSelect}>
            <ComboboxInput autoFocus value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Search Places..." disabled={!ready} />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox> */}
    </>

}




