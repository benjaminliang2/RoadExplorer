import { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Leg } from "./Leg"
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector } from "react-redux";
import { Backdrop, Box, Button, Container, Divider, Grid, IconButton, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Stack, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


import { configureStore } from "@reduxjs/toolkit";
import { SearchBox } from "./Places";
import { Businesses } from "./BusinessesView/businesses";
import { ConstructionOutlined, RestartAlt } from "@mui/icons-material";

export const TripView = (props) => {
    const { waypoints, directions, removeFromTrip, setShowModal,
        businesses, addToTrip, setSearchCategory, setActiveMarker, panTo, getCustomResults, showTripDetails, setShowTripDetails, showSearch } = props;

    const start = useSelector((randomname) =>
        randomname.originDestination.origin
    )
    const end = useSelector((configureStore) =>
        configureStore.originDestination.destination
    )



    let totalDistance = 0;
    let seconds = 0;
    directions.routes[0].legs.forEach(leg => {
        totalDistance += leg.distance.value;
        seconds += leg.duration.value;
    })
    var toTimeString = (seconds) => {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }
    var totalDuration = toTimeString(seconds)

    return (
        <>
            <Stack sx={styles.tripViewBox}>
                <TripSummary setShowModal={setShowModal} totalDistance={totalDistance} totalDuration={totalDuration} />
                {showSearch &&
                    <SearchBox panTo={panTo} getCustomResults={getCustomResults} setShowTripDetails={setShowTripDetails} />
                }

                <Box sx={showTripDetails ? null : styles.hide}>
                    <Leg name={start.name} directions={directions} index={0} />
                    {waypoints?.map((waypoint, index) =>
                        <Leg name={waypoint.name} imgURL={waypoint.imgURL} directions={directions} index={index + 1} removeFromTrip={removeFromTrip} id={waypoint.yelp_id} />
                    )}
                    <Leg name={end.name} />
                </Box>
                {businesses &&
                    <Box sx={!showTripDetails ? { display: 'contents' } : styles.hide}>
                        <Businesses
                            hikes={businesses}
                            addToTrip={addToTrip}
                            setSearchCategory={setSearchCategory}
                            setActiveMarker={setActiveMarker}
                            panTo={panTo}
                            getCustomResults={getCustomResults}
                        />
                    </Box>
                }
            </Stack>
        </>



    )
}

const TripSummary = ({ setShowModal, totalDistance, totalDuration }) => {

    const originTemp = useSelector((randomname) =>
        randomname.originDestination.origin.name
    )
    const destinationTemp = useSelector((configureStore) =>
        configureStore.originDestination.destination.name
    )
    let origin = originTemp.substr(0, originTemp.indexOf(','))
    let destination = destinationTemp.substr(0, destinationTemp.indexOf(','))

    const [title, setTitle] = useState(destination + ' Trip')
    const [editTitleModal, setEditTitleModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (<>
        <Stack >
            <Box sx={styles.tripTitle} component={Stack} position='relative'>
                {/* insert background photo  */}
                <Typography variant="h5" align='center'>{title}</Typography>
                <Box position='absolute' sx={{ right: 0, top: 0, margin: '10px' }}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'more-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}

                    >

                        <MenuItem onClick={() => setEditTitleModal(true)}>
                            <ListItemIcon>
                                <DriveFileRenameOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary='Rename' />
                        </MenuItem>
                        <MenuItem >
                            <ListItemIcon>
                                <RestartAltIcon />
                            </ListItemIcon>
                            <ListItemText primary='Reset Trip' />
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            <Stack direction="row" spacing={1} justifyContent='space-between'>
                <Box>
                    <Typography>Summary</Typography>
                </Box>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>

                    <Box>
                        <Typography sx={{ verticalAlign: 'middle', display: 'inline-flex' }}><DirectionsCarIcon /> {Math.round(totalDistance * 0.000621371192 * 10) / 10} Miles</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ verticalAlign: 'middle', display: 'inline-flex' }}><AccessTimeIcon /> {totalDuration}</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Stack>

        {editTitleModal &&
            <EditTitleModal setOpen={setEditTitleModal} setTitle={setTitle} title={title} />
        }
    </>)

}

const EditTitleModal = ({ setOpen, setTitle, title }) => {
    const [name, setName] = useState(title)

    const handleClose = () => {
        setOpen(false)
    }
    return ReactDOM.createPortal(<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => { handleClose() }}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Box sx={styles.modalBox}>
                <TextField variant='standard' label='Trip Name' value={name} required onChange={(e) => setName(e.target.value)} sx={{ display: 'block' }} inputRef={input => input && input.focus()} />
                <Stack direction='row' justifyContent='flex-end'>

                    <Button
                        variant="text"
                        color='secondary'
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setTitle(name)
                            setOpen(false)
                        }}
                    >
                        Save
                    </Button>

                </Stack>
            </Box>

        </Modal>
    </>, document.getElementById("portal"))
}

const styles = {
    tripViewBox: {
        backgroundColor: 'white',
        height: '90%',
        borderRadius: 'inherit'
    },
    tripTitle: {
        backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/000/207/539/small_2x/Road_Trip_Sunset.jpg")`,
        height: '10vh',
        justifyContent: 'center',
        align: 'right',
        borderTopRightRadius: '25px',
        borderTopLeftRadius: '25px',
        minWidth: '500px'

    },
    hide: {
        display: 'none'
    },
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',

        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }
}