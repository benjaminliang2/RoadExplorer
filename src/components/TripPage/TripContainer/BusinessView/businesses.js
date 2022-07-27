import { BusinessCard } from "./businessCard"
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Businesses = (props) => {
    const { businesses, setActiveMarker} = props
    // console.log(businesses);
    return (<>

            <Stack sx={{maxHeight: '100%', overflowY: 'auto'}}>
                
                {businesses.length === 0 ? (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    businesses.map((business, index) => (
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
                            setActiveMarker={setActiveMarker}
                        />
                    ))
                )}

            </Stack>

        {/* </Stack> */}


    </>)
}