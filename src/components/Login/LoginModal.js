import { Backdrop, Button, Grid, Modal, Stack, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import Axios from 'axios'



export const LoginModal = ({ setOpen, mode, setMode, setIsAuth }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirm, setPasswordConfirm] = useState(null)


    const [error, setError] = useState('none')

    const handleSubmit = (event) => {
        event.preventDefault();
        if (mode === 'signup') {
            handleSignup();
        }
        if (mode === 'login') {
            handleLogin();
        }

    }

    const handleLogin = () => {
        fetch(
            'http://localhost:5000/login', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            },

        }
        )
        .then(res => res.json())
        .then(response =>{
            console.log(response)
            verifyAuth()
        })
    }

    const verifyAuth = () => {
        fetch(
            'http://localhost:5000/login', {
            mode: 'cors',
            credentials: 'include',
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(response =>{
            console.log(response)
            if(response.loggedIn === true){
                setOpen(false)
                setIsAuth(response.loggedIn)
            }
        })
    }
    const handleSignup = () => {
        if (password !== passwordConfirm) {
            setError("passwordMismatch")
        }
        if (password === passwordConfirm) {
            fetch(
                'http://localhost:5000/signup', {
                mode: 'cors',
                credentials: 'include',
                method: "post",
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
                .then(res => res.json())
                .then(res => console.log(res))
        }
    }

    const logout = () => {
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
        .then(response =>{
            console.log(response)
        })
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
                    <Button variant="outlined" color="secondary" onClick={() => verifyAuth()}>Verify</Button>
                    <Button variant="outlined" color="secondary" onClick={() => logout()}>Logout</Button>

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