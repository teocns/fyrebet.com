import BaseModel from "../BaseModel";
import JackpotRouletteBet from "./Bet";
import JackpotRouletteDraw from "./Draw";

/**
 * @typedef {Object} JackpotRouletteRoundObject
 * @property {string} roundUUID
 * @property {boolean} isDrawn
 * @property {number} roll
 * @property {number} drawTimestamp
 * @property {number} createdTimestamp
 * @property {string} hashedSecret
 */

/**
 * @type {JackpotRouletteRoundObject}
 */
export default class JackpotRouletteRound extends BaseModel {
  /**
   * @property {string}
   */
  roundUUID;
  /**
   * @property {boolean}
   */
  isDrawn;
  /**
   * @property {number}
   */
  roll;
  /**
   * @property {number}
   */
  drawTimestamp;
  /**
   * @property {number}
   */
  createdTimestamp;
  /**
   * @property {string}
   */
  hashedSecret;
  /**
   * Place bets. Only a stack of last 50 will be kept for performance reasons
   * @type {JackpotRouletteBet[]}
   */
  bets;
  /**
   * @param {JackpotRouletteRoundObject} d
   */
  constructor(d) {
    super(d);

    if (!Array.isArray(this.bets)) {
      this.bets = [];
    }
  }

  /**
   * @param {JackpotRouletteDraw} draw
   */
  assignDraw(draw) {
    this.roll = draw.roll;
    this.isDrawn = true;
  }
}
