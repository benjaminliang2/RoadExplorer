import { Button, Grid } from "@mui/material";
import { SearchOrigin, SearchDestination } from "./Places";


export const CreateView = () => {

    //TODO the plan trip button currently does nothing on click
    return (<>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <SearchOrigin placeholder={"e.g. San Diego"} label="Search Origin" />
                </Grid>
                <Grid item xs={12} >
                    <SearchDestination placeholder={"e.g. Las Vegas"} label=" Search Destination" />
                </Grid>
            </Grid>

    </>)
}