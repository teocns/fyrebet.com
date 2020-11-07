import JackpotRouletteRound from "./Round";

/**
 * @typedef {Object} JackpotRouletteThreadObject
 * @property {number} threadId
 * @property {string} threadUUID
 * @property {boolean} isPublic
 * @property {string} createdByUserUUID
 * @property {number} createdTimestamp
 * @property {number} minBetUSD
 * @property {number} maxBetUSD
 * @property {number} playersCount
 * @property {number} drawTimestamp
 * @property {number} drawCountdownStartedTimestamp
 * @property {number} currentPotSize
 */

export default class JackpotRouletteThread {
  /**
   * @type {number}
   */
  threadId;
  /**
   * @type {string}
   */
  threadUUID;
  /**
   * Redundant variable exposing Draw's roll result.
   * @type {boolean}
   */
  isPublic;
  /**
   * @type {string}
   */
  createdByUserUUID;
  /**
   * Unix timestamp
   * @type {number}
   */
  createdTimestamp;

  /**
   * @type {number}
   */
  currentPotSize;
  /**
   * @type {number}
   */
  minBetUSD;
  /**
   * @type {number}
   */
  maxBetUSD;

  /**
   *
   * @type {number}
   */
  playersCount;

  /**
   * UNIX - Once the draw countdown started, the deadline will be here.
   * @type {number}
   */
  drawTimestamp;

  /**
   * @type {number} Suggests when the draw countdown started. Usually when two unilateral bets are placed.
   */
  drawCountdownStartedTimestamp;

  /**
   * @param {JackpotRouletteThreadObject} obj
   */
  constructor(obj) {
    this.playersCount = 0;
    this.rounds = [];
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
