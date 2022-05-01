import { BusinessCard } from "./businessCard"
import "./businesses.css"
import { SearchFilter } from "./SearchFilter"


export const Businesses = (props)=>{
    const {hikes, addToTrip, setActiveMarker, setSearchCategory} = props
    return(<>
    <div className="search-bar">
        <SearchFilter setSearchCategory = {setSearchCategory}/>
    </div>
    <div className="businessesColumn">
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
        
    </div>
        

    </>)
}