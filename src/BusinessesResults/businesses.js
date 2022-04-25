import { BusinessCard } from "./businessCard"
import "./businesses.css"


export const Businesses = (props)=>{
    const {hikes, addToTrip} = props
    // console.log(hikes)

    return(<>
    <div className="businessesColumn">
    <button onClick={addToTrip()}>add to trip function</button>
    {hikes.map(hike=>(
        <BusinessCard
            img = {hike.image_url}
            title = {hike.name}
            location = {hike.location.address1}
            description = {hike.categories[0].title}
            star = {hike.rating}
            reviewCount = {hike.review_count}
            coordinates= {hike.coordinates}
            yelpID = {hike.id}
            // addToTrip={()=>addToTrip()}
            addToTrip={addToTrip}

            // addToTrip={()=>addToTrip}

        />

    ))}
        
    </div>
        

    </>)
}