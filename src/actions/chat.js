import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
import chatStore from "../store/chat";

import { ChatPublicRooms, Types } from "../constants/Chat";

import Fetcher from "../classes/fetcher";

import ChatHistoryThread from "../models/ChatHistoryThread";
import * as ChatConstants from "../constants/Chat";
import sessionStore from "../store/session";
export function sendMessage(messageText) {
  //console.log("sending message from user chat actions");

  const activeChatRoom = chatStore.getActiveChatThread();

  if (!activeChatRoom || !activeChatRoom.chatRoomUUID) return;

  let messageData = {
    messageText,
    chatRoomUUID: activeChatRoom.chatRoomUUID,
  };
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_SENT,
    data: messageData,
  });
  socketSendMessage(SocketEvents.SEND_CHAT_MESSAGE, messageData);
}

export function onChatMessageReceived(message) {
  if (chatStore.chatRequiresFetching(message.chatRoomUUID)) {
    // Does not have chat room fetched, hence the store wouldn't know where to push the message.
    // Downloading the chat data
    socketSendMessage(SocketEvents.CHAT_ROOM_DATA_REQUEST, {
      chatRoomUUID: message.chatRoomUUID,
    });
  } else {
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_MESSAGE_RECEIVED,
      data: { message },
    });
  }
}

export function changeActiveChatRoom(chatRoomUUID) {
  // Finally, check if chat mode change should be fired, i.e the user was in HISTORY
  if (chatStore.getChatMode() !== ChatConstants.ChatModeStatuses.IS_CHATTING) {
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_MODE_CHANGE,
      data: {
        chatMode: ChatConstants.ChatModeStatuses.IS_CHATTING,
      },
    });
  }

  // Dispatch chained events
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_ROOM_CHANGE,
    data: { chatRoomUUID },
  });
  // Check if chat requires fetching
  if (chatStore.chatRequiresFetching(chatRoomUUID)) {
    setTimeout(() => {
      socketSendMessage(SocketEvents.CHAT_ROOM_DATA_REQUEST, {
        chatRoomUUID,
      });
    }, 75);
  }
}

export const getUserChats = async (skip = 0, limit = 25) => {
  return await Fetcher.get("userChats", { s: skip, l: limit });
};

window.getChats = async (skip, limit) => {
  return await getUserChats(skip, limit);
};
export function onChatThreadDataReceived(chatThread) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_THREAD_DATA_RECEIVED,
    data: { chatThread },
  });
}

export function onPublicRoomsReceived(publicRooms) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_PUBLIC_ROOMS_RECEIVED,
    data: { publicRooms },
  });

  // Check if session is authenticated
  if (sessionStore.isAuthenticated) {
    // User is authenticated, public rooms received. It is safe to suggest the chat has finally initialized
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_INITIALIZED,
    });
  } // User has not authenticated, but are WE going to perform an authentication attempt?
  else if (
    sessionStore.hasAuthenticationToken &&
    !sessionStore.authenticationAttemptFinished
  ) {
    // If so, wait for authentication to complete first, so we can obtain user's private chats history
    // Do nothing
  }
}

export function loadDefaultChatThread() {
  setTimeout(() => {
    // Check which one is the default - and if there's any
    const def = chatStore.getDefaultChatRoom();
    let willChangeToChatThreadUUID = undefined;
    if (!def) {
      // No default stored. Probably users' first chat entry
      // Set default to english
      willChangeToChatThreadUUID = ChatPublicRooms.EN.shortCode;
    } else {
      willChangeToChatThreadUUID = def;
    }

    changeActiveChatRoom(willChangeToChatThreadUUID);
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

/**
 * @param {ChatHistoryThread[]} chatHistory
 */
export async function onUserChatHistoryReceived(chatHistory) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_HISTORY_RECEIVED,
    data: { chatHistory },
  });
  if (chatStore.publicRoomsReceived) {
    setTimeout(() => {
      // Should we finally set the chat to initalized?
      dispatcher.dispatch({
        actionType: ActionTypes.CHAT_INITIALIZED,
      });
    });
  }
}

export function closeChat(chatRoomUUID) {
  // Dispatch chained events
  [
    () => {
      socketSendMessage(SocketEvents.CHAT_ROOM_LEAVE, { chatRoomUUID });
    },
    () => {
      dispatcher.dispatch({
        actionType: ActionTypes.CHAT_THREAD_CLOSE,
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
  const activeChat = chatStore.activeChatRoomUUID;
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
export const triggerChatVisited = (chatRoomUUID) => {
  socketSendMessage(SocketEvents.CHAT_ROOM_VISITED, { chatRoomUUID });
};

export const searchQuery = async (query) => {
  // Quick query validation
  query = query ? query.toString().trim().toLowerCase() : "";
  if (!query) {
    return;
  }

  // Inform dispatcher we are performing chat queries
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_SEARCH_QUERY,
    data: { searchQuery: query, isLoadingChatResults: true }, // also set isLoading to show preload
  });

  // Optimize search results keeping. Iterate through the search-query
  // If results' column-values match the search query, don't remove those rows.
  const searchColumns = ["username", "lastMessageText"];
  const searchPredicate = (result) => {
    const resultColumns = Object.keys(result);
    for (let searchColumn of searchColumns) {
      if (
        resultColumns.includes(searchColumn) &&
        result[searchColumn] &&
        result[searchColumn].toString().toLowerCase().includes(query)
      ) {
        // Occurrence found
        return true;
      }
    }
    // No matching value has been found
    return false;
  };
  const lastResults = chatStore.getSearchResults();
  const newResults = lastResults.filter(searchPredicate);
  // Dispatch the new results with removed and kept occurrences
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_SEARCH_RESULTS_CHANGED,
    data: { searchResults: newResults, isLoadingChatResults: true }, // It is stil loading, keep preload
  });

  // To avoid spam, make sure only one api call gets through every 1 second
  // If CHAT_PREPARE_SEARCH_API_CALL dispatches again, it will clear any previous timers
  // hence nulling any "queued" api calls and rolling in a new one awaiting to fire
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_PREPARE_SEARCH_API_CALL,
    data: {
      timer: setTimeout(async () => {
        // Fetch search query results
        const searchResults = await Fetcher.get("/chatSearchQuery", { query });
        if (Array.isArray(searchResults)) {
          dispatcher.dispatch({
            actionType: ActionTypes.CHAT_SEARCH_RESULTS_CHANGED,
            data: { searchResults, isLoadingChatResults: false },
          });
        }
      }, 1000),
      willExecuteAt: parseInt(Date.now() / 1000) + 1,
    },
  });
};

export const changeChatMode = async (chatMode) => {
  // Unauthenticated users cannot go to to HISTORY mode. Otherwise, what is it that would they see? lol
  if (!sessionStore.isAuthenticated) {
    alert("Where ya goin boi? Login first pls");
    return;
  }
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MODE_CHANGE,
    data: { chatMode },
  });
};
