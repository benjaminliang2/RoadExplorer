import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTitle } from '../../../Features/tripSlice'

import { SearchBox, SearchOrigin, SearchDestination } from "./Places";
import { BusinessView } from "./BusinessView/BusinessView";
import { Sidebar } from "./TripView/Sidebar"

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Backdrop, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Stack, TextField, Typography } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { TripView } from './TripView/TripView';
import { CreateView } from './CreateView'
import store from '../../../redux/store';

export const TripContainer = (props) => {
    const { businesses, directions, setActiveMarker, panTo, getCustomBusinesses, addToTrip, removeFromTrip } = props;
    //loading, trip, business, form
    const view = useSelector((store) => store.tripContainer.view)
    let totalDistance = 0;
    let seconds = 0;
    if (directions) {
        directions.routes[0].legs.forEach(leg => {
            totalDistance += leg.distance.value;
            seconds += leg.duration.value;
        })
    }
    var toTimeString = (seconds) => {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }
    var totalDuration = toTimeString(seconds)
    return (
        <>
            <Stack sx={styles.TripContainerBox}>
                {view !== 'create' &&
                    <Sidebar />
                }
                {view === 'loading' &&
                    <h1>loading...</h1>
                }
                {(view === 'trip' || view === 'business') &&
                    <TripSummary totalDistance={totalDistance} totalDuration={totalDuration} />
                }

                <Box sx={view === 'trip' ? null : styles.hide}>
                    <TripView direction={directions} />
                </Box>
                {businesses &&
                    <Box sx={view === 'business' ? { display: 'contents' } : styles.hide}>
                        <SearchBox panTo={panTo} getCustomBusinesses={getCustomBusinesses} />
                        <BusinessView
                            businesses={businesses}
                            setActiveMarker={setActiveMarker}
                            addToTrip={addToTrip}
                            removeFromTrip={removeFromTrip}
                        />
                    </Box>
                }
                {view === 'create' &&
                    <CreateView />
                }
            </Stack>
        </>
    )
}

const TripSummary = ({ totalDistance, totalDuration }) => {
    const title = useSelector((store) =>
        store.trip.title
    )

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
            <EditTitleModal setOpen={setEditTitleModal} />
        }

    </>)

}

const EditTitleModal = ({ setOpen }) => {
    const dispatch = useDispatch()
    const title = useSelector((store) =>
        store.trip.title
    )
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
                            dispatch(setTitle(name))
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
    TripContainerBox: {
        backgroundColor: 'white',
        height: '90%',
        borderRadius: '25px',
    },
    tripTitle: {
        backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/000/207/539/small_2x/Road_Trip_Sunset.jpg")`,
        height: '10vh',
        justifyContent: 'center',
        align: 'right',
        borderTopRightRadius: '25px',
        borderTopLeftRadius: '25px',
        // overflow: 'auto',
        minWidth: '500px',

    },
    hide: {
        display: 'none'
    },
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '400px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }
}