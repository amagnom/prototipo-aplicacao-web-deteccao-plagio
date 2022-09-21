import React, {Component} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export default class Footer extends Component {

    render() {
        return (
            <Box sx={{bgcolor: 'background.paper', p: 2}} component="footer">

                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Todos direitos reservados
                </Typography>
            </Box>


        );
    }
}
