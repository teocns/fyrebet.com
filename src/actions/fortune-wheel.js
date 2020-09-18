//import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import { sendMessage } from "../socket";
import dispatcher from "../dispatcher";

import SocketEvents from "../constants/SocketEvents";

// Subscribes to socket's fortune wheel room
export function joinRoom() {
  sendMessage(SocketEvents.FORTUNE_WHEEL_JOIN);
}

// Unubscribes to socket's fortune wheel room
export function leaveRoom() {
  sendMessage(SocketEvents.FORTUNE_WHEEL_LEAVE);
}

export function placeBet(data) {
  sendMessage(SocketEvents.FORTUNE_WHEEL_USER_BET, data);
}

export function onFortuneWheelStatus(data) {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
    data: data,
  });
}

export function onRoundBegin(data) {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN,
    data: data,
  });
}

export function onRoundDraw(data) {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW,
    data: data,
  });
}

export function onUserBet(bet) {
  dispatcher.dispatch({
    actionType: ActionTypes.GAME_FORTUNE_WHEEL_USER_BET,
    data: { bet },
  });
}
