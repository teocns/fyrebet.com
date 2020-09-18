import dispatcher from "../dispatcher";

import * as chatActions from "../actions/chat";

import SocketEvents from "../constants/SocketEvents";

import ActionTypes from "../constants/ActionTypes";

const bindChatSocketHandler = (socket) => {
  socket.on(SocketEvents.CHAT_MESSAGE_RECEIVED, (messageData) => {
    chatActions.onChatMessageReceived(messageData);
  });

  socket.on(SocketEvents.LAST_CHAT_MESSAGES, (userData) => {
    chatActions.onChatStatusReceived(userData);
  });
};

export default bindChatSocketHandler;
