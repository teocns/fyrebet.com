import BaseModel from "./BaseModel";

export default class ChatThreadMessage {
  /**
   * @type {string}
   */
  chatRoomUUID;
  /**
   * @type {string}
   */
  messageUUID;
  /**
   * @type {string}
   */
  messageText;
  /**
   * @type {string}
   */
  userUUID;
  /**
   * @type {string}
   */
  iconUrl;
  /**
   * @type {number}
   */
  timestamp;
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
