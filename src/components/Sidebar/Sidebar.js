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

export const Sidebar = ({setSearchCategory}) => {
    const show = true;
    const styles = {
        background: '#FF6B6B',
    }
    return (
        <Stack sx={show ? styles : null} spacing={2}>
            <Tooltip title="My Trip" placement='right'>
                <IconButton color="secondary" onClick={() => { }}>
                    <DirectionsCarIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Search" placement='right'>
                <IconButton color="secondary" onClick={() => {}}>
                    <SearchIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Recommended" placement='right'>
                <IconButton color="secondary" onClick={() => { setSearchCategory("tourist")}}>
                    <StarIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Attractions" placement='right'>
                <IconButton color="secondary" onClick={() => { setSearchCategory("attractions") }}>
                    <FlagIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Food" placement='right'>
                <IconButton color="secondary" onClick={() => {setSearchCategory("Restaurants") }}>
                    <RestaurantMenuIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Shopping" placement='right'>
                <IconButton color="secondary" onClick={() => {setSearchCategory("shopping") }}>
                    <ShoppingBagIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title="Parks" placement='right'>
                <IconButton color="secondary" onClick={() => { setSearchCategory("parks") }}>
                    <ForestIcon fontSize='large' />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
