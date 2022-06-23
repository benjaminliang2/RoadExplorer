import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#ffff",
            light: "skyblue",
            contrastText: '#FF6701'
        },
        secondary: {
            main: '#FF6701'
        },
        otherColor: {
            main: "#999"
        }
    },
    typography: {
        allVariants:{
            color: '#4B5D67'
        },
        fontFamily: [
            'Inter',
        ].join(','),
    }
});

