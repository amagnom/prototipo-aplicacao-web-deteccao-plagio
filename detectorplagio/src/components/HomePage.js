import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Main from "./homepage/Main";



const theme = createTheme();

export default function HomePage() {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Main/>
            </ThemeProvider>
        </div>
    );
}
