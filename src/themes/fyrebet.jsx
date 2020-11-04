import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#BA111D",
      light: "#EF233C",
    },
    secondary: {
      main: "#2B2D42",
      light: "#8D99AE",
      dark: "#000000",
    },
    input: {
      comment: { background: "#F0F2F5" },
    },
  },

  typography: {
    fontSize: 14,
    fontFamily: ["Uni Sans", "Roboto"].join(", "),
  },
  overrides: {
    MuiTextField: {
      boxShadow: "none",
    },
  },
});

export default theme;
