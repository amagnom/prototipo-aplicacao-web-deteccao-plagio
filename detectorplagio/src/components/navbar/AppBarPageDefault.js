import React, {Component} from "react";
import Toolbar from "@mui/material/Toolbar";
import AppBar from '@mui/material/AppBar';
import Typography from "@mui/material/Typography";
import {Menu, MenuItem} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@mui/icons-material/Menu';

export default class AppBarPageDefault extends Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity_home: 1,
            opacity_example: 1,

            anchorEl: null,
            anchorOriginVertical: 'bottom',
            anchorOriginHorizontal: 'right',
            transformOriginVertical: 'top',
            transformOriginHorizontal: 'right',
            anchorReference: 'anchorEl',

        };
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }


    mouse_hover_color_home() {

        this.setState({opacity_home: 0.7})

    }

    mouse_leave_color_home() {

        this.setState({opacity_home: 1})

    }

    mouse_hover_color_example() {

        this.setState({opacity_example: 0.7})

    }

    mouse_leave_color_example() {

        this.setState({opacity_example: 1})

    }

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };


    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (

            <AppBar position="static" style={{background: '#75C3DC'}}>

                <Toolbar disableGutters style={{paddingLeft: "5vw", paddingRight: "5vw"}}>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            onClick={this.handleMenu}
                        >
                            <MenuIcon/>
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                            transformOrigin={{vertical: "top", horizontal: "center"}}
                            open={open}
                            onClose={this.handleClose}
                        >

                            <MenuItem
                                href="/"
                                component="a"
                                style={{width: "100%"}}
                                onClick={this.handleClose}
                            > home </MenuItem> <br/>

                            <MenuItem
                                href="/examples"
                                component="a"
                                style={{width: "100%"}}
                                onClick={this.handleClose}
                            > exemplos </MenuItem> <br/>

                        </Menu>

                    </Box>


                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        onMouseEnter={() => this.mouse_hover_color_home()}
                        onMouseLeave={() => this.mouse_leave_color_home()}
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'roboto',
                            color: 'white',
                            textDecoration: 'none',
                            opacity: this.state.opacity_home,

                        }}
                    >
                        Home
                    </Typography>


                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/examples"
                        onMouseEnter={() => this.mouse_hover_color_example()}
                        onMouseLeave={() => this.mouse_leave_color_example()}
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'roboto',
                            color: 'white',
                            textDecoration: 'none',
                            opacity: this.state.opacity_example,
                            flexGrow: 1
                        }}
                    >
                        Exemplos
                    </Typography>


                </Toolbar>

            </AppBar>


        );
    }
}
