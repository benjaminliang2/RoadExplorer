import { BusinessCard } from "./businessCard"
import "./businesses.css"


export const Businesses = (props)=>{
    const {img, title, location, description, star, reviewCount, coordinates, addToTrip, yelpID} = props
    return(<>
    <div className="businessesColumn">
        <BusinessCard
            img ={img}
            title ={title}
            location = {location}
            description = {description}
            star = {star}
            reviewCount = {reviewCount}
            coordinates = {coordinates}
            addToTrip={addToTrip}
            yelpID = {yelpID}

        />
        
    </div>
        

    </>)
}