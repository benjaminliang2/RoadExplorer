import ReactDOM from 'react-dom';
import { useState } from "react";
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserAuthStatus, verify, logout } from '../Features/userAuthSlice';

import { LoginModal } from "./Login/LoginModal";
import { CustomModal } from "../styles/CustomModal"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Stack, styled, Tooltip } from "@mui/material";
import Menu from '@mui/material/Menu';
import Person from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';





const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
})

export const Navbar = () => {
    const dispatch = useDispatch()

    const [loginModal, setLoginModal] = useState(false)
    const [mode, setMode] = useState(null)

    const isAuth = useSelector((store) =>
        store.userAuth.isAuth
    )

    useEffect(() => {
        // const verifyAuth = () => {
        //     fetch(
        //         'http://localhost:5000/login', {
        //         mode: 'cors',
        //         credentials: 'include',
        //         method: "get",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //     })
        //         .then(res => res.json())
        //         .then(response => {
        //             // console.log(response)
        //             if (response.loggedIn == true) {
        //                 // console.log("user is already authenticated")
        //                 // setIsAuth(response.loggedIn)
        //                 dispatch(setUserAuthStatus(true))
        //             }
        //         })
        // }
        // verifyAuth();
        dispatch(verify())
    }, [])

    const handleLogout = () => {
        fetch(
            'http://localhost:5000/logout', {
            mode: 'cors',
            credentials: 'include',
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => {
                console.log(response)
                console.log('logged out')
                dispatch(setUserAuthStatus(false))
            })
    }
    return (
        <>
            <AppBar position="sticky">
                <StyledToolbar variant="dense">
                    <IconButton
                        size="large"
                        edge="start"
                        color="secondary"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary' }}>
                        RoadExplorer
                    </Typography>
                    {/* <Link to="/plan"> Road Trip </Link> */}
                    {isAuth

                        ? <AccountMenu handleLogout={handleLogout} />
                        : <>
                            <Button variant='contained' color='secondary'
                                onClick={() => {
                                    setLoginModal(true)
                                    setMode("login")
                                }}

                            >
                                Log In
                            </Button>
                            <Button variant='outlined' color='secondary'
                                onClick={() => {
                                    setLoginModal(true)
                                    setMode("signup")
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    }
                </StyledToolbar>
            </AppBar>

            {loginModal &&
                ReactDOM.createPortal(<>
                    <LoginModal setOpen={setLoginModal} mode={mode} setMode={setMode} />
                </>
                    , document.getElementById("portal"))

            }
        </>

    );
}

const AccountMenu = ({ handleLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showTripList, setShowTripList] = useState(false)
    const [trips, setTrips] = useState(null)

    useEffect(() => {
        if (showTripList == false) {
            setTrips(null)
        }
    }, [showTripList])

    const open = Boolean(anchorEl);
    const isAuth = useSelector((store) =>
        store.userAuth.isAuth
    )
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const fetchTrips = () => {
        fetch(
            'http://localhost:5000/user/trips', {
            mode: 'cors',
            credentials: 'include',
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => {
                console.log(response[0].trips)
                setTrips(response[0].trips)
            })
    }
    return (
        <>

            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Person />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar /> Profile
                </MenuItem>
                {isAuth &&
                    <MenuItem onClick={() => {
                        setShowTripList(true)
                        fetchTrips()
                    }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        My Trips
                    </MenuItem>
                }
                <Divider />
                <MenuItem onClick={() => handleLogout()}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>

            </Menu>

            {showTripList &&
                ReactDOM.createPortal(<>
                    <CustomModal setOpen={setShowTripList} title={"Saved Trips"}>
                        <Stack direction='column-reverse' height='100%'>
                            <Button><Typography>Create New Trip</Typography></Button>
                            <List>
                                {trips && trips.length > 0 &&
                                    trips.map((trip, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                                disablePadding
                                            >
                                                <Link to={`/trip/${trip._id}`} >
                                                    <ListItemButton>
                                                        <ListItemText id={trip._id} primary={trip.title} />
                                                    </ListItemButton>
                                                </Link>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </Stack>
                    </CustomModal>
                </>
                    , document.getElementById("portal"))

            }
        </>
    );
}

