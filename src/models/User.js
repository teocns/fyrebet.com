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
}
