import { CurrencyCode } from "../constants/Currencies";
import BaseModel from "./BaseModel";
import UserSocialBrief from "./UserSocialBrief";

/**
 * @typedef {Object} BetObject
 * @property {string} betUUID
 * @property {CurrencyCode} currencyCode
 * @property {number} amount
 * @property {UserSocialBrief} user
 */

export default class Bet extends BaseModel {
  /**
   * @type {string}
   */
  betUUID;
  /**
   * @type {CurrencyCode}
   */
  currencyCode;
  /**
   * @type {number}
   */
  amount;
  /**
   * @type {UserSocialBrief}
   */
  user;
  /**
   *
   * @param {BetObject} obj
   */
  constructor(obj) {
    super(obj);
  }
}
