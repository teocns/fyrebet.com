import io from "socket.io-client";

import constants from "../constants";

const bindEventHandlers = ({ socket, socketContext }) => {
  const events = {
    connect: () => {
      console.log("socket connected");
    },
    USER_DATA_RECEIVED: (user) => {
      //socketContext.session.dispatch({ event: "USER_DATA_RECEIVED", user });
    },
    HANDSHAKE_SOCKET_ID: (socketId) => {
      // Register session id in SessionContext
      // socketContext.session.dispatch({
      //   event: "HANDSHAKE_SOCKET_ID",
      //   socketId,
      // });
      // Ask for user credentials, if there is any authentication ID
      if (socketContext.session.authentication_token) {
        socket.emit("GET_USER_DATA");
      }
    },
    CHAT_MESSAGE_RECEIVED: (message) => {
      socketContext.session.dispatch({
        event: "CHAT_MESSAGE_RECEIVED",
        message,
      });
      console.log("socket connected");
    },
  };

  Object.keys(events).map((eventName) => {
    socket.on(eventName, events[eventName]);
  });
};

const socketInit = ({ socketContext }) => {
  // Create WebSocket connection.

  let socket = io.connect(constants.ENDPOINT, {
    reconnect: true,
    secure: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });

  bindEventHandlers({ socket, socketContext });

  return socket;
};

export default socketInit;
