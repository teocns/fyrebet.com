import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Langs from "../constants/Langs";
import * as ChatConstants from "../constants/Chat";

import bindListeners from "../store-listeners/chat";
import sessionStore from "./session";

import ChatThreadMessage from "../models/ChatThreadMessage";
import ChatHistoryThread from "../models/ChatHistoryThread";
import ChatThread from "../models/ChatThread";
const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  /**
   * Only simplified, incomplete chats are stored here, for pure fast searching only.
   * @type {ChatHistoryThread[]}
   */
  chatHistory;
  /**
   * Complete chat rooms that are or been active (user opened it)
   * @type {Object.<string, ChatThread>}
   */
  chatThreads;

  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.activeChatRoomUUID = undefined;
    this.chatThreads = {}; // Indexed by UUID. Public chats will always be here.
    this.publicRoomsUUIDs = []; // Array of keys!
    this.languagePublicRoomUUID = undefined; // The global chat room, relative to the client's language.

    this.chatModeStatus = this.getChatMode(); // Default to "is chatting"

    let self = this;
    window.chatrooms = () => console.log(self.chatThreads);
    window.chathistory = () => console.log(self.chatHistory);
    window.activechat = () => console.log(self.activeChatRoomUUID);
    window.publicrooms = () => console.log(self.publicRoomsUUIDs);
    window.chatmode = () => console.log(self.chatModeStatus);
  }

  storeAvailableChatRooms({ chatRooms }) {
    if (!chatRooms) {
      return;
    }
    this.chatThreads = chatRooms;
  }
  getLastChosenChatRoom() {
    return localStorage.getItem("lastChatRoomUUID");
  }
  getActiveChatThread() {
    return this.chatThreads[this.activeChatRoomUUID];
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
    // return Object.keys(this.chatThreads).map(
    //   (chatRoomUUID) => this.chatThreads[chatRoomUUID]
    // );
    return this.chatHistory;
  }

  /**
   * @returns {Object.<string,ChatThread>}
   */
  getChats() {
    return this.chatThreads;
  }

  setLanguagePublicRoom(chatRoomUUID) {
    this.languagePublicRoomUUID = chatRoomUUID;
  }

  /**
   * Store non-complex chats intended for fast browsing, only rendered in HISTORY chat mode
   * @param {ChatHistoryThread[]} chats
   */
  storeChatsHistory(chatsHistory) {
    this.chatHistory = (this.chatHistory || []).concat(chatsHistory);
  }

  /**
   * Store complete chat threads, usually that need to be opened or messaged within
   * @param {ChatThread} chatThread
   */
  storeChatThread(chatThread) {}

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
    // Get the chat itself
    const chatRoom = this.chatThreads[chatRoomUUID];
    if (!chatRoom || typeof chatRoom !== "object") {
      return true; // Chat room has never been fetched
    }
    // Does the chat have messages loaded? If not, it requires fetching
    if (!Array.isArray(chatRoom.messages)) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param {ChatThreadMessage} message
   */
  storeMessageReceived(message) {
    // Only continue if we have the chat room downloaded
    if (message.chatRoomUUID in this.chatThreads) {
      this.chatThreads[message.chatRoomUUID].messages.push(message);
      // Keep a maximum stack of 50 messages received. Why not?4
      if (this.chatThreads[message.chatRoomUUID].messages.length > 50) {
        this.chatThreads[message.chatRoomUUID].messages.shift();
      }
    }
  }

  setActiveChatRoom(chatRoomUUID) {
    this.activeChatRoomUUID = chatRoomUUID;
    if (this.chatRequiresFetching(chatRoomUUID)) {
      // Set chat to loading as it's being requested
      this.chatThreads[chatRoomUUID] = Object.assign(
        this.chatThreads[chatRoomUUID] || {},
        { isLoading: true, chatRoomUUID }
      );
    }
  }

  getDefaultChatRoom() {
    return (
      this.defaultChatRoom ||
      (this.defaultChatRoom = localStorage.getItem("defaultChatRoom"))
    );
  }
  getPublicChatRoom() {
    return this.chatThreads[this.activeLanguageShortCode];
  }

  isHistoryMode() {
    return this.chatModeStatus === ChatConstants.ChatModeStatuses.IS_HISTORY;
  }
  isChatMode() {
    return this.chatModeStatus === ChatConstants.ChatModeStatuses.IS_CHATTING;
  }
  isSearchMode() {
    return this.chatModeStatus === ChatConstants.ChatModeStatuses.IS_SEARCHING;
  }
  getSearchResults() {
    return this.searchResults || [];
  }
  setSearchResults(searchResults) {
    this.searchResults = searchResults;
  }

  isLoadingSearchResults(bool) {
    if ("boolean" === typeof bool) {
      this._isLoadingSearchResults = bool;
      console.log("bool", bool);
      return bool;
    }
    return this._isLoadingSearchResults;
  }
  setChatMode(chatModeStatus) {
    if (!Object.keys(ChatConstants.ChatModeStatuses).includes(chatModeStatus)) {
      return;
    }
    this.chatModeStatus = chatModeStatus;
    // Update to storage
    localStorage.setItem("chatModeStatus", chatModeStatus);
  }

  getChatMode() {
    if (!this.chatModeStatus) {
      let storedChatModeStatus = localStorage.getItem("chatModeStatus");
      return storedChatModeStatus
        ? storedChatModeStatus
        : ChatConstants.ChatModeStatuses.IS_CHATTING;
    }
    return this.chatModeStatus;
  }

  setSearchQuery(searchQuery) {
    this.searchQuery = searchQuery;
    this.searchQueryTimestamp = parseInt(Date.now() / 1000);
  }

  getLastSearchQueryTimestamp() {
    // Timestamp when the last search query was performed
    return (
      this.searchQueryTimestamp ||
      (this.searchQueryTimestamp = parseInt(Date.now() / 1000))
    );
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  isWaitingForData() {
    return Object.keys(this.chatThreads).length === 0;
  }

  storePreparedSearchApiCall({ timer, willExecuteAt }) {
    if (this.preparedSearchApiCallTimer) {
      clearTimeout(this.preparedSearchApiCallTimer);
    }
    this.preparedSearchApiCallTimer = timer;
  }

  canSendMessage() {
    // Check if it's authenticated
    return sessionStore.isAuthenticated();
  }
}

