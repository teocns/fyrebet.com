import BaseModel from "../BaseModel";

export default class LotteryBrief extends BaseModel {
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
}
