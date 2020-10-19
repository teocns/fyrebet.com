export default class UserAvatar extends BaseModel {
  /**
   * @type {string}
   */
  UUID;
  /**
   * Avatar asset url indexed by size (32,64,128)
   * @type {Object.<number,string>}
   */
  sizes;
}
