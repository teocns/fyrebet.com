import BaseModel from "../BaseModel";
import UserSocialBrief from "../UserSocialBrief";

export default class DuelLobbyInvitation {
  /**
   * @type {UserSocialBrief}
   *
   */
  host;
  /**
   * All participants indexed by UUID
   * @type {UserSocialBrief[]}
   */
  parties;
  /**
   * Chat room of the lobby. It will persist for whole duration of the duel!
   * @type {string}
   */
  chatThreadUUID;
  /**
   * Comes in an unix fashion - variable self-explanatory
   * @type {number}
   */
  lobbyCreationTimestamp;

  gameType;
}
