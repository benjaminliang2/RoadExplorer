import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from "@mui/material";

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
})

export const Navbar = () => {

    return (
        <>
            <AppBar position="sticky">
                <StyledToolbar variant="dense" spacing={2}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="secondary"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FF6701' }}>
                        RoadExplorer
                    </Typography>
                    {/* <Link to="/plan"> Road Trip </Link> */}
                    <Button variant='contained' color='secondary'> Log In </Button>
                    <Button  variant='outlined'color='secondary'> Sign Up </Button> 
                </StyledToolbar>
            </AppBar>
        </>



    );
}