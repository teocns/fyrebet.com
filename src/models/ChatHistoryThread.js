import BaseModel from "./BaseModel";

/**
 * When user loads history of his chats, each single available chat would be represented by this model
 */
export default class ChatHistoryThread {
  /**
   * @type {string}
   */
  lastMessageText;
  /**
   * @type {number}
   */
  lastMessageTimestamp;
  /**
   * @type {string}
   */
  chatRoomUUID;
  /**
   * @type {string}
   */
  iconUrl;
  /**
   * @type {string}
   */
  chatName;

  /**
   * @type {number}
   */
  unreadMessages;
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
