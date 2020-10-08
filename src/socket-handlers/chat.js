import dispatcher from "../dispatcher";

import * as chatActions from "../actions/chat";

import SocketEvents from "../constants/SocketEvents";

import ActionTypes from "../constants/ActionTypes";

import chatStore from "../store/chat";

const bindChatSocketHandler = (socket) => {
  socket.on(SocketEvents.INITIAL_STATUS, ({ publicChatRooms }) => {
    chatActions.onPublicRoomsReceived(publicChatRooms);
  });
  socket.on(SocketEvents.CHAT_MESSAGE_RECEIVED, (message) => {
    chatActions.onChatMessageReceived(message);
  });

  socket.on(SocketEvents.CHAT_ROOM_DATA, (chatRoomData) => {
    chatActions.onChatRoomDataReceived(chatRoomData);
  });

  socket.on(SocketEvents.USER_DATA, ({ recentChats }) => {
    if (recentChats && Array.isArray(recentChats)) {
      chatActions.onUserOpenChatsReceived(recentChats);
    }
  });

  // chatStore.addChangeListener(
  //   ActionTypes.CHAT_ROOM_CHANGE,
  //   ({ chatRoomUUID }) => {
  //     setTimeout(() => {
  //       socket.emit(SocketEvents.CHAT_ROOM_DATA_REQUEST, { chatRoomUUID });
  //     }, 175);
  //   }
  // );
};

export default bindChatSocketHandler;
