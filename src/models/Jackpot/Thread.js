import JackpotRouletteRound from "./Round";

/**
 * @typedef {Object} JackpotRouletteThreadObject
 * @property {number} threadId
 * @property {string} threadUUID
 * @property {boolean} isPublic
 * @property {number} createdByUser
 * @property {number} createdTimestamp
 * @property {number} minBetUSD
 * @property {number} maxBetUSD
 * @property {chatRoomUUID} chatRoomUUID
 * @property {number} minUserEntriesToStartRound
 * @property {number} roundStartToDrawInterval
 * @property {number} drawToRoundStartInterval
 * @property {JackpotRouletteRound} currentRound
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
   * @type {number}
   */
  createdByUser;
  /**
   * Unix timestamp
   * @type {number}
   */
  createdTimestamp;

  /**
   * @type {JackpotRouletteRound}
   */
  currentRound;
  /**
   * @type {number}
   */
  minBetUSD;
  /**
   * @type {number}
   */
  maxBetUSD;

  /**
   * @type {string}
   */
  chatRoomUUID;
  /**
   * @type {number}
   */
  minUserEntriesToStartRound;
  /**
   * @type {number}
   */
  roundStartToDrawInterval;
  /**
   * @type {number}
   */
  drawToRoundStartInterval;
  /**
   *
   * @param {number}
   */
  playersCount;
  /**
   * @type {number[]}
   */
  playersUserIds;

  /**
   * @type {JackpotRouletteRound[]}
   */
  rounds;

  assignRound(round) {
    this.rounds.push(this.currentRound);
    this.currentRound = round;
  }

  /**
   * @param {JackpotRouletteThreadBriefObject} obj
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

    if (this.rounds.length) {
      this.currentRound = new JackpotRouletteRound(
        this.rounds[this.rounds.length - 1]
      );
    }
  }
}
