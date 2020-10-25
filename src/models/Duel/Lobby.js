import BaseModel from "../BaseModel";
import UserSocialBrief from "../UserSocialBrief";

export default class DuelLobby extends BaseModel {
  /**
   * @type {string}
   */
  duelLobbyUUID;
  /**
   * All participants indexed by UUID
   * @type {UserSocialBrief[]}
   */
  participants;
  /**
   * Chat room of the lobby. It will persist for whole duel duration!
   * @type {string}
   */
  chatThreadUUID;
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
