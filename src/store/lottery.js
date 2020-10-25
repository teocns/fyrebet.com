import { EventEmitter } from "events";
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
import LotteryBrief from "../models/Lottery/Brief";

class LotteryStore extends EventEmitter {
  constructor(params) {
    super(params);
    let a = new LotteryBrief();
    a.drawTimestamp = parseInt(new Date() / 1000) + 123;
    a.prize = 30240.21;
    a.totalPlayers = parseInt(Math.random() * 1000);

    this.setBrief(a);
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
   *
   * @param {LotteryBrief} brief
   */
  setBrief(brief) {
    this._brief = brief;
  }

  /**
   * @returns {LotteryBrief}
   */
  getBrief() {
    return this._brief;
  }
}

const lotteryStore = new LotteryStore();

lotteryStore.dispatchToken = dispatcher.register((action) => {
  let willEmitChange = true;
  switch (action.actionType) {
    default:
      willEmitChange = false;
      break;
  }

  willEmitChange && lotteryStore.emitChange(action.actionType, action.data);
});

export default lotteryStore;
