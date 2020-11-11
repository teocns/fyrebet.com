import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
import chatStore from "../store/chat";

import { ChatPublicRooms, Types } from "../constants/Chat";

import Fetcher from "../classes/fetcher";

import ChatHistoryThread from "../models/ChatHistoryThread";
import * as ChatConstants from "../constants/Chat";
import * as notificationActions from "./notification";
import * as uiActions from "./ui";

import sessionStore from "../store/session";
import uiStore from "../store/ui";
import ChatThreadMessage from "../models/ChatThreadMessage";

import AppDrawerViews from "../constants/AppDrawerViews";

export const sendMessage = (messageText) => {
  //console.log("sending message from user chat actions");

  const activeChatRoom = chatStore.getActiveChatThread();

  if (!activeChatRoom || !activeChatRoom.chatRoomUUID) return;

  let messageData = {
    messageText,
    chatRoomUUID: activeChatRoom.chatRoomUUID,
  };
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.MESSAGE_SENT,
    data: messageData,
  });
  socketSendMessage(SocketEvents.SEND_CHAT_MESSAGE, messageData);
};

/**
 *
 * @param {ChatThreadMessage} message
 */
export const onChatMessageReceived = (message) => {
  if (!chatStore.chatRequiresFetching(message.chatRoomUUID)) {
    // Deploy message received event - Chat does not require fetching
    dispatcher.dispatch({
      actionType: ActionTypes.Chat.MESSAGE_RECEIVED,
      data: { message },
    });

    // Should we display notification?
    if (message.userUUID !== sessionStore.getUser().UUID) {
      notificationActions.notifyMessageReceived(message);
    }
  } else {
    // Does not have chat room fetched, hence the store wouldn't know where to push the message.
    // Cache the dispatch and fire it later when we receive the chat room data
    let chatDataReceived = false;
    const onFetchedChatDataReceived = ({ chatThread }) => {
      const { chatRoomUUID } = chatThread;
      if (chatRoomUUID !== message.chatRoomUUID) {
        console.log("chatRoomUUID !== message.chatRoomUUID");
        return;
      }
      chatDataReceived = true;
      console.log("chatDataReceived = true;");
      chatStore.removeChangeListener(
        ActionTypes.Chat.THREAD_DATA_RECEIVED,
        onFetchedChatDataReceived
      );
      setTimeout(() => {
        // Now we can finally dispatch the cached message
        // Notice: the store will discard this message as it's already within the post-fetched chat thread
        onChatMessageReceived(message);
      });
    };
    // To avoid keeping the listener in the memory forever, we truncate it if the chat data has not been received within X seconds
    let startWaitingForChatData = parseInt(Date.now() / 1000);
    console.log("startWaitingForChatData", startWaitingForChatData);
    chatStore.addChangeListener(
      ActionTypes.Chat.THREAD_DATA_RECEIVED,
      onFetchedChatDataReceived
    );
    let waitForChatDataInterval = setInterval(() => {
      if (
        chatDataReceived ||
        (!chatDataReceived &&
          parseInt(Date.now() / 1000) - startWaitingForChatData > 30)
      ) {
        clearInterval(waitForChatDataInterval);
        chatStore.removeListener(
          ActionTypes.Chat.THREAD_DATA_RECEIVED,
          onFetchedChatDataReceived
        );
      }
    }, 1000);
    // Downloading the chat data
    socketSendMessage(SocketEvents.CHAT_ROOM_DATA_REQUEST, {
      chatRoomUUID: message.chatRoomUUID,
    });
  }
};

export function changeActiveChatRoom(chatRoomUUID) {
  console.log("change");
  // Dispatch chained events

  // Before checking if chat requires fetching, see if user needs or will authenticate
  // Because if the chat is a private one, we won't be able to fetch if he's not yet logged in
  if (
    !sessionStore.getUser() &&
    (sessionStore.willAuthenticate() || sessionStore.isAuthenticating())
  ) {
    console.log("user needs or will authenticate before fetching chat");
    // Add a temporary event listener to change the active chat room once the user has logged in
    let waitingConsumed = false;
    let waitingConsumedCheckInterval = undefined;
    let waitingConsumedClockStart = parseInt(Date.now() / 1000);
    const onAuthenticated = () => {
      sessionStore.removeChangeListener(
        ActionTypes.Chat.Session.SESSION_USER_DATA_RECEIVED,
        onAuthenticated
      );
      waitingConsumed = true;
      console.log("waiting consumed");

      setTimeout(() => {
        socketSendMessage(SocketEvents.CHAT_ROOM_DATA_REQUEST, {
          chatRoomUUID,
        });
      });
    };
    sessionStore.addChangeListener(
      ActionTypes.Chat.Session.SESSION_USER_DATA_RECEIVED,
      onAuthenticated
    );

    // Create an interval to timeout data reception and remove the change listener
    waitingConsumedCheckInterval = setInterval(() => {
      if (
        waitingConsumed === false &&
        parseInt(Date.now() / 1000) > waitingConsumedClockStart + 5
      ) {
        console.log("Waiting expired");
        sessionStore.removeChangeListener(
          ActionTypes.Chat.SESSION_USER_DATA_RECEIVED,
          onAuthenticated
        );
        changeActiveChatRoom(chatStore.getPublicChatRoom);
        clearInterval(waitingConsumedCheckInterval);
      }
    }, 250);
  } else if (chatStore.chatRequiresFetching(chatRoomUUID)) {
    setTimeout(() => {
      socketSendMessage(SocketEvents.CHAT_ROOM_DATA_REQUEST, {
        chatRoomUUID,
      });
    });
  }
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.ROOM_CHANGE,
    data: { chatRoomUUID },
  });
}

