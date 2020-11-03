import Bet from "../Bet";

import Errors from "../../constants/errors";

/**
 * @typedef { Object } _JackpotRouletteBetObject
 * @property {string} roundUUID
 * @property {string} threadUUID
 *
 * @typedef {import("../Bet").BetObject & _JackpotRouletteBetObject} JackpotRouletteBetObject
 */

export default class JackpotRouletteBet extends Bet {
  /**
   * @type {string}
   */
  roundUUID;
  /**
   * @type {string}
   */
  threadUUID;

  /**
   * @type {number}
   */
  userId;

  /**
   * @param {JackpotRouletteBetObject} obj
   */
  constructor(obj) {
    super(obj);
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }

  /**
   * @returns {boolean}
   * @throws {ErrorCode}
   */
  validate() {
    const ret = super.validate();
    // threadUUID is an UUID so it must be length 36.
    if (typeof this.threadUUID !== "string" || this.length !== 36) {
      throw Errors.ERR_BETS_CLOSED;
    }
    return ret;
  }
}
