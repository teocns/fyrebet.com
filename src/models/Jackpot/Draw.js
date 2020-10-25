import BaseModel from "../BaseModel";

import UserSocialBrief from "../UserSocialBrief";

/**
 * @typedef {Object} JackpotRouletteDrawObject
 * @property {string} roundUUID
 * @property {number} roll
 * @property {number} executedAtTimestamp
 * @property {string} secret
 * @property {string} winnerUserUUID;
 */

/**
 * @type {JackpotRouletteDrawObject}
 */
export default class JackpotRouletteDraw extends BaseModel {
  roundUUID;
  roll;
  executedAtTimestamp;
  secret;
  /**
   * @type {UserSocialBrief}
   */
  winnerUserBrief;

  /**
   * @param {JackpotRouletteDrawObject} d
   */
  constructor(d) {
    super(d);
  }
}
