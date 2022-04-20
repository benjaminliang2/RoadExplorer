export const Waypoint = ({name})=>{
    return(
        <>
            <div className="waypoint">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpMHRgGhGu9aTtu0Te1mcG91JjK6v24lHbbw&usqp=CAU" alt="globe" />
                <h1>{name}</h1>
                {/* <h1>Address</h1> */}
            </div>
        </>
    )
    }