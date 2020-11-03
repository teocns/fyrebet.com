export default class UserAvatar {
  /**
   * @type {string}
   */
  UUID;
  /**
   * Avatar asset url indexed by size (32,64,128)
   * @type {Object.<number,string>}
   */
  sizes;

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
