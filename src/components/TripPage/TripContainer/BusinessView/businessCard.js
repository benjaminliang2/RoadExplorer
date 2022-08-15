import React, { useEffect, useState, useRef } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Button from '@mui/material/Button';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import zerostar from '../../../../images/regular_0.png'
import halfstar from '../../../../images/regular_1_half.png'
import onestar from '../../../../images/regular_1.png'
import oneandhalfstar from '../../../../images/regular_2_half.png'
import twostar from '../../../../images/regular_2.png'
import twoandhalfstar from '../../../../images/regular_3_half.png'
import threestar from '../../../../images/regular_3.png'
import threeandhalfstar from '../../../../images/regular_3_half.png'
import fourstar from '../../../../images/regular_4.png'
import fourandhalfstar from '../../../../images/regular_4_half.png'
import fivestar from '../../../../images/regular_5.png'

import { useTrip } from '../../useTrip';


export const BusinessCard = (props) => {
    // const {addToTrip} = useTrip()
    const { img, index, name, location, description, star, reviewCount, setActiveMarker, coordinates, yelpID, addToTrip, removeFromTrip } = props;
    // console.log(addToTrip)
    const handleOnClick = () => {
        if(removeFromTrip === undefined){
            addToTrip(coordinates, name, yelpID, img);
        } else {
            removeFromTrip(yelpID);
        }
    }
    const renderStars = (rating) => {
        switch (true) {
            case rating >= 4.8:
                return <Box component='img' src={fivestar} sx={{verticalAlign : 'bottom',}}/>;
            case rating >= 4.4:
                return <Box component='img' src={fourandhalfstar} sx={{verticalAlign : 'bottom',}}/>;
            case rating >= 4.0:
                return <Box component='img' src={fourstar} sx={{verticalAlign : 'bottom',}}/>;
            case rating >= 3.5:
                return <Box component='img' src={threeandhalfstar} sx={{verticalAlign : 'bottom',}}/>;
            case rating >= 3.0:
                return <Box component='img' src={threestar} sx={{verticalAlign : 'bottom',}}/>;
            case rating >= 2.5:
                return <Box component='img' src={twoandhalfstar} sx={{verticalAlign : 'bottom',}}/>;
            default:
                return <Box component='img' src={zerostar} sx={{verticalAlign : 'bottom',}}/>;
        }
    }
    return (
        <>
            <Stack direction="row" justifyContent='space-between' sx={styles.card} onMouseEnter={() => setActiveMarker({ id: yelpID })} onMouseLeave={() => setActiveMarker({ id: 'none' })}>

                <Stack direction='row' justifyContent='flex-start' alignItems='flex-start' width='max-content'>

                    <Box component='img' src={img} sx={styles.image} />

                    <Stack>
                        <Box>
                            <Typography variant='subtitle1' sx={{fontWeight:800}}> {name} </Typography>
                        </Box>
                        <Box >
                            {renderStars(star)}
                            <Typography variant='p'> {reviewCount} </Typography>
                        </Box>
                        <Box>
                            <Typography variant='p'> {description} </Typography>
                        </Box>
                        <Box>
                            <Typography variant='p'> {location} </Typography>
                        </Box>
                    </Stack>
                </Stack>
                <Box>
                    <IconButton onClick={handleOnClick}>
                        {removeFromTrip === undefined ? 
                        <AddCircleIcon color='secondary'/> :
                        <RemoveCircleIcon/>
                        }
                    </IconButton>
                </Box>
            </Stack>

        </>
    )
}

const styles = {
    card: {
        margin: '10px'
    },
    image: {
        width: '130px',
        height: '130px',
        marginRight: '5px',
        objectFit: 'cover',
        
    }
}