import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

import { getValueInUSD } from "../helpers/rates";
const CHANGE_EVENT = "change";

class FortuneWheelStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.history = [];
    this.currentRound = {};
    this.resetBets();
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
  resetBets() {
    this.allBets = {
      arr: [],
      usdValue: 0,
    };

    this.mBets = {
      2: {
        arr: [],
        usdTotal: 0.0,
      },
      3: {
        arr: [],
        usdTotal: 0.0,
      },
      5: {
        arr: [],
        usdTotal: 0.0,
      },
      50: {
        arr: [],
        usdTotal: 0.0,
      },
    };
  }
  setCurrentRound(round) {
    if (this.currentRound.isDrawn) {
      this.history.push(this.currentRound);
      if (this.history.length > 25) {
        this.history.shift();
      }
    }
    this.currentRound = round;
    this.resetBets();
  }
  getCurrentRound() {
    return this.currentRound;
  }
  setBets(mBets) {
    this.mBets = mBets;
  }
  getBets(multiplier) {
    if (undefined === multiplier || !(multiplier in this.mBets)) {
      return this.allBets.arr;
    }
    return this.mBets[multiplier].arr;
  }

  getBetsCount(multiplier) {
    if (undefined === multiplier || !(multiplier in this.mBets)) {
      return this.allBets.arr.length;
    }
    return this.mBets[multiplier].arr.length;
  }
  getBetsAmountUSD(multiplier) {
    if (undefined === multiplier || !(multiplier in this.mBets)) {
      return this.allBets.usdTotal;
    }
    return this.mBets[multiplier].usdTotal;
  }
  getPreviousRound() {
    if (this.history && this.history.length) {
      return this.history[this.history.length - 1];
    }
    return {};
  }
  setHistory(history) {
    this.history = history;
  }
  betReceived(bet) {
    const usdValue = getValueInUSD({
      currency: bet.betCurrency,
      amount: bet.betAmount,
    });

    this.allBets.arr.push(bet);
    this.allBets.usdTotal += usdValue;

    this.mBets[bet.multiplier].arr.push(bet);
    this.mBets[bet.multiplier].usdTotal += usdValue;
  }
}

const fortuneWheelStore = new FortuneWheelStore();

fortuneWheelStore.dispatchToken = dispatcher.register((action) => {
  let willEmitChange = false;
  switch (action.actionType) {
    case ActionTypes.GAME_FORTUNE_WHEEL_USER_BET:
      fortuneWheelStore.betReceived(action.data.bet);
      break;
    case ActionTypes.GAME_FORTUNE_WHEEL_STATUS:
      fortuneWheelStore.setCurrentRound(action.data.round);
      fortuneWheelStore.setBets(action.data.mBets);
      fortuneWheelStore.setHistory(action.data.history);

      break;
    case ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN:
      fortuneWheelStore.setCurrentRound(action.data.round);
      break;
    case ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW:
      fortuneWheelStore.setCurrentRound(action.data.round);
      break;
    default:
      break; // do nothing
  }
  willEmitChange &&
    fortuneWheelStore.emitChange(action.actionType, action.data);
});

export default fortuneWheelStore;
