import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

import { getValueInUSD } from "../helpers/rates";
import JackpotRouletteRound from "../models/Jackpot/Round";
import JackpotRouletteDraw from "../models/Jackpot/Draw";

class JackpotRouletteStore extends EventEmitter {
  /**
   * @type {JackpotRouletteRound[]}
   */
  _history;

  /**
   * @type {JackpotRouletteRound}
   */
  _currentRound;
  constructor(params) {
    super(params);
    this._history = [];
  }

  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  /**
   * @param {JackpotRouletteRound} round
   */
  setCurrentRound(round) {
    this._currentRound = round;
  }
  /**
   * @returns {JackpotRouletteRound}
   */
  getCurrentRound() {
    return this._currentRound || {};
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
  /**
   * @returns {JackpotRouletteRound}
   */
  getPreviousRound() {
    if (this._history && this._history.length) {
      return this._history[this._history.length - 1];
    }
    return {};
  }
  setHistory(history) {
    this.history = history;
  }
  storeBetReceived(bet) {
    const usdValue = getValueInUSD({
      currency: bet.betCurrency,
      amount: bet.betAmount,
    });

    this.allBets.arr.push(bet);
    this.allBets.usdTotal += usdValue;

    this.mBets[bet.multiplier].arr.push(bet);
    this.mBets[bet.multiplier].usdTotal += usdValue;
  }

  isLoaded() {
    return this._currentRound instanceof JackpotRouletteRound;
  }
  /**
   * @param {JackpotRouletteRound} round
   */
  storeNewRound(round) {
    if (this._currentRound instanceof JackpotRouletteRound) {
      this._history.push(this._currentRound);
    } else {
      this._history.push(round);
    }
    this._currentRound = round;
  }

  /**
   * @param {JackpotRouletteDraw} draw
   */
  storeRoundDraw(draw) {
    this._currentRound.assignDraw(draw);
  }
}

const jackpotRouletteStore = new JackpotRouletteStore();

jackpotRouletteStore.dispatchToken = dispatcher.register((action) => {
  let willEmitChange = true;
  switch (action.actionType) {
    case ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW:
      console.log("jackpotRouletteStore.storeNewRound(action.data.round)");
      //console.log(action.data.jackpotRouletteDraw);
      jackpotRouletteStore.storeNewRound(action.data.jackpotRouletteRound);
      break;
    case ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW:
      console.log("jackpotRouletteStore.storeRoundDraw(action.data.roundDraw)");
      console.log(action.data.jackpotRouletteDraw);
      jackpotRouletteStore.storeRoundDraw(action.data.jackpotRouletteDraw);
      break;
    default:
      willEmitChange = false;
      break;
  }
  if (willEmitChange) {
    console.log("emitting change");
  }
  willEmitChange &&
    jackpotRouletteStore.emitChange(action.actionType, action.data);
});

export default jackpotRouletteStore;