export const getUserChats = async (skip = 0, limit = 25) => {
  return await Fetcher.get("userChats", { s: skip, l: limit });
};

export function onChatThreadDataReceived(chatThread) {
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.THREAD_DATA_RECEIVED,
    data: { chatThread },
  });
}

export function onPublicRoomsReceived(publicRooms) {
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.PUBLIC_ROOMS_RECEIVED,
    data: { publicRooms },
  });

  // Check if session is authenticated
  if (sessionStore.isAuthenticated) {
    // User is authenticated, public rooms received. It is safe to suggest the chat has finally initialized
    dispatcher.dispatch({
      actionType: ActionTypes.Chat.INITIALIZED,
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
    // Only continue if the app drwaer is set to CHATTING mode

    if (uiStore.getAppDrawerView() !== AppDrawerViews.CHATTING) {
      return;
    }

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
      actionType: ActionTypes.Chat.ROOM_CHANGE,
      data: { chatRoomUUID },
    });
  }
}

/**
 * @param {ChatHistoryThread[]} chatHistory
 */
export async function onUserChatHistoryReceived(chatHistory) {
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.HISTORY_RECEIVED,
    data: { chatHistory },
  });
  if (chatStore._publicRoomsReceived) {
    setTimeout(() => {
      // Should we finally set the chat to initalized?
      dispatcher.dispatch({
        actionType: ActionTypes.Chat.INITIALIZED,
      });
    });
  }
}

export function leaveThread(chatRoomUUID) {
  // Notify the server that we don't want to received updates on the chat
  socketSendMessage(SocketEvents.CHAT_ROOM_LEAVE, { chatRoomUUID });
}

export async function onLanguageChanged(shortCode) {
  const currentLanguagePubRoom = chatStore.getLanguagePublicRoom();
  if (shortCode === currentLanguagePubRoom) {
    return; // No action needed.
  }

  // What was the active chat room?
  const activeChat = chatStore.getActiveChatThread();
  if (activeChat && activeChat.chatRoomUUID === shortCode) {
    // We need to close the current chat

    leaveThread(activeChat.chatRoomUUID);
  }

  // Change the active chat room to the new one
  setTimeout(() => {
    changeActiveChatRoom(shortCode);
  });
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
    actionType: ActionTypes.Chat.SEARCH_QUERY,
    data: { searchQuery: query }, // also set isLoading to show preload
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
    actionType: ActionTypes.Chat.SEARCH_RESULTS_CHANGED,
    data: { searchResults: newResults }, // It is stil loading, keep preload
  });

  // To avoid spam, make sure only one api call gets through every 1 second
  // If CHAT_PREPARE_SEARCH_API_CALL dispatches again, it will clear any previous timers
  // hence nulling any "queued" api calls and rolling in a new one awaiting to fire
  dispatcher.dispatch({
    actionType: ActionTypes.Chat.PREPARE_SEARCH_API_CALL,
    data: {
      timer: setTimeout(async () => {
        // Fetch search query results
        const searchResults = await Fetcher.get("/chatSearchQuery", { query });
        if (Array.isArray(searchResults)) {
          dispatcher.dispatch({
            actionType: ActionTypes.Chat.SEARCH_RESULTS_CHANGED,
            data: { searchResults, query, isServerSideResult: true },
          });
        }
      }, 1000),
      willExecuteAt: parseInt(Date.now() / 1000) + 1,
    },
  });
};

export const showChatThread = (chatRoomUUID) => {
  // Set active chat room
  changeActiveChatRoom(chatRoomUUID);
  // Set app drawer mode to chatting
  uiActions.changeAppDrawerView(AppDrawerViews.CHATTING);
};
