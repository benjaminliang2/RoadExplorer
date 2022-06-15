import { useState } from "react";
import { Leg } from "./Leg"
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector } from "react-redux";
import { Box, Container, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


import { configureStore } from "@reduxjs/toolkit";
import { SearchBox } from "./Places";
import { Businesses } from "./BusinessesView/businesses";

export const TripView = (props) => {
    const { waypoints, directions, removeFromTrip, setShowModal,
        businesses, addToTrip, setSearchCategory, setActiveMarker, panTo, getCustomResults, showTripDetails, setShowTripDetails, showSearch } = props;

    const start = useSelector((randomname) =>
        randomname.originDestination.origin
    )
    const end = useSelector((configureStore) =>
        configureStore.originDestination.destination
    )



    let totalDistance = 0;
    let seconds = 0;
    directions.routes[0].legs.forEach(leg => {
        totalDistance += leg.distance.value;
        seconds += leg.duration.value;
    })
    var toTimeString = (seconds) => {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }
    var totalDuration = toTimeString(seconds)

    return (
        <>
            <Stack >
                <TripSummary setShowModal={setShowModal} totalDistance={totalDistance} totalDuration={totalDuration} />

                <Box sx={showSearch ? null : styles.show}>
                    <SearchBox panTo={panTo} getCustomResults={getCustomResults} setShowTripDetails={setShowTripDetails} />
                </Box>

                <Box sx={showTripDetails ? null : styles.show}>
                    <Leg name={start.name} directions={directions} index={0} />
                    {waypoints?.map((waypoint, index) =>
                        <Leg name={waypoint.name} imgURL={waypoint.imgURL} directions={directions} index={index + 1} removeFromTrip={removeFromTrip} id={waypoint.yelp_id} />
                    )}
                    <Leg name={end.name} />
                </Box>
                {businesses &&
                    <Box sx={!showTripDetails ? null : styles.show}>
                        <Businesses
                            hikes={businesses}
                            addToTrip={addToTrip}
                            setSearchCategory={setSearchCategory}
                            setActiveMarker={setActiveMarker}
                            panTo={panTo}
                            getCustomResults={getCustomResults}
                        />
                    </Box>
                }
            </Stack>
        </>



    )
}

const TripSummary = ({ setShowModal, totalDistance, totalDuration }) => {

    const originTemp = useSelector((randomname) =>
        randomname.originDestination.origin.name
    )
    const destinationTemp = useSelector((configureStore) =>
        configureStore.originDestination.destination.name
    )
    let origin = originTemp.substr(0, originTemp.indexOf(','))
    let destination = destinationTemp.substr(0, destinationTemp.indexOf(','))


    return (<>
        <Stack>
            <Box sx={styles.tripTitle} component={Stack}>
                {/* insert background photo  */}
                <Typography variant="h5" align='center'>{destination} Trip</Typography>
            </Box>

            {/* <Box>
                <IconButton color="primary" aria-label="Edit Trip"
                    onClick={() => {
                        console.log("edit trip")
                        setShowModal(true)
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Box> */}
            <Stack direction="row" spacing={1} justifyContent='space-between'>
                <Box>
                    <Typography>Summary</Typography>
                </Box>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>

                    <Box>
                        <Typography sx={{ verticalAlign: 'middle', display: 'inline-flex' }}><DirectionsCarIcon /> {Math.round(totalDistance * 0.000621371192 * 10) / 10} Miles</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ verticalAlign: 'middle', display: 'inline-flex' }}><AccessTimeIcon /> {totalDuration}</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    </>)

}

const styles = {
    tripTitle: {
        backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/000/207/539/small_2x/Road_Trip_Sunset.jpg")`,
        height: '10vh',
        justifyContent: 'center',
        align: 'right',
    },
    show: {
        display: 'none'
    }
}