const chatStore = new ChatStore();

bindListeners();

chatStore.dispatchToken = dispatcher.register((action) => {
  const isLoadingChatResults = action.data.isLoadingChatResults;
  if ("boolean" === typeof isLoadingChatResults) {
    chatStore.isLoadingSearchResults(isLoadingChatResults);
  }
  switch (action.actionType) {
    case ActionTypes.CHAT_MESSAGE_RECEIVED:
      chatStore.storeMessageReceived(action.data.message);
      // Check for longeviness
      break;
    case ActionTypes.CHAT_MESSAGE_SENT:
      // Do nothing, for now
      break;
    case ActionTypes.CHAT_ROOM_CHANGE:
      chatStore.setActiveChatRoom(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_THREAD_DATA_RECEIVED:
      chatStore.storeChatThread(action.data);
      break;
    case ActionTypes.CHAT_HISTORY_RECEIVED:
      chatStore.storeChatsHistory(action.data.chatHistory);
      break;
    case ActionTypes.CHAT_THREAD_CLOSE:
      chatStore.closeOpenChat(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_MODE_CHANGE:
      chatStore.setChatMode(action.data.chatMode);
      break;
    case ActionTypes.CHAT_PUBLIC_ROOMS_RECEIVED:
      action.data.publicRooms.map(chatStore.storeChatThread);

      break;
    case ActionTypes.CHAT_SEARCH_RESULTS_CHANGED:
      chatStore.setSearchResults(action.data.searchResults);
      break;
    case ActionTypes.CHAT_SEARCH_QUERY:
      chatStore.setSearchQuery(action.data.searchQuery);

      break;
    case ActionTypes.CHAT_PREPARE_SEARCH_API_CALL:
      // Clear previous timeout
      chatStore.storePreparedSearchApiCall(action.data);
      break;
    default:
      break;
  }
  chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
