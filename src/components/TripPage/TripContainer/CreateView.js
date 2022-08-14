import { Button, Grid } from "@mui/material";
import { SearchOrigin, SearchDestination } from "./Places";


export const CreateView = () => {

    //TODO the plan trip button currently does nothing on click
    return (<>
            <Grid container >
                <Grid item xs={12} >
                    <SearchOrigin placeholder={"e.g. San Diego"} label="Origin" />
                </Grid>
                <Grid item xs={12} >
                    <SearchDestination placeholder={"e.g. Las Vegas"} label="Destination" />
                </Grid>
                <Grid item xs={12} sx={{textAlign:'right'}}>
                    <Button variant='contained' sx={{width:{xs: '100%', md:'auto'}}} >Create Trip</Button>
                </Grid>
            </Grid>

    </>)
}