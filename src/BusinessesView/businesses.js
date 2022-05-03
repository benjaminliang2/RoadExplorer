import { BusinessCard } from "./businessCard"
import "./businesses.css"
import { SearchFilter } from "./SearchFilter"
import {Stack} from '@mui/material'; 




export const Businesses = (props)=>{
    const {hikes, addToTrip, setActiveMarker, setSearchCategory} = props
    return(<>
    <Stack>
        
        <SearchFilter setSearchCategory = {setSearchCategory}/>
        
        <Stack sx={{ 'overflow-y': 'scroll' }}>

        
        {hikes.map(hike=>(           
            <BusinessCard
                img = {hike.image_url}
                name = {hike.name}
                location = {hike.location.address1}
                description = {hike.categories[0].title}
                star = {hike.rating}
                reviewCount = {hike.review_count}
                coordinates= {hike.coordinates}
                yelpID = {hike.id}
                addToTrip={addToTrip}
                setActiveMarker = {setActiveMarker}
            />
        ))}
        </Stack>
        
    </Stack>
        

    </>)
}