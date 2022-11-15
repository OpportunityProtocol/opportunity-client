import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#b8e0d0",
      main: "#49A882",
      dark: "#1b4f31",
    },
    text: {
      primary: "rgba(33, 33, 33, .85)",
      //secondary: "rgba(33, 33, 33, .85)",
    },
    secondary: {
      main: "#212121",

    },
    divider: "#ddd",
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "inherit",
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        indicatorColor: "secondary",
      },
      styleOverrides: {
        root: {
          border: "none !important",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        button: {
          ":hover": {
            cursor: "pointer",
          },
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          fontWeight: '600',
          fontSize: 13,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          border: "1px solid #ddd",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        contained: {
          color: "#fff",
        },
        text: {
          ":hover": {
            color: "#49A882",
          },
          fontWeight: "bold",
          backgroundColor: "transparent",
        },
        outlined: {
          fontSize: 12,
          fontWeight: "bold",
          backgroundColor: "transparent",
          borderRadius: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F5', 
          border: '1px solid #eee'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          border: `2px ${alpha('rgb(98, 202, 161)', .6)} solid`,
          fontWeight: 'regular'
        }
      }
    }
  },
});

export default createTheme(theme);
