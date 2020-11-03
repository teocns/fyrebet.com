import BaseModel from "./BaseModel";

export default class UserSocialBrief {
  /**
   * @type {string}
   */
  username;
  /**
   * Links of avatars indexed by different sizes (32,64,128)
   * @type {Object.<number,string>}
   */
  avatars;
  /**
   * @type {string}
   */
  lastMessageText;
  /**
   * @type {number}
   */
  lastMessageTimestamp;
  /**
   * @type {number}
   */
  unreadMessagesCount;

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
