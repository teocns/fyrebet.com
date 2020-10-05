import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
import chatStore from "../store/chat";

import { ChatPublicRooms, Types } from "../constants/Chat";

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
  if (!chatStore.hasChat(messageData.chatRoomUUID)) {
    // Does not have chat room fetched, hence the store wouldn't know where to push the message.
    // Downloading the chat data
    socketSendMessage(
      SocketEvents.CHAT_ROOM_DATA_REQUEST,
      messageData.chatRoomUUID
    );
  } else {
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_MESSAGE_RECEIVED,
      data: messageData,
    });
  }
}

export function getAvailableChatRooms() {}

export function changeActiveChatRoom(chatRoomUUID) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_ROOM_CHANGE,
    data: { chatRoomUUID },
  });
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
    actionType: ActionTypes.CHAT_OPEN_ROOMS_CHANGED,
    data: { recentChats },
  });
}

export function closeChat(chatRoomUUID) {
  // Dispatch chained events
  [
    () => {
      socketSendMessage(SocketEvents.CHAT_ROOM_LEAVE, { chatRoomUUID });
    },
    () => {
      dispatcher.dispatch({
        actionType: ActionTypes.CHAT_ROOM_CLOSE,
        data: { chatRoomUUID },
      });
    },
  ].map((f) => setTimeout(f));
}

export async function onLanguageChanged(shortCode) {
  // Get old public chat room
  const publicChatRoom = chatStore.getPublicChatRoom();
  if (publicChatRoom) {
    // Close it
    closeChat(publicChatRoom.chatRoomUUID);
  }
  // What was the active chat room?
  const activeChat = chatStore.activeChatRoom;
  if (
    activeChat &&
    publicChatRoom &&
    activeChat === publicChatRoom.chatRoomUUID
  ) {
    // Change the active chat room
    setTimeout(() => {
      changeActiveChatRoom(shortCode);
    });
  }
}
