import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
import chatStore from "../store/chat";
import { Socket } from "socket.io-client";

export function sendMessage(data) {
  //console.log("sending message from user chat actions");

  socketSendMessage(SocketEvents.SEND_CHAT_MESSAGE, data);
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_SENT,
    data: data,
  });
}

export function onChatMessageReceived(messageData) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_RECEIVED,
    data: messageData,
  });
}

export function getAvailableChatRooms() {}

export function changeActiveChatRoom({ chatRoomUUID }) {
  socketSendMessage(SocketEvents.CHAT_SWITCH_ACTIVE_ROOM, { chatRoomUUID });

  // Check if chatRoom is available in the store (i.e User has it active)
  if (!chatStore.hasChatRoomPreloaded(chatRoomUUID)) {
    // Get chat room
  }
}
export function onChatRoomDataReceived(chatRoomData) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_ROOM_DATA_RECEIVED,
    data: chatRoomData,
  });
}

export function onChatStatusReceived(chatStatus) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_STATUS_RECEIVED,
    data: chatStatus,
  });
}
