import { SearchOrigin, SearchDestination } from "./Places";
import { Backdrop, Button, Grid, Modal } from '@mui/material';


const ContainerStyle = {
    alignItems: 'center',
    bgcolor: 'background.paper',
    // border: '1px solid #000',
    boxShadow: 24,
    borderRadius: '12px',
    margin: 0,
};


export const FormView = () => {

    //TODO the plan trip button currently does nothing on click
    return (<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => console.log() }
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >

            <Grid container sx={ContainerStyle}>
                <Grid item xs={12} >
                    <SearchOrigin placeholder={"e.g. San Diego"} label="Origin" />
                </Grid>
                <Grid item xs={12} >
                    <SearchDestination placeholder={"e.g. Las Vegas"} label="Destination" />
                </Grid>
                <Grid item xs={12} sx={{textAlign:'right'}}>
                    <Button variant='contained' sx={{width:{xs: '100%', md:'auto'}}} >Plan Trip</Button>
                </Grid>
            </Grid>


        </Modal>
    </>)
}