import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
import chatStore from "../store/chat";
import { Socket } from "socket.io-client";

import { ChatPublicRooms } from "../constants/Chat";
import sessionStore from "../store/session";
import { Dispatcher } from "flux";
import Fetcher from "../classes/fetcher";

export function sendMessage(messageText) {
  //console.log("sending message from user chat actions");

  const activeChatRoom = chatStore.getActiveChatRoom();

  if (!activeChatRoom || !activeChatRoom.UUID) return;

  let messageData = {
    messageText,
    chatRoomUUID: activeChatRoom.UUID,
  };
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_SENT,
    data: messageData,
  });
  socketSendMessage(SocketEvents.SEND_CHAT_MESSAGE, messageData);
}

export function onChatMessageReceived(messageData) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_RECEIVED,
    data: messageData,
  });
}

export function getAvailableChatRooms() {}

export function changeActiveChatRoom({ chatRoomUUID }) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_ROOM_CHANGE,
    data: { chatRoomUUID },
  });

  // // Check if chatRoom is available in the store (i.e User has it active)
  // if (!chatStore.hasChatRoomPreloaded(chatRoomUUID)) {
  //   // Get chat room
  // }
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

export function loadDefaultChatRoom() {
  setTimeout(() => {
    // Check which one is the default - and if there's any
    const def = chatStore.getDefaultChatRoom();
    let willRequestChatRoomUUID = undefined;
    if (!def) {
      // No default stored. Probably users' first chat entry
      // Set default to english
      willRequestChatRoomUUID = ChatPublicRooms.EN.shortCode;
    } else {
      willRequestChatRoomUUID = def;
    }

    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_ROOM_CHANGE,
      data: {
        chatRoomUUID: willRequestChatRoomUUID,
      },
    });
  });
}

export async function startPrivateChat(userUUID) {
  // Retrieves private chat UUID
  const { chatRoomUUID } = await Fetcher.get("/find-private-chat-room", {
    userUUID,
  });
  if (typeof chatRoomUUID === "string" && chatRoomUUID.length === 36) {
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_ROOM_CHANGE,
      data: { chatRoomUUID },
    });
  }
}

export async function onUserOpenChatsReceived(recentChats) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_OPEN_ROOMS_RECEIVED,
    data: { recentChats },
  });
}
