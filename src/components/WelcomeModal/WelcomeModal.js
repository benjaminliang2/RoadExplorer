import { useState, useEffect } from 'react';
import { SearchTextField } from "../TripView/Places";
import ReactDOM from 'react-dom';
import { Backdrop, Box, Button, Modal } from '@mui/material';
import { setOrigin, setDestination } from '../../Slices/originDestinationSlice'
import { useSelector } from "react-redux";



const ContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: '12px',
    margin: 0,
};


export const WelcomeModal = ({ setShow }) => {
    const [open, setOpen] = useState(true)
    const handleClose = () => {
        if (start && end){
            setOpen(false)
        }
        setShow(false)

    }
    const start = useSelector((randomname) =>
        randomname.originDestination.origin
    )
    const end = useSelector((configureStore) =>
        configureStore.originDestination.destination
    )
    return ReactDOM.createPortal(<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => { handleClose() }}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Box sx={ContainerStyle} >
                <SearchTextField setPlace={setOrigin} placeholder={start.name || "e.g. San Diego"} label="Origin" />
                <SearchTextField setPlace={setDestination} placeholder={end.name || "e.g. Las Vegas"} label="Destination" />
                <Button variant='contained' onClick={() => handleClose()}>Plan Trip</Button>
            </Box>

        </Modal>
    </>, document.getElementById("portal"))
}