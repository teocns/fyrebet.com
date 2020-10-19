import BaseModel from "./BaseModel";

export default class User extends BaseModel {
  /**
   * @type {Number}
   */
  id;
  /**
   * @type {string}
   */
  username;
  /**
   * Defaults to size 32
   * @type {string}
   */
  avatarUrl;
  /**
   * @type {string}
   */
  UUID;
  /**
   * @type {string}
   */
  email;
  /**
   * User balances indexed by KEY and respective value (max 8 Decimals)
   * @type {Object.<string,number>}
   */
  balances;
  /**
   * History of user's chats
   * @type {ChatHistoryThread[]}
   */
  chatHistory;
  /**
   * @type {UserAvatar}
   */
  avatar;
}
