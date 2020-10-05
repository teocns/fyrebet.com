import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import * as ChatConstants from "../constants/Chat";
import { sendMessage } from "../socket";

import bindListeners from "../store-listeners/chat";

const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.activeChatRoom = undefined;
    this.chatRooms = {}; // Indexed by UUID. Public chats will always be here.
    this.openChats = []; // Array storing only OPEN chat rooms (in the mini).
    let self = this;
    window.chatrooms = () => console.log(self.chatRooms);
    window.openchats = () => console.log(self.openChats);
    window.activechat = () => console.log(self.activeChatRoom);
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
    if (this.activeChatRoom && this.activeChatRoom in this.chatRooms)
      return this.chatRooms[this.activeChatRoom];
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
    return activeChat ? activeChat.messages : undefined;
  }

  getOpenChats() {
    // Returns only open chats (in the mini)
    const ret = {};
    for (let chatRoomUUID of this.openChats.reverse()) {
      ret[chatRoomUUID] = this.chatRooms[chatRoomUUID];
    }
    return ret;
  }
  getChats() {
    return this.chatRooms;
  }

  reorderChats(chatUUID, newIndex) {}
  storeChats(chats) {
    if (Array.isArray(chats)) {
      chats.map((chat) => {
        this.chatRooms[chat.chatRoomUUID] = chat;
      });
    } else if (typeof chats === "object") {
      if ("chatRoomUUID" in chats) {
        // Single chat.
        this.chatRooms[chats.chatRoomUUID] = chats;
      } else {
        let allKeys = Object.keys(chats);
        let self = this;
        allKeys.map((key) => {
          if (key.length === 36) {
            self.chatRooms[key] = chats[key];
          }
        });
      }
    }
  }
  hasChat(chatRoomUUID) {
    return (
      undefined !==
      this.openChats.find(({ _chatRoomUUID }) => _chatRoomUUID === chatRoomUUID)
    );
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
    this.activeChatRoom = chatRoomUUID;
    this.addOpenChat(chatRoomUUID);
  }
  addOpenChat(chatRoomUUID) {
    const indexAlreadyExists = this.openChats.indexOf(chatRoomUUID);
    // By opening a chat, it will display in mini and player will be pushed into the socket room.
    if (indexAlreadyExists !== -1) {
      // Move to the first position
      this.openChats.splice(
        0,
        0,
        this.openChats.splice(indexAlreadyExists, 1)[0]
      );
    } else {
      this.openChats.push(chatRoomUUID);
    }
  }
  closeOpenChat(chatRoomUUID) {
    delete this.chatRooms[chatRoomUUID];
    const ind = this.openChats.indexOf(chatRoomUUID);
    if (ind > -1) {
      this.openChats.splice(ind, 1);
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
    const chats = this.getChats();
    for (let chatRoomUUID of Object.keys(chats)) {
      const chat = chats[chatRoomUUID];
      if (chat.chatRoomType === ChatConstants.Types.PUBLIC) {
        return chat;
      }
    }
  }
}

const chatStore = new ChatStore();

bindListeners();

chatStore.dispatchToken = dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.CHAT_MESSAGE_RECEIVED:
      chatStore.storeMessageReceived(action.data);
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
      chatStore.storeChats(action.data.recentChats);
      break;
    case ActionTypes.CHAT_ROOM_CLOSE:
      chatStore.closeOpenChat(action.data.chatRoomUUID);
      break;

    case ActionTypes.SESSION_INITIAL_STATUS_RECEIVED:
      // Look for public rooms
      if (
        "chatRooms" in action.data &&
        typeof action.data.chatRooms === "object"
      ) {
        chatStore.storeAvailableChatRooms(action.data.chatRooms);
      }
      break;
    default:
      break;
  }
  chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
