import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import Langs from "../constants/Langs";
class LanguageStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.lang = undefined;
  }

  addChangeListener(actionType, callback) {
    this.on(actionType, callback);
  }

  removeChangeListener(actionType, callback) {
    this.removeListener(actionType, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }
  // Proprietary functions

  getLang() {
    if (undefined === this.lang) {
      let storedLang = localStorage.getItem("lang");
      if (storedLang) {
        return (this.lang = storedLang);
      } else {
        this.setLang(Langs.EN.shortCode);
        return this.lang;
      }
    }
    return this.lang;
  }
  setLang(lang) {
    if (!(lang in Langs)) {
      return;
    }
    // Save to local storage
    localStorage.setItem("lang", lang);
    this.lang = lang;
  }
}

const languageStore = new LanguageStore();

languageStore.dispatchToken = dispatcher.register((action) => {
  let eventHooked = true;
  switch (action.actionType) {
    case ActionTypes.LANGUAGE_CHANGE:
      languageStore.setLang(action.data.shortCode);
      break;
    default:
      eventHooked = false;
      break;
  }
  eventHooked && languageStore.emitChange(action.actionType, action.data);
});

export default languageStore;
