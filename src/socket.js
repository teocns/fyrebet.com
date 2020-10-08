import dispatcher from "./dispatcher";
import ActionTypes from "./constants/ActionTypes";
import EnvironmentConstants from "./constants/Environment";

import io from "socket.io-client";
import bindSessionSocketHandler from "./socket-handlers/session";
import bindChatSocketHandler from "./socket-handlers/chat";
import bindRatesSocketHandler from "./socket-handlers/rates";
import bindFortuneWheelHandler from "./socket-handlers/fortune-wheel";
import bindBalanceHandler from "./socket-handlers/balance";
import * as sessionActions from "./actions/session";
var socketInstance = initialize();

export function initialize() {
  // Should be called once, maybe
  const socket = io.connect(EnvironmentConstants.ENDPOINT_SOCKET, {
    reconnect: true,
    secure: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });

  // Bind listeners

  bindSessionSocketHandler(socket);
  bindChatSocketHandler(socket);
  bindRatesSocketHandler(socket);
  bindFortuneWheelHandler(socket);
  bindBalanceHandler(socket);

  return socket;
}
export function sendMessage(event, data) {
  socketInstance.emit(event, data);
}

export default socketInstance;
