import {createTheme} from "@mui/material/styles"

export const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginTop: "5px !important",
                    marginBottom: "5px !important",
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginTop: "5px !important",
                    marginBottom: "5px !important",
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    transform: "translate(14px, 7px) scale(1)"
                },
                shrink: {
                    transform: "translate(14px, -9px) scale(0.75)"
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    padding: "7px !important"
                }
            }
        }
    }
})