import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.currentChatRoom = undefined;
    this.chatRooms = {}; // Indexed by UUID. Public chats will always be here.
    this.messages = [];
  }

  storeAvailableChatRooms({ chatRooms }) {
    this.chatRooms = chatRooms;
  }
  getLastChosenChatroom() {
    return localStorage.getItem("lastChatRoomUUID");
  }
  setCurrentChatRoom(chatRoomUUID) {
    //this.currentChatRoom = this.chatRooms[chatRoomUUID];
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
  getUserChatMessages() {
    return this.messages;
  }

  storeMessageReceived(message) {
    // Keep a maximum stack of 50 messages received. Why not?
    if (this.messages.length >= 50) {
      this.messages.shift();
    }
    this.messages.push(message);
    this.lastMessageReceived = new Date().getTime();
  }

  storeInitialMessages(messagesArray) {
    this.isMessagesLoaded = true;
    this.messages = messagesArray;
  }
}

const chatStore = new ChatStore();

chatStore.dispatchToken = dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.CHAT_MESSAGE_RECEIVED:
      chatStore.storeMessageReceived(action.data);
      // Check for longeviness
      break;
    case ActionTypes.CHAT_MESSAGE_SENT:
      // Do nothing, for now
      break;
    case ActionTypes.CHAT_STATUS_RECEIVED:
      // We receive the users' available chatRooms as status
      this.storeAvailableChatRooms(action.data);
      break;
    default:
      break;
  }
  chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
