import UniSansThinItalic from "../../assets/fonts/Uni Sans Bold Italic.woff2";

const fontData = {
  fontFamily: "Uni Sans",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
        local('UniSans'),
        local('Raleway-Regular'),
        url(${UniSansThinItalic}) format('woff2')
    `,
};
