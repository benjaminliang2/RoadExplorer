import { BusinessCard } from "./businessCard"
import "./businesses.css"
import { SearchFilter } from "./SearchFilter"
import { Stack, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SearchBox as SearchField } from "../TripView/Places"
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';





export const Businesses = (props) => {
    const { hikes, addToTrip, setActiveMarker, setSearchCategory, panTo, getCustomResults } = props

    const [showSearchField, setShowSearchField] = useState(false)

    return (<>
        <Stack>

            <SearchFilter setSearchCategory={setSearchCategory} />
            <IconButton sx={{ color: 'black' }} color="secondary" onClick={() => { setShowSearchField((prevState) => !prevState)}}>
                <SearchIcon />
            </IconButton>

            {showSearchField &&
                <SearchField panTo={panTo} getCustomResults={getCustomResults} />
            }
            <Stack sx={{ 'overflow-y': 'scroll' }}>

                {hikes.length === 0 ? (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    hikes.map(hike => (
                        <BusinessCard
                            img={hike.image_url}
                            name={hike.name}
                            location={hike.location.address1}
                            description={hike.categories[0].title}
                            star={hike.rating}
                            reviewCount={hike.review_count}
                            coordinates={hike.coordinates}
                            yelpID={hike.id}
                            addToTrip={addToTrip}
                            setActiveMarker={setActiveMarker}
                        />
                    ))
                )}

            </Stack>

        </Stack>


    </>)
}