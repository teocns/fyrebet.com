import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";

const GilroyBoldWoff = require("./fonts/Gilroy Bold/Gilroy-Regular.woff");

const GilroyBold = {
  fontFamily: "GilroyBold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('GilroyBold'),
    local('GilroyBold-Regular'),
    url(${GilroyBoldWoff}) format('woff')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};
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
  },
  overrides: {
    MuiTextField: {
      boxShadow: "none",
    },
    // MuiCssBaseline: {
    //   "@global": {
    //     "@font-face": [GilroyBold],
    //   },
    // },
  },
});

export default theme;
