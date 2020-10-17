import BaseModel from "./BaseModel";

export default class ChatThreadMessage extends BaseModel {
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
}
