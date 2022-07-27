import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ForestIcon from '@mui/icons-material/Forest';
import FlagIcon from '@mui/icons-material/Flag';
import { setView, setYelpCategory } from '../../../../Features/tripContainerSlice';

import { useDispatch } from 'react-redux';
export const Sidebar = () => {
    const dispatch = useDispatch()
    const show = true;
    const styles = {
        height: '100%'
    }

    const handleIcon = (category) => {
        dispatch(setView("business"))
        dispatch(setYelpCategory(category))
    }
    return (
        <Box width='min-content' sx={{margin: '10px', backgroundColor: 'white', borderRadius: '20px'}}>
            <Stack sx={show ? styles : null} spacing={2} direction='row'>
                <Tooltip title="My Trip" placement='bottom'>
                    <IconButton color="secondary" onClick={() => {dispatch(setView("trip"))}}>
                        <DirectionsCarIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Search" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { dispatch(setView("business")) }}>
                        <SearchIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Recommended" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { handleIcon("Tourist") }}>
                        <StarIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Attractions" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { handleIcon("attractions") }}>
                        <FlagIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Food" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { handleIcon("restaurants") }}>
                        <RestaurantMenuIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Shopping" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { handleIcon("shopping") }}>
                        <ShoppingBagIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Parks" placement='bottom'>
                    <IconButton color="secondary" onClick={() => { handleIcon("parks") }}>
                        <ForestIcon fontSize='medium' />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}
