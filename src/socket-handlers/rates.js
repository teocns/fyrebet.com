import dispatcher from "../dispatcher";

import * as ratesActions from "../actions/rates";

import SocketEvents from "../constants/SocketEvents";

import ActionTypes from "../constants/ActionTypes";

const bindRatesSocketHandler = (socket) => {
  socket.on(SocketEvents.RATES_UPDATED, (rates) => {
    ratesActions.onRatesUpdated(rates);
  });
};

export default bindRatesSocketHandler;
