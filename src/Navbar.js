import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from "@mui/material";
import { useState } from "react";
import ReactDOM from 'react-dom';
import { LoginModal } from "./components/Login/LoginModal";


const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
})

export const Navbar = () => {

    const [loginModal, setLoginModal] = useState(false)
    const [mode, setMode] = useState(null)

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