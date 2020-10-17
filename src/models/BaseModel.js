export default class BaseModel {
  constructor(obj) {
    if (typeof obj === "object") {
      for (let key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
