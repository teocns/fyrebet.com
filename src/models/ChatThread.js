import BaseModel from "./BaseModel";
import ChatThreadMessage from "./ChatThreadMessage";

export default class ChatThread extends BaseModel {
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
}
