import { SearchDestination, SearchOrigin } from '../TripPage/TripView/Places';
import travelGlobeImage from '../../images/travelGlobe.png'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';

import { DayTripsSection } from './DayTrips/DayTripsSection'

import { css, keyframes } from '@emotion/react'
// import { setOrigin, setDestination } from './Features/tripSlice'
import { useLoadScript } from "@react-google-maps/api";
import { Link } from 'react-router-dom';
import { Navbar } from '../Navbar';


const styles = {
    paperContainer: {
        backgroundImage: `url(${travelGlobeImage})`,
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        backgroundSize: '800px',
        backgroundPosition: 'right 20%',
        margin: '25px',

    },
    placeSearchBox: {
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
        marginLeft: '20%',
        padding: '10px',
    },
    planTripButton: {
        width: '100%',
        backgroundColor: '#FFEF82',
        color: '#383838'
    },
    gridItem: {
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 14,
        borderRadius: '8px',
        margin: 0,
        minWidth: '200px'
    },
    header: {
        fontFamily: 'Roboto',
        fontWeight: 500,
    },
    main: {
        paddingTop: '12vh',
        marginLeft: '20%',
        marginRight: '20%'
    },
    intro: {
        maxWidth: 'md',
        marginBottom: '300px'
    }
}
const carouselTextStyles = {
    container: {
        width: '300px',
        height: '150px',
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '4px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: 'white'
    },
    box: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        marginTop: '-35px',

    },
    carousel: {
        width: "100%",
        height: '70px',
        textAlign: 'center',
        lineHeight: '45px'

    },
    hide: {
        width: '700px',
        height: '208px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        lineHeight: '208px',
        overflow: 'hidden',


    },
    slide: {
        animation: 'txt 7s ease-in-out infinite',
    },
    text: {
        fontSize: '40px'
    },
    "@keyframes txt": {
        "0%, 20%": {
            transform: "translateY(0)"
        },
        "25%, 45%": {
            transform: "translateY(-208px)"
        },
        "50%, 70%": {
            transform: "translateY(-416px)"
        },
        "75%, 95%": {
            transform: "translateY(-624px)"
        },
        "100%": {
            transform: "translateY(-832px)"
        }
    }
}

const libraries = ["places"]

export const Home = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })


    const spin = keyframes`
        0%, 20%:{
            transform: translateY(0)
        },
        25%, 45%:{
            transform: translateY(-208px)
        },
        50%, 70%:{
            transform: translateY(-416px)
        },
        75%, 95%:{
            transform: translateY(-624px)
        },
        100%:{
            transform: translateY(-832px)
        }
    `;

    const animated = css`
        animation: ${spin} 7s ease-in-out infinite 
    `

    if (!isLoaded) return <div> Loading...</div>
    return (<>
        <CssBaseline />
        <Navbar/>
        <Paper sx={styles.paperContainer}>
            <Box sx={styles.main} >
                <Box sx={styles.intro}>
                    <Typography sx={{ fontWeight: 800, paddingBottom: '25px' }} variant='h2'> Start your next road trip with RoadExplorer</Typography>
                    <Typography sx={{ fontWeight: 600, paddingBottom: '25px' }} variant='h5'> Explore the best attractions along the way!</Typography>
                    <Grid container>
                        <Grid item sx={styles.gridItem} sm={12} md={5}>
                            <SearchOrigin placeholder="Enter Origin" />
                        </Grid>
                        <Grid item sx={styles.gridItem} sm={12} md={5}>
                            <SearchDestination placeholder="Destination" />
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Button variant='contained' color='primary' sx={styles.planTripButton} >
                            {/* TODO: wait for tripid to return from mongodb, and then send use to '/trip/:tripId */}
                                <Link to="/trip"> Plan Trip </Link>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <DayTripsSection />
            </Box>
        </Paper>

            {/* <Box sx={carouselTextStyles.container}>
                <Box sx={carouselTextStyles.box}>
                    <Box sx={carouselTextStyles.carousel}>
                        <Box sx={carouselTextStyles.hide}>
                            <Box sx={carouselTextStyles.slide}>
                                <div css={css`animation: ${spin} 1s ease infinite;`}>
                                    <div>restaurants</div>
                                    <div>musuems</div>
                                    <div>landmarks</div>
                                    <div>parks</div>
                                </div>

                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box> */}


    </>)
}