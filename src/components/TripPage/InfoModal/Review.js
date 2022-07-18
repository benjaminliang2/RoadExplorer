import { Avatar, Grid, Typography } from '@mui/material';

export const Review = ({ review }) => {
    const { user, rating, text, image_url } = review;
    return (<>
        <Grid container marginTop={2.7}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Avatar src={image_url} />
                </Grid>
                <Grid item>
                    <Typography>{user.name} , {rating}</Typography>
                </Grid>
            </Grid>
            <Grid item mt={1} >
                <Typography>"{text}"</Typography>
            </Grid>
        </Grid>

    </>)
}