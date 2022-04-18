import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption, } from "@reach/combobox"
import "@reach/combobox/styles.css";


export const StartPlaces = ({setStart})=>{
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();

    const handleSelect = async (val)=>{
        
        setValue(val, false);
        clearSuggestions();

        const results = await getGeocode({address: val});
        const {lat, lng} = await getLatLng(results[0])
        setStart({lat, lng})
    }

    return<>
        <h4>Enter Starting Location</h4>
        <Combobox onSelect={handleSelect}>
            <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Search Location"/>
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({place_id, description}) =><ComboboxOption key={place_id} value={description}/>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </>
}
export const EndPlaces = ({setEnd})=>{
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();

    const handleSelect = async (val)=>{
        
        setValue(val, false);
        clearSuggestions();

        const results = await getGeocode({address: val});
        const {lat, lng} = await getLatLng(results[0])
        setEnd({lat, lng})
    }

    return<>
        <h4>Enter Ending Location</h4>

        <Combobox onSelect={handleSelect}>
            <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} className="combobox-input" placeholder="Search Location"/>
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({place_id, description}) =><ComboboxOption key={place_id} value={description}/>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    </>
}

// export const SearchPlaces = ({setEnd, setStart})=>{
//     return(<>
//         <StartPlaces setStart = {setStart}/>
//         <EndPlaces setEnd = {setEnd}/>
//     </>)
// }