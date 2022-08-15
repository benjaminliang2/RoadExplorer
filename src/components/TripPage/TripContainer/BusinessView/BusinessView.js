import { BusinessCard } from "./businessCard"
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from "react-redux";

export const BusinessView = (props) => {
    const { businesses, setActiveMarker, addToTrip, removeFromTrip} = props
    const selected = useSelector((store) => store.trip.businessesSelected)
    return (<>

            <Stack sx={{maxHeight: '100%', overflowY: 'auto'}}>
                
                {businesses.length === 0 ? (
                    <Box sx={{ display: 'flex' }}>
                        <h1>loading component...</h1>
                    </Box>
                ) : (
                    businesses.map((business, index) => (
                        selected.some(e => e.id === business.id)
                        ?
                        <BusinessCard
                            index= {index}
                            img={business.image_url}
                            name={business.name}
                            location={business.location.address1}
                            description={business.categories[0].title}
                            star={business.rating}
                            reviewCount={business.review_count}
                            coordinates={business.coordinates}
                            yelpID={business.id}
                            key={business.id}
                            setActiveMarker={setActiveMarker}
                            removeFromTrip={removeFromTrip}
                        />
                        :
                        <BusinessCard
                            index= {index}
                            img={business.image_url}
                            name={business.name}
                            location={business.location.address1}
                            description={business.categories[0].title}
                            star={business.rating}
                            reviewCount={business.review_count}
                            coordinates={business.coordinates}
                            yelpID={business.id}
                            key={business.id}
                            setActiveMarker={setActiveMarker}
                            addToTrip={addToTrip}
                        />
                    ))
                )}

            </Stack>

        {/* </Stack> */}


    </>)
}