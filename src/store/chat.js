import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Langs from "../constants/Langs";
import * as ChatConstants from "../constants/Chat";

import sessionStore from "./session";

import ChatThreadMessage from "../models/ChatThreadMessage";
import ChatHistoryThread from "../models/ChatHistoryThread";
import ChatThread from "../models/ChatThread";
import * as ArrayHelpers from "../helpers/array";
import * as chatActions from "../actions/chat";
const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  /**
   * Chat is ready to render to the user. Everything has loaded properly
   * @type {boolean}
   */
  _isInitialized;
  /**
   * Only simplified, incomplete chats are stored here, for pure fast searching only.
   * @type {ChatHistoryThread[]}
   */
  _chatHistory = [];
  /**
   * Complete chat rooms that are or been active (user opened it)
   * @type {Object.<string, ChatThread>}
   */
  _chatThreads = {};

  /**
   * When public rooms are finally stored, this will set to True
   * @type {boolean}
   */
  _publicRoomsReceived;

  /**
   * The global chat room, relative to the client's language.
   * @type {string}
   */
  _languagePublicRoomUUID;
  constructor(params) {
    super(params);

    this._isInitialized = false; // Sets to initialized only once public chat rooms are received
    this._activeChatRoomUUID = undefined;
    this._chatThreads = {}; // Indexed by UUID. Public chats will always be here.

    let self = this;
    window.chatrooms = () => console.log(self._chatThreads);
    window.chathistory = () => console.log(self._chatHistory);
    window.activechat = () => console.log(self.getActiveChatThread());
    window.chatmode = () => console.log(self._chatModeStatus);
    window.languageroom = () => console.log(self.getLanguagePublicRoom());

    chatActions.loadDefaultChatThread();
  }

  /**
   * @returns {ChatThread}
   */
  getActiveChatThread() {
    return this._chatThreads[this._activeChatRoomUUID];
  }
  addChangeListener(actionType, callback) {
    this.on(actionType ?? DEFAULT_EVENT, callback);
  }

  removeChangeListener(actionType, callback) {
    this.removeListener(actionType, callback);
  }

  emitChange(event, data) {
    this.emit(event ?? DEFAULT_EVENT, data);
  }
  // Proprietary functions
  getActiveChatThreadMessages() {
    const activeChat = this.getActiveChatThread();
    return activeChat &&
      Array.isArray(activeChat.messages) &&
      !activeChat.isLoading
      ? activeChat.messages
      : [];
  }

  /**
   * @returns {ChatHistoryThread[]}
   */
  getChatHistory() {
    return this._chatHistory;
  }

  /**
   * @returns {Object.<string,ChatThread>}
   */
  getChats() {
    return this._chatThreads;
  }

  setLanguagePublicRoom(chatRoomUUID) {
    this._languagePublicRoomUUID = chatRoomUUID;
  }
  getLanguagePublicRoom(chatRoomUUID) {
    return this._languagePublicRoomUUID;
  }

  /**
   * Store non-complex chats intended for fast browsing, only rendered in HISTORY chat mode
   * @param {ChatHistoryThread[]} newData
   * @param {boolean} isChunk
   */
  storeChatsHistory(newData, isChunk = false) {
    if (!Array.isArray(this._chatHistory)) {
      this._chatHistory = newData;
    }
    if (isChunk) {
      this._chatHistory = [...this._chatHistory, ...newData];
    } else {
      this._chatHistory = newData;
    }
  }

  /**
   * Store complete chat threads, usually that need to be opened or messaged within
   * @param {ChatThread} chatThread
   */
  storeChatThread(chatThread) {
    this._chatThreads[chatThread.chatRoomUUID] = chatThread;
  }

  hasChat(chatRoomUUID) {
    return (
      undefined !==
      this.openChatsUUIDs.find(
        ({ _chatRoomUUID }) => _chatRoomUUID === chatRoomUUID
      )
    );
  }

  /**
   * Determines if a full version of the chat requires fetching
   * @returns {boolean}
   * @param {number} chatRoomUUID
   */
  chatRequiresFetching(chatRoomUUID) {
    // See if we have the chat stored
    const chatRoom = this._chatThreads[chatRoomUUID];
    if (!chatRoom || !(chatRoom instanceof ChatThread) || chatRoom.isLoading) {
      return true; // Chat room has never been fetched
    }
    return false;
  }

  /**
   *
   * @param {ChatThreadMessage} message
   */
  storeMessageReceived(message) {
    // Only continue if we have the chat room downloaded
    if (message.chatRoomUUID in this._chatThreads) {
      // Make sure we don't already have the message
      let exists = !!this._chatThreads[message.chatRoomUUID].messages.find(
        (iter) => iter.messageUUID === message.messageUUID
      );
      if (exists) {
        return;
      }

      this._chatThreads[message.chatRoomUUID].messages.push(message);
      // Keep a maximum stack of 50 messages received. Why not?4
      if (this._chatThreads[message.chatRoomUUID].messages.length > 50) {
        this._chatThreads[message.chatRoomUUID].messages.shift();
      }
    }

    // If the message is peresent in chatHistory, update the last message
    let foundAtIndex = undefined;
    for (let i = 0; i < this._chatHistory.length; i++) {
      if (this._chatHistory[i].chatRoomUUID === message.chatRoomUUID) {
        this._chatHistory[i].lastMessageText = message.messageText;
        foundAtIndex = i;
        break;
      }
    }
    if (foundAtIndex !== undefined) {
      if (foundAtIndex !== 0) {
        this._chatHistory = ArrayHelpers.move(
          this._chatHistory,
          foundAtIndex,
          0
        );
      }
      // Also increase the unread count, if the current chat is not active
      if (
        this._chatModeStatus !== ChatConstants.ChatModeStatuses.IS_CHATTING ||
        this._activeChatRoomUUID !== message.chatRoomUUID
      ) {
        this._chatHistory[0].unreadMessages++;
      }
    }
  }

  setActiveChatThread(chatRoomUUID) {
    this._activeChatRoomUUID = chatRoomUUID;
    localStorage.setItem("_activeChatRoomUUID", this._activeChatRoomUUID);
    if (this.chatRequiresFetching(chatRoomUUID)) {
      // Set chat to loading as it's being requested
      this._chatThreads[chatRoomUUID] = new ChatThread({
        isLoading: true,
        chatRoomUUID: chatRoomUUID,
      });
    }
    // Set unread messages to 0
    for (let i = 0; i < this._chatHistory.length; i++) {
      if (this._chatHistory[i].chatRoomUUID === chatRoomUUID) {
        this._chatHistory[i].unreadMessages = 0;
        break;
      }
    }
  }

  getDefaultChatRoom() {
    return (
      this.defaultChatRoom ||
      (this.defaultChatRoom = localStorage.getItem("_activeChatRoomUUID"))
    );
  }
  getPublicChatRoom() {
    return this._chatThreads[this.activeLanguageShortCode];
  }

  /**
   * Determines wether the user is enabled to chat in the current chat thread
   * @returns {boolean}
   */
  canSendMessage() {
    // Check if it's authenticated
    return sessionStore.isAuthenticated();
  }

  /**
   * Component can be safely rendered afterwards
   * Chat is initialized, public | private chats fetched, defaults initialized.
   * @param {boolean} bool Chat
   */
  setInitialized(bool) {
    this._isInitialized = bool;
    setTimeout(() => {
      dispatcher.dispatch({
        actionType: ActionTypes.CHAT_INITIALIZED,
      });
    });
  }
}

