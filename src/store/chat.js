import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Langs from "../constants/Langs";
import * as ChatConstants from "../constants/Chat";

import bindListeners from "../store-listeners/chat";

const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.activeChatRoomUUID = undefined;
    this.chatRooms = {}; // Indexed by UUID. Public chats will always be here.
    this.openChatsUUIDs = []; // Array storing only OPEN chat rooms (in the mini).
    this.publicRoomsUUIDs = []; // Array of keys!
    this.languagePublicRoomUUID = undefined; // The global chat room, relative to the client's language.

    let self = this;
    window.chatrooms = () => console.log(self.chatRooms);
    window.openchats = () => console.log(self.openChatsUUIDs);
    window.activechat = () => console.log(self.activeChatRoomUUID);
    window.publicrooms = () => console.log(self.publicRoomsUUIDs);
  }

  storeAvailableChatRooms({ chatRooms }) {
    if (!chatRooms) {
      return;
    }
    this.chatRooms = chatRooms;
  }
  getLastChosenChatRoom() {
    return localStorage.getItem("lastChatRoomUUID");
  }
  getActiveChatRoom() {
    if (this.activeChatRoomUUID && this.activeChatRoomUUID in this.chatRooms)
      return this.chatRooms[this.activeChatRoomUUID];
    return undefined;
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
  getActiveChatMessages() {
    const activeChat = this.getActiveChatRoom();
    return activeChat &&
      Array.isArray(activeChat.messages) &&
      !activeChat.isLoading
      ? activeChat.messages
      : [];
  }

  getOpenChats() {
    // Returns only open chats (in the mini)
    const ret = {};
    for (let chatRoomUUID of this.openChatsUUIDs) {
      ret[chatRoomUUID] = this.chatRooms[chatRoomUUID];
    }
    return ret;
  }
  getChats() {
    return this.chatRooms;
  }

  setLanguagePublicRoom(chatRoomUUID) {
    this.languagePublicRoomUUID = chatRoomUUID;
  }

  storeChats(chats, open) {
    if (Array.isArray(chats)) {
      // Multiple chats ARRAY
      chats.map((chat) => {
        this.chatRooms[chat.chatRoomUUID] = chat;
        chat.chatRoomUUID in Object.keys(Langs) &&
          this.setLanguagePublicRoom(chat.chatRoomUUID);
        open && this.openChatsUUIDs.push(chat.chatRoomUUID);
      });
    } else if (typeof chats === "object") {
      if ("chatRoomUUID" in chats) {
        // Single chat OBJECT.
        this.chatRooms[chats.chatRoomUUID] = chats;
        chats.chatRoomUUID in Object.keys(Langs) &&
          this.setLanguagePublicRoom(chats.chatRoomUUID);
        open && this.openChatsUUIDs.push(chats.chatRoomUUID);
      } else {
        // Multiple chats OBJECT
        let allKeys = Object.keys(chats);
        let self = this;
        allKeys.map((key) => {
          if (key.length === 36) {
            self.chatRooms[key] = chats[key];
            open && this.openChatsUUIDs.push(key);
            chats.chatRoomUUID in Object.keys(Langs) &&
              this.setLanguagePublicRoom(key);
          }
        });
      }
    }
  }
  hasChat(chatRoomUUID) {
    return (
      undefined !==
      this.openChatsUUIDs.find(
        ({ _chatRoomUUID }) => _chatRoomUUID === chatRoomUUID
      )
    );
  }

  chatRequiresFetching(chatRoomUUID) {
    // Get the chat itself
    const chatRoom = this.chatRooms[chatRoomUUID];
    if (!chatRoom || typeof chatRoom !== "object") {
      return true; // Chat room has never been fetched
    }
    // Does the chat have messages loaded? If not, it requires fetching
    if (!Array.isArray(chatRoom.messages)) {
      return true;
    }
    return false;
  }
  storeMessageReceived(message) {
    // Keep a maximum stack of 50 messages received. Why not?4
    if (message.chatRoomUUID in this.chatRooms) {
      this.chatRooms[message.chatRoomUUID].messages.push(message);
      if (this.chatRooms[message.chatRoomUUID].messages.length > 50) {
        this.chatRooms[message.chatRoomUUID].messages.shift();
      }
    }
  }

  setActiveChatRoom(chatRoomUUID) {
    this.activeChatRoomUUID = chatRoomUUID;
    this.addOpenChat(chatRoomUUID);
    if (this.chatRequiresFetching(chatRoomUUID)) {
      // Set chat to loading as it's being requested
      this.chatRooms[chatRoomUUID] = { isLoading: true, chatRoomUUID };
    }
  }
  addOpenChat(chatRoomUUID) {
    // const indexAlreadyExists = this.openChats.indexOf(chatRoomUUID);
    !this.openChatsUUIDs.includes(chatRoomUUID) &&
      this.openChatsUUIDs.push(chatRoomUUID);
  }
  closeOpenChat(chatRoomUUID) {
    delete this.chatRooms[chatRoomUUID];
    const ind = this.openChatsUUIDs.indexOf(chatRoomUUID);
    if (ind > -1) {
      this.openChatsUUIDs.splice(ind, 1);
      return true;
    }
    return false;
  }
  getDefaultChatRoom() {
    return (
      this.defaultChatRoom ||
      (this.defaultChatRoom = localStorage.getItem("defaultChatRoom"))
    );
  }
  getPublicChatRoom() {
    return this.chatRooms[this.activeLanguageShortCode];
  }

  isLoadingChat() {
    return !this.isMessagesLoaded;
  }
}

const chatStore = new ChatStore();

bindListeners();

chatStore.dispatchToken = dispatcher.register((action) => {
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
    case ActionTypes.CHAT_ROOM_DATA_RECEIVED:
      chatStore.storeChats(action.data);
      break;
    case ActionTypes.CHAT_OPEN_ROOMS_CHANGED:
      chatStore.storeChats(action.data.openChats, true);
      break;
    case ActionTypes.CHAT_ROOM_CLOSE:
      chatStore.closeOpenChat(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_PUBLIC_ROOMS_RECEIVED:
      chatStore.storeChats(action.data.publicRooms);
      break;
    default:
      break;
  }
  chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
