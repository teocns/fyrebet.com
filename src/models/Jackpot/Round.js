import JackpotRouletteBet from "./Bet";
import JackpotRouletteDraw from "./Draw";

/**
 * @typedef {Object} JackpotRouletteRoundObject
 * @property {string} roundId
 * @property {string} roundUUID
 * @property {boolean} isDrawn
 * @property {number} roll
 * @property {number} drawTimestamp
 * @property {number} createdTimestamp
 * @property {string} hashedSecret
 */

export default class JackpotRouletteRound {
  /**
   * @type {string}
   */
  roundId;
  /**
   * @type {string}
   */
  roundUUID;

  /**
   * @type {string}
   */
  threadUUID;
  /**
   * @type {boolean}
   */
  isDrawn;
  /**
   * Redundant variable exposing Draw's roll result.
   * @type {number}
   */
  roll;
  /**
   * @type {number}
   */
  drawTimestamp;
  /**
   * @type {number}
   */
  createdTimestamp;
  /**
   * @type {string}
   */
  hashedSecret;
  /**
   * @type {string}
   */
  secret;
  /**
   * Place bets. Only a stack of last 50 will be kept for performance reasons
   * @type {JackpotRouletteBet[]}
   */
  bets;
  /**
   * @type {number}
   */
  potSize;

  /**
   *
   * @type {JackpotRouletteDraw}
   */
  draw;

  /**
   * Number of bets coming from different users (suppressing excess bets placed by same user)
   * @type {number}
   */
  unilateralBetsAmount;

  /**
   * @param {JackpotRouletteDraw} draw
   */
  assignDraw(draw) {
    this.roll = draw.roll;
    this.isDrawn = true;
  }

  /**
   * @returns {boolean}
   */
  hasBetsOpen() {
    // For now, we only allow users to bets if the game has not yet drawn
    return !this.isDrawn;
  }

  hasDrawCountdownStarted() {
    return this.drawTimestamp === undefined;
  }
  /**
   * @param {JackpotRouletteBet} bet
   */
  storeBet(bet) {
    // If it's the first time the user places a bet, increase unilateral bets amount
    let userAlreadyPlacedBet = false;
    for (let i = 0; i < this.bets.length; i++) {
      if (this.bets[i].userId === bet.userId) {
        userAlreadyPlacedBet = true;
      }
    }
    if (false === userAlreadyPlacedBet) {
      this.unilateralBetsAmount++;
    }
    this.bets.push(bet);
    this.potSize += bet.getUsdAmount();
  }

  /**
   * @param {JackpotRouletteRoundObject} d
   */
  constructor(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }

    this.unilateralBetsAmount = 0;
    this.potSize = this.potSize || 0;
    if (!Array.isArray(this.bets)) {
      this.bets = [];
    }
  }
}
