import BaseModel from "../BaseModel";

export default class LotteryBrief {
  /**
   * @type {string}
   */
  lotteryUUID;
  /**
   * In USD
   * @type {number}
   */
  prize;
  /**
   * @type {number}
   */
  drawTimestamp;
  /**
   * @type {totalPlayers}
   */
  /**
   * @type {number}
   */
  totalPlayers;

  constructor(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
