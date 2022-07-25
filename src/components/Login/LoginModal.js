import { Backdrop, Button, Grid, Modal, Stack, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { login, signup } from "../../Features/userAuthSlice"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";





export const LoginModal = ({ setOpen, mode, setMode }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirm, setPasswordConfirm] = useState(null)
    const dispatch = useDispatch()
    const [error, setError] = useState('none')
    const isAuth = useSelector((store) =>
        store.userAuth.isAuth
    )
    useEffect(()=>{
        if(isAuth === true){
            setOpen(false)
        }
    },[isAuth])
    const handleSubmit = (event) => {
        event.preventDefault();
        if (mode === 'signup') {
            if (password !== passwordConfirm) {
                setError("passwordMismatch")
            } else {
                dispatch(signup({ email, password }))
            }
        }
        if (mode === 'login') {
            dispatch(login({ email, password }))
        }

    }



    return (<>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={() => { setOpen(false) }}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >

            <Grid container sx={styles.modalBox} spacing={1}>

                <form onSubmit={(event) => handleSubmit(event)}>

                    <Grid item xs={12}>
                        {mode === 'login' &&
                            <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: '25px' }}> Login</Typography>
                        }
                        {mode === 'signup' &&
                            <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: '25px' }}> Sign Up</Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}> Email</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField color="secondary" type='email' sx={styles.textField} id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}> Password</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField color="secondary" type="password" sx={styles.textField} id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Grid>

                    {mode === 'signup' &&
                        <>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Confirm Password</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField color="secondary" type="password" sx={styles.textField} id='password-confirm' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                            </Grid>
                        </>
                    }
                    <Grid item>
                        {mode === 'login' &&
                            <Stack direction='row' spacing={2}>
                                <Button type="submit" variant="contained" color="secondary" sx={{ padding: '0 30px' }}>Login</Button>
                                <Typography variant="subtitle2" sx={{ fontWeight: '600', paddingTop: '4px' }}> New User? </Typography>
                                <Button color="secondary" size='small' sx={{}} onClick={() => setMode("signup")}>Sign Up</Button>
                            </Stack>
                        }
                        {mode === 'signup' &&
                            <Stack direction='row' spacing={2}>
                                <Button type="submit" variant="contained" color="secondary" sx={{ padding: '0 30px' }}>Sign Up</Button>
                                <Typography variant="subtitle2" sx={{ fontWeight: '600', paddingTop: '4px' }}> Existing User? </Typography>
                                <Button color="secondary" size='small' sx={{}} onClick={() => setMode("login")}>Login</Button>
                            </Stack>
                        }
                    </Grid>
                </form>
            </Grid>

        </Modal>


    </>)
}

const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '600px',
        bgcolor: '#ffff',
        background: 'linear-gradient(to right bottom, #ffff 50%, rgba(255,240,230,1) 90%)',
        border: '2px solid #FF6701',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    },
    textField: {
        width: '100%',
        marginBottom: '20px'
    }
}