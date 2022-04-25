import "./Route_View.css"
import { Waypoint } from "./Waypoints/Waypoint"
export const RouteView = (props)=>{
    const {start, end,  waypoints} = props;
    return(
        <>
        {/* starting waypoint */}
        <Waypoint name={start.name}/>

        {waypoints?.map(waypoint=>

            <Waypoint name = {waypoint.name} imgURL = {waypoint.imgURL}/>
            
        )}


        {/* ending waypoint */}
        <Waypoint name={end.name}/>
        </>


        
    )
}