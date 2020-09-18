import dispatcher from "../dispatcher";

import * as ratesActions from "../actions/fortune-wheel";

import SocketEvents from "../constants/SocketEvents";

import ActionTypes from "../constants/ActionTypes";

const bindFortuneWHeelSocketHandler = (socket) => {
  socket.on(SocketEvents.FORTUNE_WHEEL_ROUND_BEGIN, (round) => {
    ratesActions.onRoundBegin(round);
  });
  socket.on(SocketEvents.FORTUNE_WHEEL_ROUND_DRAW, (draw) => {
    ratesActions.onRoundDraw(draw);
  });

  socket.on(SocketEvents.FORTUNE_WHEEL_STATUS, (draw) => {
    ratesActions.onFortuneWheelStatus(draw);
  });

  socket.on(SocketEvents.FORTUNE_WHEEL_USER_BET, (userBet) => {
    ratesActions.onUserBet(userBet);
  });
};

export default bindFortuneWHeelSocketHandler;
