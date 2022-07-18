import { Backdrop, Button, Grid, Modal, Stack, TextField, Typography } from "@mui/material"


const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '75%',
        maxWidth: '600px',
        bgcolor: '#ffff',
        backgroundColor: 'white',
        border: '2px solid #FF6701',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    },
}

export const CustomModal = ({ setOpen, title, children }) => {

    return (<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Grid container sx={styles.modalBox} spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '25px' }}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12}>

                    {children}
                </Grid>
            </Grid>
        </Modal>

    </>)
}