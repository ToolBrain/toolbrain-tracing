import { createTheme } from "@mui/material";

export const createAppTheme = (themeMode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === "dark" ? "#ececec" : "#1976d2",
      },
      ...(themeMode === "dark" && {
        background: {
          default: "#2b2b2bff",
          paper: "#3a3a3aff",
        },
        text: {
          primary: "#ececec",
          secondary: "#b4b4b4",
        },
      }),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  });
};
