import "./Leg.css"


export const Leg = ({name, imgURL, directions, index, removeFromTrip, id})=>{
    
    if(directions){
        //This resolves the problem where tripView and Legs get rerendered as soon as directions state change
        //but it depends on the waypoints state too, but it renders before waypoints state update
        if(index >= directions.routes[0].legs.length){
            return null;
        }
        var distance = directions.routes[0].legs[index].distance.value;
        var seconds = directions.routes[0].legs[index].duration.value;
    
        var toTimeString = (seconds)=>{
            return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
        }
        var duration = toTimeString(seconds)
    }
    
    return(
        <>
            <div className="card">
                <div className="top">
                    <div className="image">
                        <img src={imgURL} alt="globe" />
                    </div>
                    {removeFromTrip && (
                        <button onClick={()=>{removeFromTrip(id)}}>Remove From Trip</button>
                    )}
                    
                    <div className="name">
                        <h1>{name}</h1>
                    </div>
                </div>
                
                
                {/* <h1>Address</h1> */}
            
                <div className="details">
                    {/* display details of travel between each waypoint  */}
                    {directions && (
                        <>
                            <p className="distance"> {Math.round(distance*0.000621371192 * 10 ) / 10} Miles</p>
                            <p className="duration"> {duration} </p>
                        </>
                        
                    )}
                </div>
            </div>
        </>
    )
    }