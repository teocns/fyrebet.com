import BaseModel from "./BaseModel";
import ChatThreadMessage from "./ChatThreadMessage";

export default class ChatThread {
  /**
   * @type {string}
   */
  chatRoomUUID;
  /**
   * @type {string}
   */
  lastMessageText;
  /**
   * @type {string}
   */
  iconUrl;
  /**
   * @type {string}
   */
  chatName;

  /**
   * @type {ChatThreadMessage[]}
   */
  messages;

  /**
   * @type {boolean}
   */
  isLoading;

  /**
   * @type {string}
   */
  chatRoomType;
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
