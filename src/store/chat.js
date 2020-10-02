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
  getActiveChatMessages() {
    return this.activeChatRoom ? this.activeChatRoom.messages : undefined;
  }

  getChats() {
    return this.chatRooms;
  }
  storeChats(chats) {
    this.chatRooms = { ...this.chatRooms, ...chats };
  }
  hasChat(chatRoomUUID) {
    return (
      undefined !==
      this.openChats.find(({ _chatRoomUUID }) => _chatRoomUUID === chatRoomUUID)
    );
  }
  storeMessageReceived(message) {
    // Keep a maximum stack of 50 messages received. Why not?4
    if (this.activeChatRoom.messages.length >= 50) {
      this.activeChatRoom.messages.shift();
    }
    this.activeChatRoom.messages.push(message);
    this.activeChatRoom.lastMessageReceived = new Date().getTime();
  }

  storeInitialMessages(messagesArray) {
    this.isMessagesLoaded = true;
    this.activeChatRoom.messages = messagesArray;
  }
  changeChatRoom(chatRoomUUID) {
    // Fires when the user changes the chat room from UI
    this._isChatRoomLoading = true;
    this.activeChatRoom = chatRoomUUID;
  }
  storeChatData(chatData) {
    // Called once the data of the requested chat room has been received from the server
    this._isChatRoomLoading = false; // We are not waiting anymore for the data

    this.activeChatRoom = chatData;
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
    case ActionTypes.CHAT_OPEN_ROOMS_RECEIVED:
      chatStore.storeOpenChats(action.data.recentChats);
      break;
    case ActionTypes.UI_CHANGE_LANGUAGE:
      const { shortCode } = action.data;
      // Request chatRoom
      setTimeout(() => {
        dispatcher.dispatch({
          actionType: ActionTypes.CHAT_ROOM_CHANGE,
          data: {
            chatRoomUUID: shortCode,
          },
        });
      });
      break;
    // case ActionTypes.CHAT_STATUS_RECEIVED:
    //   // We receive the users' available chatRooms as status
    //   chatStore.storeAvailableChatRooms(action.data);
    //   break;
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
