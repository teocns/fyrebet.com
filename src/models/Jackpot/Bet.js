import BaseModel from "../BaseModel";

import UserSocialBrief from "../UserSocialBrief";
import Bet from "../Bet";

/**
 * @typedef { Object } _JackpotRouletteBetObject
 * @property {string} jackpotRouletteRoundUUID
 *
 * @typedef {import("../Bet").BetObject & _JackpotRouletteBetObject} JackpotRouletteBetObject
 */

/**
 * @type { JackpotRouletteBetObject }
 */
export default class JackpotRouletteBet extends Bet {
  /**
   * @type {string}
   */
  jackpotRouletteRoundUUID;

  /**
   * @param {JackpotRouletteBetObject} obj
   */
  constructor(obj) {
    super(obj);
  }
}
