import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

import { getValueInUSD } from "../helpers/rates";
import JackpotRouletteRound from "../models/Jackpot/Round";
import JackpotRouletteDraw from "../models/Jackpot/Draw";
import JackpotRouletteThread from "../models/Jackpot/Thread";
import JackpotRouletteThreadBrief from "../models/Jackpot/ThreadBrief";
import { jssPreset } from "@material-ui/core";

class JackpotRouletteStore extends EventEmitter {
  /**
   * @type {JackpotRouletteRound[]}
   */
  _history;

  /**
   * @type {JackpotRouletteRound}
   */
  _currentRound;

  /**
   *
   * @type {number}
   */
  _potSize;

  /**
   * @type {string[]}
   */
  #public_threads_keys;

  /**
   * UUID reference to the active thread
   * @type {string}
   */
  #activeThreadUUID;

  /**
   * @type {Object.<string,JackpotRouletteThread>}
   */
  #threads;

  /**
   * @type {Object.<string,JackpotRouletteThreadBrief>}
   */
  #thread_briefs;

  /**
   * A public thread that is by default what users will first see and play on.
   */
  #public_thread_of_choice;

  /**
   * If set to true, thread brief sync will not be requested
   * @type {boolean}
   */
  #is_subscribed_to_thread_briefs_updates;

  constructor(params) {
    super(params);
    this.#threads = [];
    this.#thread_briefs = [];
    this.#is_subscribed_to_thread_briefs_updates = false;
    this.#public_threads_keys = [];
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
   *
   * @param {string} threadUUID
   * @returns {JackpotRouletteThread}
   */
  getThread(threadUUID) {
    return this.#threads[threadUUID];
  }

  /**
   *
   * @param {string} threadUUID
   * @returns {JackpotRouletteThreadBrief}
   */
  getThreadBrief(threadUUID) {
    return this.#thread_briefs[threadUUID];
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
  getPotSize() {
    return this._potSize || 0;
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

  /**
   * Only invoke once the thread sync was received by server-side
   * @param {string} threadUUID
   */
  setActiveThread(threadUUID) {
    this.#activeThreadUUID = threadUUID;
  }

  getPublicThreads() {
    return this.#public_threads_keys.map((threadUUID) =>
      this.getThread(threadUUID)
    );
  }

  /**
   * @param {JackpotRouletteThreadBrief} threadBrief
   */
  storeBrief(threadBrief) {
    if (threadBrief.isPublic) {
      this.#public_thread_of_choice = threadBrief.threadUUID;
    }
    this.#thread_briefs[threadBrief.threadUUID] = threadBrief;
  }
  /**
   *
   */
  requiresThreadBriefsSync() {
    this.#is_subscribed_to_thread_briefs_updates = true;
  }

  getPublicThreadOfChoice() {
    if (!this.#public_thread_of_choice) {
      return undefined;
    }
    return this.getThreadBrief(this.#public_thread_of_choice);
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
    case ActionTypes.GAME_JACKPOT_ROULETTE_THREAD_CHANGE:
      jackpotRouletteStore.setActiveThread(action.data.threadUUID);
      break;
    case ActionTypes.GAME_JACKPOT_ROULETTE_THREADS_BRIEF_RECEIVED:
      // Store briefs
      action.data.threadBriefs.map((threadBrief) =>
        jackpotRouletteStore.storeBrief(threadBrief)
      );
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
