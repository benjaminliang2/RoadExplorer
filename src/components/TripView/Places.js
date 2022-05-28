import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption, } from "@reach/combobox"
import "@reach/combobox/styles.css";
import { useDispatch } from "react-redux";
import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';




export const SearchTextField = ({ setPlace, placeholder, label }) => {
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
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={data.map(({ description }) => description)}
            onChange={(event, value) => handleSelect(value)}
            renderInput={(params) =>
                <TextField {...params} label={label} onChange={(e) => handleSelect(e.target.value)} placeholder={placeholder} variant="standard" required={true}/>
            }
            sx={{ width: 300 }}
        />
    </>
}
// export const EndPlaces = (set) => {
//     const dispatch = useDispatch()
//     const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

//     const handleSelect = async (val) => {

//         setValue(val, false);
//         clearSuggestions();
//         const results = await getGeocode({ address: val });
//         console.log(results[0])
//         const { lat, lng } = await getLatLng(results[0])
//         console.log(lat, lng)
//         dispatch(set({
//             coordinates: { lat, lng },
//             name: val

//         }))

//     }

//     return <>
//         <h4>Enter Destination</h4>

//         <Combobox onSelect={handleSelect}>
//             <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Los Angeles, California" disabled={!ready} />
//             <ComboboxPopover>
//                 <ComboboxList>
//                     {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
//                 </ComboboxList>
//             </ComboboxPopover>
//         </Combobox>
//     </>
// }

export const SearchBox = ({ panTo, getCustomResults }) => {
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();
    const handleSelect = async (val) => {
        setValue(val, false);
        clearSuggestions();
        const results = await getGeocode({ address: val });
        const name = val.substr(0, val.indexOf(','));
        const { lat, lng } = await getLatLng(results[0])
        console.log("searchbos is being used")
        getCustomResults(name, lat, lng)
        panTo({ lat, lng })
        

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


export const TripTitle = ({ setShowModal }) => {

    const start = useSelector((randomname) =>
        randomname.originDestination.origin
    )
    const end = useSelector((configureStore) =>
        configureStore.originDestination.destination
    )
    return (<>
        <Grid container>

            <Grid item>
                <h4>{start.name}</h4>
            </Grid>
            <Grid item>
                <ArrowRightAltIcon />
            </Grid>
            <Grid item>
                <h4>{end.name}</h4>
            </Grid>
            <Grid item>
                <IconButton color="primary" aria-label="Edit Trip"
                    onClick={() => {
                        console.log("edit trip")
                        setShowModal(true)
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Grid>
        </Grid>
    </>)
    //display origin, arrow l-r, destination, edit button.

}

