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
   * @type {number}
   */
  drawTimestamp;

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
