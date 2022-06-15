import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PinDropIcon from '@mui/icons-material/PinDrop';

export const Leg = ({ name, address, imgURL, directions, index, removeFromTrip, id }) => {

    if (directions) {
        if (index >= directions.routes[0].legs.length) {
            return null;
        }
        var distance = directions.routes[0].legs[index].distance.value;
        var seconds = directions.routes[0].legs[index].duration.value;

        var toTimeString = (seconds) => {
            return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
        }
        var duration = toTimeString(seconds)
    }

    return (
        <>
            <Grid container columnSpacing={4} rowSpacing={3} alignItems="center" >
                <Grid item xs={4} sx={{ 'align-self': 'center', 'text-align': 'center' }}>
                    {imgURL 
                        ? <img sx={{ 'object-fit': 'cover', 'height': '100%', 'width': '100%' }} alt="complex" src={imgURL} />
                        : <PinDropIcon />
                    }
                </Grid>
                <Grid item xs={8} >
                    <Grid item container alignItems="center">
                        <Grid item xs={10}>
                            {name}
                            {/* <p>{address}</p> */}
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton sx={{color: 'white'}} color="secondary" onClick={() => { removeFromTrip(id) }}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container >
                <Grid item xs={12}>
                    {/* display details of travel between each waypoint  */}
                    {directions && (
                        <>
                            <p style={{'text-align': 'center'}} className="distance"> {Math.round(distance * 0.000621371192 * 10) / 10} Miles --- {duration}</p>
                        </>
                    )}
                </Grid>

            </Grid>
        </>
    )
}