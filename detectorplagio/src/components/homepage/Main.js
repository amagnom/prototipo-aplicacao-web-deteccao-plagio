import React, {Component} from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {Redirect} from 'react-router-dom';

import {
    Alert,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    NativeSelect
} from "@mui/material";
import axios from "axios";

import Loading from "./Loading"
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import ExplainMethod from "../example/images/exemplo_main_img.png";


//PopUp
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const style_image = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "30%",
    paddingTop: "5vh",
    paddingBottom: "5vh",
}

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // navbar:
            opacity_home: 1,
            opacity_example: 1,

            // popup:
            open_popup: false,
            open_popup_confirmation: false,
            email_error: false,
            email: "",
            type_analyse: "rapida",

            anchorEl: null,
            anchorOriginVertical: 'bottom',
            anchorOriginHorizontal: 'right',
            transformOriginVertical: 'top',
            transformOriginHorizontal: 'right',
            anchorReference: 'anchorEl',

            // main:
            file: true,
            result_calc: Array,
            is_result_page_visible: false,
            file_upload_state: "",
            loading: false,
            error_message_number_files: false,
            error_message_type_files: false,
            error_message_name_files: false,
            error_process_files: false,
            error_size_files: false,
            percentage: 0

        };


        this.inputReference = React.createRef();

        this.calculate_similarity = this.calculate_similarity.bind(this);
        this.handleClickOpenMenu = this.handleClickOpenMenu.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.handleClickOpenPopUp = this.handleClickOpenPopUp.bind(this);
        this.handleClosePopUp = this.handleClosePopUp.bind(this);
        this.handleClickOpenPopUpConfirmation = this.handleClickOpenPopUpConfirmation.bind(this);
        this.handleClosePopUpConfirmation = this.handleClosePopUpConfirmation.bind(this);

    }

    // popup:
    handleClickOpenPopUp() {
        this.setState({open_popup: true})
    }

    handleClosePopUp() {
        this.setState({open_popup: false, email: "", type_analyse: "rapida"})
    }


    handleClickOpenPopUpConfirmation() {
        this.setState({open_popup_confirmation: true})
    }

    handleClosePopUpConfirmation() {
        this.setState({open_popup_confirmation: false})
    }

    // navbar:
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

    handleClickOpenMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };


    handleCloseMenu = () => {
        this.setState({anchorEl: null});
    };


    file_upload_action = () => {
        this.inputReference.current.click();
    }


    handle_click = async (event) => {
        event.preventDefault();
        let id_analyse = ""
        try {
            const newArr = event.target.files;
            await Promise.all(newArr).then((values) => {
                const data = new FormData()

                for (let i = 0; i < values.length; i++) {
                    let locale = "file"
                    data.append(locale, values[i])
                }
                return data
            }).then((values_data) => {
                let validate = this.validate_files(newArr)
                if (validate) {
                    id_analyse = "id_analyse".concat((Math.floor(Math.random() * 9999)).toString())
                    values_data.append("id_analyse", id_analyse)
                    values_data.append("len_files", newArr.length)
                    values_data.append("type_analyse", this.state.type_analyse)
                    values_data.append("email", this.state.email)
                    this.calculate_similarity(values_data)
                }
            });
        } catch (error) {
            this.clean_files(id_analyse)
            this.error_occurred()
            if (this.state.email) {
                this.generate_pdf_email_error(this.state.email)
            }

        }
    };

    show_result_page(result) {
        this.setState({
            is_result_page_visible: true,
            result_calc: result
        });
    }

    validate_files(files) {
        let validate = true

        if (files.length <= 1) {
            validate = false
            this.setState({error_message_number_files: true, open_popup: false, open_popup_confirmation: false})
        }


        let size_total_files = 0
        for (let i = 0; i < files.length; i++) {
            if (i + 1 < files.length) {
                let file1 = files[i].name.split('.')
                let file2 = files[i + 1].name.split('.')
                let fileName1 = file1[0]
                let fileName2 = file2[0]
                let fileExt = file1[1]

                if (fileExt !== 'pdf' && fileExt !== 'txt' && fileExt !== 'docx') {
                    validate = false
                    this.setState({error_message_type_files: true, open_popup: false, open_popup_confirmation: false});
                }

                if (fileName1 === fileName2) {
                    validate = false
                    this.setState({error_message_name_files: true, open_popup: false, open_popup_confirmation: false});
                }
            }

            size_total_files += files[i].size


        }

        //50MB->bytes
        if (size_total_files > 50000000) {
            validate = false
            this.setState({error_size_files: true, open_popup: false, open_popup_confirmation: false})
        }


        return validate
    }

    clean_files(id_analyse) {
        // Local:
        // let location = "http://127.0.0.1:8000/api/clean-files"
        // Remoto:
        let location = "/api/clean-files"
        axios.post(location, id_analyse)
    }

    generate_pdf_email_error(email) {
        let data_email = []
        data_email.push({"email": email})
        // Local:
        // let location = "http://127.0.0.1:8000/api/clean-files"
        // let location2 = "http://127.0.0.1:8000/api/generate-pdf-error"
        // Remoto:
        let location = "/api/clean-files"
        let location2 = "/api/generate-pdf-error"
        axios.post(location)
        axios.post(location2, data_email)
    }

    calculate_similarity(data) {
        this.setState({
            loading: true,
            error_message_number_files: false,
            error_message_type_files: false,
            error_message_name_files: false,
            error_size_files: false
        })
        // Local:
        // let location = "http://127.0.0.1:8000/api/calculate-similarity"
        // Remoto:
        let location = "/api/calculate-similarity"
        axios.post(location, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                    if (typeof response.data === 'object' && response.data !== null) {
                        this.setState({percentage: 100})
                        setTimeout(
                            () => this.show_result_page(response.data),
                            2000
                        );


                    } else {
                        this.setState({percentage: (response.data.toFixed(2) * 100)})
                        data.delete('file');
                        setTimeout(
                            () => this.calculate_similarity(data),
                            5000
                        );
                    }
                }
            )
            .catch(error => {
                this.error_occurred()
            })


    }

    error_occurred() {
        if (this.state.error_process_files === false) {
            this.setState({
                error_process_files: true,
                loading: false,
                open_popup: false,
                open_popup_confirmation: false
            })
        }
    }

    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    handle_change_email_validate = event => {
        this.setState({email: event.target.value})

        if (!this.isValidEmail(event.target.value)) {
            this.setState({email_error: true})
        } else {
            this.setState({email_error: false})
        }


    }

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);


        return (

            <main>
                {/*NAVBAR*/}
                <AppBar position="static" style={{background: '#75C3DC'}}>

                    <Toolbar disableGutters style={{paddingLeft: "5vw", paddingRight: "5vw"}}>
                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                onClick={this.handleClickOpenMenu}
                            >
                                <MenuIcon/>
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                transformOrigin={{vertical: "top", horizontal: "center"}}
                                open={open}
                                onClose={this.handleCloseMenu}
                            >

                                <MenuItem
                                    href="/"
                                    component="a"
                                    style={{width: "100%"}}
                                    onClick={this.handleCloseMenu}
                                > home </MenuItem> <br/>

                                <MenuItem
                                    href="/examples"
                                    component="a"
                                    style={{width: "100%"}}
                                    onClick={this.handleCloseMenu}
                                > exemplos </MenuItem> <br/>


                                <MenuItem
                                    href="#/"
                                    component="a"
                                    style={{width: "100%"}}
                                    onClick={this.handleClickOpenPopUp}
                                > analisar </MenuItem> <br/>

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

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#/"
                            onClick={() => this.handleClickOpenPopUp()}
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'white',
                                textDecoration: 'none',
                                padding: 1.5,
                                backgroundColor: "#353839",
                                borderRadius: '2vw'
                            }}
                        >
                            Analisar Arquivos
                        </Typography>


                    </Toolbar>

                </AppBar>

                <Container style={{paddingTop: "2vh"}}>
                    {this.state.error_process_files &&
                        <Alert severity="error">Ocorreu um erro ao processar seus arquivos, tente novamente!</Alert>
                    }

                    {this.state.error_message_number_files &&
                        <Alert severity="warning">Envie mais de um arquivo!</Alert>
                    }
                    {this.state.error_message_type_files &&
                        <Alert severity="warning">Tipos de arquivos aceitos: txt, pdf, docx!</Alert>}
                    {this.state.error_message_name_files &&
                        <Alert severity="warning">Envie arquivos com nomes distintos!</Alert>}

                    {this.state.error_size_files &&
                        <Alert severity="warning">Tamanho total dos arquivos não deve ultrapassar 50MB!</Alert>}


                </Container>


                {this.state.loading ?
                    <div align={"center"}>
                        <Loading percentage={this.state.percentage}/>
                    </div>
                    :


                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >


                        <Container>


                            <Dialog open={this.state.open_popup} onClose={() => this.handleClosePopUp()}>
                                <DialogContent>
                                    <DialogContentText textAlign={"justify"}>
                                        Informe abaixo o <b>email</b> e o <b>tipo de análise</b> que deseja executar.
                                        O resultado será exibido em sua tela, bem como um relátorio será enviado
                                        a seu email, caso não informe o email, nada será enviado, apenas exibido.
                                    </DialogContentText>

                                    <TextField
                                        error={this.state.email_error}
                                        autoFocus
                                        margin="dense"
                                        id="email"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                        style={{marginTop: "2vh"}}
                                        onChange={this.handle_change_email_validate}
                                    />


                                    <FormControl style={{paddingTop: "3vh"}}
                                                 onChange={e => this.setState({type_analyse: e.target.value})}>
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native"
                                                    style={{paddingTop: "4vh"}}>
                                            Tipo de Análise
                                        </InputLabel>
                                        <NativeSelect
                                        >
                                            <option value={"rapida"}>Rápida</option>
                                            <option value={"profunda"}>Profunda</option>
                                        </NativeSelect>
                                    </FormControl>

                                </DialogContent>
                                <DialogActions>

                                    <Button
                                        size={"medium"}
                                        sx={{
                                            margin: "2vw"
                                        }}
                                        onClick={() => this.handleClosePopUp()}> Cancelar
                                    </Button>
                                    <Button
                                        size={"large"}
                                        style={{margin: "2vw"}}
                                        disabled={this.state.email_error}
                                        onClick={() => this.handleClickOpenPopUpConfirmation()}> <b>Confirmar</b>
                                    </Button>


                                </DialogActions>
                            </Dialog>


                            <Dialog open={this.state.open_popup_confirmation}
                                    onClose={() => this.handleClosePopUpConfirmation()}>
                                <DialogContent>

                                    <DialogTitle align={"center"}>
                                        Você tem certeza?
                                    </DialogTitle>

                                    <b>email:</b>
                                    {this.state.email !== "" ?
                                        " ".concat(this.state.email)
                                        : " nenhum informado"}

                                    <br/><b>tipo de análise:</b>
                                    {this.state.type_analyse === "rapida" ?
                                        " rápida"
                                        : " profunda"}


                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        size={"medium"}
                                        style={{margin: "2vw"}}
                                        onClick={() => this.handleClosePopUpConfirmation()}>Cancelar
                                    </Button>
                                    <Button
                                        size={"large"}
                                        style={{margin: "2vw"}}
                                        onClick={() => this.file_upload_action()}> <b>Enviar Arquivos</b>
                                    </Button>
                                </DialogActions>
                            </Dialog>


                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                                sx={{

                                    fontFamily: 'chivo',

                                }}
                            >
                                Detector de Plágio
                            </Typography>


                            <Typography
                                variant="h6"
                                align="center"
                                color="text.secondary"
                                sx={{

                                    fontFamily: 'lato',

                                }}
                            >
                                Detectamos o plágio até mesmo quando há troca
                                das palavras por sinônimos.
                            </Typography>

                            <div>

                                <img src={ExplainMethod} alt="Ilustração do Processo" style={style_image}/>

                            </div>


                            <Typography
                                component="h4"
                                variant="h5"
                                align="center"
                                color="text.primary"
                                gutterBottom
                                sx={{

                                    fontFamily: 'chivo',

                                }}
                            >
                                Clique em <b>Analisar Arquivos</b> para verificar seus documentos.
                            </Typography>


                            <Stack
                                sx={{pt: 4}}
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                            >


                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    multiple
                                    hidden
                                    ref={this.inputReference}
                                    onChange={this.handle_click}/>

                            </Stack>


                        </Container>
                    </Box>
                }


                {this.state.is_result_page_visible ?
                    <Redirect push to={{
                        pathname: '/result',
                        state: this.state.result_calc
                    }}
                    />
                    : null}

            </main>

        );
    }
}
