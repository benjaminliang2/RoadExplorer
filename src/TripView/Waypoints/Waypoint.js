export const Waypoint = ({name, imgURL})=>{
    return(
        <>
            <div className="waypoint">
                <img src={imgURL} alt="globe" />
                <h1>{name}</h1>
                {/* <h1>Address</h1> */}
            </div>
            <div className="leg">
            {/* display details of travel between each waypoint  */}

            </div>
        </>
    )
    }