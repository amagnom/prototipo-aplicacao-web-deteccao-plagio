import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Main from "./example/Main";
import AppBarPageDefault from "./navbar/AppBarPageDefault";


const theme = createTheme();

export default function ExamplePage() {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBarPageDefault/>
                <Main/>
            </ThemeProvider>
        </div>
    );
}
