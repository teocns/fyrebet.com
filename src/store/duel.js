pimport { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Langs from "../constants/Langs";
import * as ChatConstants from "../constants/Chat";

import sessionStore from "./session";

import ChatThreadMessage from "../models/ChatThreadMessage";
import ChatHistoryThread from "../models/ChatHistoryThread";
import ChatThread from "../models/ChatThread";
import * as ArrayHelpers from "../helpers/array";
import * as chatActions from "../actions/chat";
import DuelLobby from "../models/Duel/Lobby";

class DuelStore extends EventEmitter {
  /**
   * @type {DuelLobby}
   */
  activeLobby;
  constructor(params) {
    super(params);
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

  /**
   * @param {DuelLobby} duellobby
   */
  setActiveDuelLobby(duellobby) {
    if (duellobby instanceof DuelLobby) this._activeDuelLobby = duellobby;
  }
  getActiveDuelLobby() {
    return this._activeDuelLobby;
  }
}

const duelStore = new DuelStore();

duelStore.dispatchToken = dispatcher.register((action) => {
  let willEmitChange = true;
  switch (action.actionType) {
    default:
      willEmitChange = false;
      break;
  }

  willEmitChange && duelStore.emitChange(action.actionType, action.data);
});

export default duelStore;
