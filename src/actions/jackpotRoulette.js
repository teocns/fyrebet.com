import JackpotRouletteRound from "../models/Jackpot/Round";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import JackpotRouletteDraw from "../models/Jackpot/Draw";
import JackpotRouletteBet from "../models/Jackpot/Bet";
import { sendMessage as socketSendMessage } from "../socket";
import SocketEvents, {
  JACKPOT_ROULETTE_THREADS_SYNC,
} from "../constants/SocketEvents";
import jackpotRouletteStore from "../store/jackpotRoulette";
// const currentRound = new JackpotRouletteRound({
//     createdTimestamp: parseInt(Date.now() / 1000),
//     drawTimestamp: parseInt(Date.now() / 1000) + 30,
//     hashedSecret: "bla bla bla, dr freeman",
//     roll: undefined,
//     isDrawn: false,
//     roundUUID: "yessir",
//   });

/**
 * @param {import("../models/Jackpot/Round").JackpotRouletteRoundObject} jackpotRouletteRound
 */
const onNewRoundBegin = (jackpotRouletteRound) => {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW,
    data: {
      jackpotRouletteRound: new JackpotRouletteRound(jackpotRouletteRound),
    },
  });
};

/**
 * @param {import("../models/Jackpot/Draw").JackpotRouletteDrawObject} jackpotRouletteDraw
 */
const onRoundDraw = (jackpotRouletteDraw) => {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW,
    data: {
      jackpotRouletteDraw: new JackpotRouletteDraw(jackpotRouletteDraw),
    },
  });
};

/**
 * @param {import("../models/Jackpot/Bet").JackpotRouletteBetObject} jackpotRouletteBet
 */
const placeBet = (jackpotRouletteBet) => {
  socketSendMessage({
    actionType: SocketEvents.JACKPOT_ROULETTE_PLACE_BET,
    data: {
      jackpotRouletteRound: new JackpotRouletteBet(jackpotRouletteBet),
    },
  });
};

const joinThread = (threadUUID) => {
  const currentThreadSyncReceived = (threadSyncData) => {
    if (threadSyncData.threadUUID === threadUUID) {
      // We received the thread sync we were waiting for;
      jackpotRouletteStore.removeChangeListener(
        ActionTypes.GAME_JACKPOT_ROULETTE_THREAD_SYNC_RECEIVED,
        currentThreadSyncReceived
      );
      // Dispatch event to switch active thread to this.abs
    }
  };

  // Create temp listener on the store to wait for the thread sync
  jackpotRouletteStore.addChangeListener(
    ActionTypes.GAME_JACKPOT_ROULETTE_THREAD_SYNC_RECEIVED,
    currentThreadSyncReceived
  );

  socketSendMessage(SocketEvents.JACKPOT_ROULETTE_JOIN, threadUUID);
};

const leaveThread = (threadUUID) => {
  socketSendMessage(SocketEvents.JACKPOT_ROULETTE_LEAVE);
};

const requestThreadsBriefs = () => {
  socketSendMessage(SocketEvents.JACKPOT_ROULETTE_THREADS_SYNC);
};

/**
 *
 * @param {JackpotRouletteThread[]} threads
 */
const threadsBriefReceived = (threads) => {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_JACKPOT_ROULETTE_THREADS_SYNC_RECEIVED,
    data: { threads },
  });
};

export default {
  leaveThread,
  requestThreadsBriefs,
  threadsBriefReceived,
  placeBet,
  joinThread,
  onRoundDraw,
  onNewRoundBegin,
};
