import KeyMirror from "keymirror";

export const ChatPublicRooms = {
  EN: {
    shortCode: "EN",
    language: "English",
    lang: "en_US",
    flagAsset: require("../assets/flags/united-states-of-america.svg"),
  },
  IT: {
    shortCode: "IT",
    language: "Italian",
    lang: "it",
    flagAsset: require("../assets/flags/italy.svg"),
  },
  RU: {
    shortCode: "RU",
    language: "Russian",
    lang: "ru",
    flagAsset: require("../assets/flags/russia.svg"),
  },
  DE: {
    shortCode: "DE",
    language: "German",
    lang: "de",
    flagAsset: require("../assets/flags/germany.svg"),
  },
  RO: {
    shortCode: "RO",
    language: "Romanian",
    lang: "ro",
    flagAsset: require("../assets/flags/romania.svg"),
  },
};

export const Types = KeyMirror({
  PRIVATE: null,
  PUBLIC: null,
  GROUP: null,
});
