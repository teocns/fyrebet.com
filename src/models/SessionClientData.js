// Data sent from client to server socket on initial handshake

import Langs from "../constants/Langs";

/**
 * @typedef {SessionClientDataObject}
 * @property {string} authenticationToken
 * @property {string} language
 * @property {Array} languages
 * @property {string} userAgent
 */

class ClientData {
  /**
   * @type {string}
   */
  authenticationToken;
  /**
   * @type {string}
   */
  language;
  /**
   * @type {string[]}
   */
  languages;
  /**
   * @type {string}
   */
  userAgent;
  constructor(clientDataRaw) {
    clientDataRaw = typeof clientDataRaw === "object" ? clientDataRaw : {};
    const { language, languages, userAgent } = clientDataRaw;
    this.language = language;
    this.languages = languages;
    this.userAgent = userAgent;
  }
  isValid() {
    if (typeof this.language !== "string") {
      this.language = "EN";
    }

    this.language = this.language in Object.keys(Langs) || "EN";
    return true;
  }
}

export default ClientData;