const chatStore = new ChatStore();

chatStore.dispatchToken = dispatcher.register((action) => {
  let willEmitChange = true;
  switch (action.actionType) {
    case ActionTypes.CHAT_MESSAGE_RECEIVED:
      chatStore.storeMessageReceived(action.data.message);
      // Check for longeviness
      break;
    case ActionTypes.CHAT_MESSAGE_SENT:
      // Do nothing, for now
      break;
    case ActionTypes.CHAT_ROOM_CHANGE:
      chatStore.setActiveChatThread(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_THREAD_DATA_RECEIVED:
      chatStore.storeChatThread(new ChatThread(action.data.chatThread));
      break;
    case ActionTypes.CHAT_HISTORY_RECEIVED:
      chatStore.storeChatsHistory(action.data.chatHistory);
      if (chatStore._publicRoomsReceived) {
        chatStore.setInitialized(true);
      }
      break;
    case ActionTypes.CHAT_THREAD_CLOSE:
      chatStore.closeOpenChat(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_MODE_CHANGE:
      chatStore.setChatMode(action.data.chatMode);
      break;
    case ActionTypes.CHAT_PUBLIC_ROOMS_RECEIVED:
      action.data.publicRooms.map((d) => {
        if (d.chatRoomUUID in Langs) {
          chatStore.setLanguagePublicRoom(d.chatRoomUUID);
          // Is there any active chat?
          if (!(chatStore.getActiveChatThread() instanceof ChatThread)) {
            // Then set this chat room as the active one
            setTimeout(() => {
              dispatcher.dispatch({
                actionType: ActionTypes.CHAT_ROOM_CHANGE,
                data: { chatRoomUUID: d.chatRoomUUID },
              });
            });
          }
        }
        chatStore.storeChatThread(new ChatThread(d));
      });
      chatStore._publicRoomsReceived = true;
      if (!sessionStore.willAuthenticate()) {
        chatStore.setInitialized(true);
      }
      break;
    case ActionTypes.LANGUAGE_CHANGE:
      setTimeout(() => {
        chatActions.onLanguageChanged(action.data.shortCode);
      });
      break;
    case ActionTypes.AUTHENTICATION_FAILED:
      // Authentication failed :( Maybe fire chat initialized status if public rooms have been received
      if (chatStore._publicRoomsReceived) {
        chatStore.setInitialized(true);
      }
      break;
    default:
      willEmitChange = false;
      break;
  }

  willEmitChange && chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
