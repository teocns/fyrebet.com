import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Currencies from "../constants/Currencies";

const CHANGE_EVENT = "change";

class NotificationStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.balances = null;
  }
  addChangeListener(event, callback) {
    this.on(event ?? CHANGE_EVENT, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event ?? CHANGE_EVENT, callback);
  }

  emitChange(event, data) {
    this.emit(event ?? CHANGE_EVENT, data);
  }
}

const notificationStore = new NotificationStore();

notificationStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.PLAY_SOUND_EFFECT:
      break;
    default:
      break;
  }
  notificationStore.emitChange(event.actionType, event.data);
});

export default notificationStore;
