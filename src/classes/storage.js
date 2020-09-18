export default class Storage {
  constructor() {
    this.authentication_token = "";
    let raw = localStorage.getItem("store");
    if (raw) {
      let data = JSON.parse(raw);
      let target = this;
      Object.keys(data).map((key) => {
        this[key] = data[key];
      });
    }
  }
  save() {
    let rawStr = JSON.stringify(this);
    localStorage.setItem("store", rawStr);
  }

  put(key, value) {
    this[key] = value;
    this.save();
  }
}
