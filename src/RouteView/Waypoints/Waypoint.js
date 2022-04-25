export const Waypoint = ({name, imgURL})=>{
    console.log(imgURL)
    return(
        <>
            <div className="waypoint">
            <img src={imgURL} alt="globe" />
                <h1>{name}</h1>
                {/* <h1>Address</h1> */}
            </div>
        </>
    )
    }