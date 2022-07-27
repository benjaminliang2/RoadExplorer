import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Leg } from './Leg'
import { SearchOrigin, SearchDestination } from '../Places';
import { useTrip } from '../../useTrip';

import { Backdrop, Box, Button, Modal, Stack } from "@mui/material"

export const TripView = ({directions}) => {
    const {removeFromTrip} = useTrip()
    const start = useSelector((store) =>
        store.trip.origin
    )
    const end = useSelector((store) =>
        store.trip.destination
    )
    const waypoints = useSelector((store) =>
        store.trip.waypoints
    )
    const [editOrigin, setEditOrigin] = useState(false)
    const [editDestination, setEditDestination] = useState(false)
    return (<>
        <Leg name={start.name} directions={directions} index={0} setEdit={setEditOrigin} />
        {waypoints?.map((waypoint, index) =>
            <Leg name={waypoint.name} imgURL={waypoint.image_url} directions={directions} index={index + 1} removeFromTrip={removeFromTrip} id={waypoint.id} />
        )}
        <Leg name={end.name} setEdit={setEditDestination} />

        {editOrigin &&
            ReactDOM.createPortal(
                <>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={true}
                        onClose={() => { setEditOrigin(false) }}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Box sx={styles.modalBox}>
                            <Stack direction='row' justifyContent='flex-end'>
                                <Button
                                    variant="text"
                                    color='secondary'
                                    onClick={() => setEditOrigin(false)}
                                >
                                    Back
                                </Button>
                            </Stack>
                            <SearchOrigin label="Enter New Origin" />
                        </Box>

                    </Modal>

                </>
                , document.getElementById("portal"))
        }
        {editDestination &&
            ReactDOM.createPortal(
                <>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={true}
                        onClose={() => { setEditDestination(false) }}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Box sx={styles.modalBox}>
                            <Stack direction='row' justifyContent='flex-end'>
                                <Button
                                    variant="text"
                                    color='secondary'
                                    onClick={() => setEditDestination(false)}
                                >
                                    Back
                                </Button>
                            </Stack>
                            <SearchDestination label="Enter New Destination" />
                        </Box>

                    </Modal>

                </>
                , document.getElementById("portal"))
        }
    </>)
}

const styles = {
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