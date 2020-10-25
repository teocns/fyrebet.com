import JackpotRouletteRound from "../models/Jackpot/Round";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import JackpotRouletteDraw from "../models/Jackpot/Draw";
import JackpotRouletteBet from "../models/Jackpot/Bet";
import { sendMessage as socketSendMessage } from "../socket";
import SocketEvents from "../constants/SocketEvents";
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
export const onNewRoundBegin = (jackpotRouletteRound) => {
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
export const onRoundDraw = (jackpotRouletteDraw) => {
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
export const placeBet = (jackpotRouletteBet) => {
  socketSendMessage({
    actionType: SocketEvents.JACKPOT_ROULETTE_PLACE_BET,
    data: {
      jackpotRouletteRound: new JackpotRouletteBet(jackpotRouletteBet),
    },
  });
};
