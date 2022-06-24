import { useState } from 'react';
import ReactDOM from 'react-dom';
import { SearchOrigin, SearchDestination } from './Places';

import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PinDropIcon from '@mui/icons-material/PinDrop';
import EditIcon from '@mui/icons-material/Edit';



export const Leg = ({ name, address, imgURL, directions, index, removeFromTrip, id, origin, destination }) => {

    const [editOrigin, setEditOrigin] = useState(false)
    const [editDestination, setEditDestination] = useState(false)

    if (directions) {
        if (index >= directions.routes[0].legs.length) {
            return null;
        }
        var distance = directions.routes[0].legs[index].distance.value;
        var seconds = directions.routes[0].legs[index].duration.value;


        function toTimeString(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h >= 0 ? h + 'h ' : "";
            var mDisplay = m > 0 ? m + 'm' : "";
            return hDisplay + mDisplay;
        }
        var duration = toTimeString(seconds)
    }

    const handleEditButton = () => {
        if (origin === true) {
            setEditOrigin(true)
        }

    }

    if (editOrigin === true) {
        return ReactDOM.createPortal(<>
            <SearchOrigin/>
        </>, document.getElementById("portal"))
    }

    return (
        <>
            <Grid container spacing={1} sx={{ marginTop: '5px' }}>
                <Grid item sm={3} sx={{ textAlign: 'center' }}>
                    {imgURL
                        ? <Box component='img' sx={{ 'object-fit': 'cover', width: '80px', height: '80px' }} src={imgURL} />
                        : <PinDropIcon />
                    }
                </Grid>
                <Grid item sm={9}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='subtitle1' sx={{ fontWeight: 800 }}> {name} </Typography>
                        {imgURL
                            ? <IconButton onClick={() => handleEditButton()}>
                                <DeleteIcon sx={{ alignSelf: 'flex-start' }} />
                            </IconButton>
                            : <IconButton onClick={() => { removeFromTrip(id) }}>
                                <EditIcon sx={{ alignSelf: 'flex-start' }} />
                            </IconButton>
                        }



                    </Stack>
                </Grid>
                {directions && (
                    <Grid item sm={12} sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography variant='p' >
                            {Math.round(distance * 0.000621371192 * 10) / 10} mi --- {duration}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </>

    )
}