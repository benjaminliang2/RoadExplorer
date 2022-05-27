import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption, } from "@reach/combobox"
import "@reach/combobox/styles.css";
import { useDispatch } from "react-redux";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export const StartPlaces = ({setPlace, placeholder, label}) => {
    const dispatch = useDispatch()
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

    const handleSelect = async (val) => {
        console.log(val)
        setValue(val, true);
        // clearSuggestions();
        const results = await getGeocode({ address: val });
        console.log(results[0])

        const { lat, lng } = await getLatLng(results[0])
        
        dispatch(setPlace({
            coordinates: { lat, lng },
            name: val
        }))

    }
    return <>
        <h4>Enter Origin</h4>
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={data.map(({ description }) => description)}
            onChange={(event, value) => handleSelect(value)}
            renderInput={(params) => <TextField {...params} label={label} onChange={(e) => handleSelect(e.target.value)} placeholder={placeholder} />}
            sx={{ width: 300 }}
        />
    </>
}
export const EndPlaces = (set) => {
    const dispatch = useDispatch()
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

    const handleSelect = async (val) => {

        setValue(val, false);
        clearSuggestions();
        const results = await getGeocode({ address: val });
        console.log(results[0])
        const { lat, lng } = await getLatLng(results[0])
        console.log(lat, lng)
        dispatch(set({
            coordinates: { lat, lng },
            name: val

        }))

    }

    return <>
        <h4>Enter Destination</h4>

        <Combobox onSelect={handleSelect}>
            <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Los Angeles, California" disabled={!ready} />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </>
}

export const SearchBox = ({ panTo, getCustomResults }) => {
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
    const handleSelect = async (val) => {
        setValue(val, false);
        clearSuggestions();
        const results = await getGeocode({ address: val });
        const name = val.substr(0, val.indexOf(','));
        const { lat, lng } = await getLatLng(results[0])

        panTo({ lat, lng })
        getCustomResults(name, lat, lng)

    }

    return <>
        <Combobox onSelect={handleSelect}>
            <ComboboxInput autoFocus value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Search Places..." disabled={!ready} />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </>

}

