import React, {Component} from "react";
import AppBarPageDefault from "./navbar/AppBarPageDefault";
import Grid from '@mui/material/Grid';
import {createTheme} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import Graph from "./resultpage/Graph";
import Typography from "@mui/material/Typography";


createTheme();


export default class ResultPage extends Component {
    constructor(props) {
        super(props);


        this.state = {
            result_sentences: Array,
            document_name: "",
            is_details_page_visible: false,
            result_analyse: Array
        };
        this.on_button_click = this.on_button_click.bind(this);
        this.generate_pdf = this.generate_pdf.bind(this);
        this.handle_submit = this.handle_submit.bind(this);
    }

    componentDidMount() {
        this.setState({result_analyse: this.props.location.state})
    }

    on_button_click(result, name) {
        this.setState({
            result_sentences: result,
            document_name: name,
            is_details_page_visible: true,
        });
    }

    async handle_submit() {
        this.generate_pdf(this.state.result_analyse);
    }

    generate_pdf(result) {
         // Local:
         // let location = "http://127.0.0.1:8000/api/generate-pdf"
        // Remoto:
        let location = "/api/generate-pdf"
        axios({
            url: location, //your url
            method: 'POST',
            responseType: 'blob',// important
            data: result,
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'relatorio.zip');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }


    render() {
        return (
            <div>
                <CssBaseline/>
                <AppBarPageDefault/>


                <Grid container>


                    <Graph datafiles={this.props.location.state}/>


                    <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}></Grid>


                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#/"

                        onClick={() => this.handle_submit()}
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'white',
                            textDecoration: 'none',
                            backgroundColor: "#353839",
                            borderRadius: '2vw',
                            padding: "18px 36px",
                            alignContent: "center",
                            margin: "0 auto"
                        }}
                    >
                        Gerar Relatorio
                    </Typography>


                </Grid>

            </div>

        )

    }
}


