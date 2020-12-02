import JackpotRouletteRound from "../models/Jackpot/Round";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes/JackpotRoulette";
import JackpotRouletteDraw from "../models/Jackpot/Draw";
import JackpotRouletteBet from "../models/Jackpot/Bet";
import { sendMessage as socketSendMessage } from "../socket";
import SocketEvents, {
  JACKPOT_ROULETTE_THREADS_SYNC,
} from "../constants/SocketEvents";
import jackpotRouletteStore from "../store/jackpotRoulette";
import chatStore from "../store/chat";
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
    actionType: ActionTypes.ROUND_NEW,
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
    actionType: ActionTypes.ROUND_DRAW,
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

const setActiveThread = (threadUUID) => {
  const currentThreadSyncReceived = (threadSyncData) => {
    if (threadSyncData.threadUUID === threadUUID) {
      // We received the thread sync we were waiting for;
      jackpotRouletteStore.removeChangeListener(
        ActionTypes.THREAD_SYNC_RECEIVED,
        currentThreadSyncReceived
      );
      // Dispatch event to switch active thread to this.abs
    }
  };

  // Create temp listener on the store to wait for the thread sync
  jackpotRouletteStore.addChangeListener(
    ActionTypes.THREAD_SYNC_RECEIVED,
    currentThreadSyncReceived
  );

  socketSendMessage(SocketEvents.JACKPOT_ROULETTE_THREAD_USER_JOIN, threadUUID);
};

const leaveThread = () => {
  // We get the active thread from the store
  const threadUUID = jackpotRouletteStore.getActiveThread();
  socketSendMessage(SocketEvents.JACKPOT_ROULETTE_THREAD_USER_LEAVE, {
    threadUUID,
  });
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
    actionType: ActionTypes.THREADS_SYNC_RECEIVED,
    data: { threads },
  });
};

// /**
//  *
//  * @param {string} threadUUID
//  */
// const setActiveThread = (threadUUID) => {

//   // Check if we need to fetch the thread
//   if (jackpotRouletteStore.requiresThreadSync(threadUUID)){
//     // Do not dispatch THREAD_CHANGE now. Instead, request the thread data
//     // Wait for the data to arrive
//     // Then fire THREAD_CHANGE

//     // Register a temporary socket
//     socketSendMessage(SocketEvents.JACKPOT_ROULETTE_THREAD_SYNC, {threadUUID});

//   }
//   dispatcher.dispatch({
//     actionType: ActionTypes.THREAD_CHANGE,
//     data: { threadUUID },
//   });
// };

export default {
  leaveThread,
  requestThreadsBriefs,
  threadsBriefReceived,
  placeBet,
  onRoundDraw,
  onNewRoundBegin,
  setActiveThread,
};
