import UserSocialBrief from "../UserSocialBrief";

class LobbyParty extends UserSocialBrief {
  /**
   * @type {boolean}
   */
  isReady;

  constructor(obj) {
    super(obj);
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
