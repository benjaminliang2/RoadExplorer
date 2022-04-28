import "./Leg.css"


export const Leg = ({name, imgURL, directions, index})=>{
    if(directions){
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