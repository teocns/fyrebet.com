import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

const DEFAULT_EVENT = "change";

class ChatStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.activeChatRoom = undefined;
    this.chatRooms = {}; // Indexed by UUID. Public chats will always be here.
    this.messages = [];
  }

  storeAvailableChatRooms({ chatRooms }) {
    this.chatRooms = chatRooms;
  }
  getLastChosenChatRoom() {
    return localStorage.getItem("lastChatRoomUUID");
  }
  setCurrentChatRoom(chatRoomUUID) {
    //this.currentChatRoom = this.chatRooms[chatRoomUUID];
  }
  getActiveChatRoom() {
    return this.activeChatRoom;
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
  changeChatRoom(chatRoomUUID) {
    // Fires when the user changes the chat room from UI
    this._isChatRoomLoading = true;
    this.activeChatRoom = chatRoomUUID;
  }
  storeChatData(chatData) {
    // Called once the data of the requested chat room has been received from the server
    this._isChatRoomLoading = false; // We are not waiting anymore for the data
  }
  isChatRoomLoading() {
    return this._isChatRoomLoading;
  }
  getDefaultChatRoom() {
    return (
      this.defaultChatRoom ||
      (this.defaultChatRoom = localStorage.getItem("defaultChatRoom"))
    );
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
    case ActionTypes.CHAT_ROOM_CHANGE:
      chatStore.changeChatRoom(action.data.chatRoomUUID);
      break;
    case ActionTypes.CHAT_ROOM_DATA_RECEIVED:
      chatStore.storeChatData(action.data);
      break;
    case ActionTypes.CHAT_STATUS_RECEIVED:
      // We receive the users' available chatRooms as status
      chatStore.storeAvailableChatRooms(action.data);
      break;
    default:
      break;
  }
  chatStore.emitChange(action.actionType, action.data);
});

export default chatStore;
