import dispatcher from "../dispatcher";

import * as chatActions from "../actions/chat";

import SocketEvents from "../constants/SocketEvents";

import ActionTypes from "../constants/ActionTypes";

import chatStore from "../store/chat";

const bindChatSocketHandler = (socket) => {
  socket.on(SocketEvents.CHAT_MESSAGE_RECEIVED, (messageData) => {
    chatActions.onChatMessageReceived(messageData);
  });

  socket.on(SocketEvents.LAST_CHAT_MESSAGES, (userData) => {
    chatActions.onChatStatusReceived(userData);
  });

  socket.on(SocketEvents.CHAT_ROOM_DATA, (chatRoomData) => {
    chatActions.onChatRoomDataReceived(chatRoomData);
  });

  chatStore.addChangeListener(
    ActionTypes.CHAT_ROOM_CHANGE,
    ({ chatRoomUUID }) => {
      socket.emit(SocketEvents.CHAT_ROOM_DATA_REQUEST, { chatRoomUUID });
    }
  );
};

export default bindChatSocketHandler;
