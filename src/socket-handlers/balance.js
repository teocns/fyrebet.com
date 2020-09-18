import dispatcher from "../dispatcher";

import * as balanceActions from "../actions/balance";

import SocketEvents from "../constants/SocketEvents";

const bindBalanceHandler = (socket) => {
  socket.on(SocketEvents.USER_DATA, ({ balances }) => {
    balanceActions.onBalanceUpdated(balances);
  });
  socket.on(SocketEvents.BALANCE_UPDATED, ({ balances }) => {
    balanceActions.onBalanceUpdated(balances);
  });
};

export default bindBalanceHandler;
