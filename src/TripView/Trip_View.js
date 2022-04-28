
import { Leg } from "./Leg"
export const TripView = (props)=>{
    const {start, end,  waypoints, directions} = props;
    let totalDistance = 0;
    let seconds = 0;
    directions.routes[0].legs.forEach(leg =>{
        totalDistance += leg.distance.value;
        seconds += leg.duration.value;
    })
    var toTimeString = (seconds)=>{
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }
    var totalDuration = toTimeString(seconds)

    return(
        <>
        <div className="summary">
            <h2>Total Miles: {Math.round(totalDistance*0.000621371192 * 10 ) / 10}</h2>
            <h2>Total Time : {totalDuration}</h2>
        </div>
        <div className="total-legs">
            <Leg name={start.name} directions={directions} index = {0}/>
            {waypoints?.map((waypoint, index)=>
                <Leg name = {waypoint.name} imgURL = {waypoint.imgURL} directions={directions} index = {index+1}/>      
            )}
            <Leg name={end.name}/>
        </div>

        </>


        
    )
}