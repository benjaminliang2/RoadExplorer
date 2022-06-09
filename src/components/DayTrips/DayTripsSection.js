import React from 'react'
import { DayTripCard } from './DayTripCard';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


export const DayTripsSection = () => {
    return (
        < >
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Typography variant='h5'> Discover Day Trips From... </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DayTripCard 
                            heading="Los Angeles, CA"
                            body='Experience everything that SoCal has to offer with these day trip from Los Angeles to stunning nearby beaches, wineries and small towns'
                            imageURL="https://www.travelinusa.us/wp-content/uploads/sites/3/2014/06/Dove-dormire-a-Los-Angeles.jpg"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DayTripCard 
                            heading="New York City, NY"
                            body='The best day trips from New York City will take you to beautiful locations, fun wineries, outstanding museums and more.'
                            imageURL="https://blog-www.pods.com/wp-content/uploads/2019/04/MG_1_1_New_York_City-1.jpg"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DayTripCard 
                            heading="Seattle, WA"
                            body='Explore the beauty and diversity of the Pacific Northwest with these day trips from Seattle'
                            imageURL="https://www.fodors.com/wp-content/uploads/2021/04/shutterstock_1711005940-1.jpg"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DayTripCard 
                            heading="Miami, FL"
                            body='Whether by boat, train or car, these fun day trips from Miami offer quick and easy getaways to exciting nearby spots'
                            imageURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYUUpK7jts9P-WfIpXULzUb1pPLSPkL9m1g&usqp=CAU"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
