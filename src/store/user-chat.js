import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

const DEFAULT_EVENT = "change";

class UserChatStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.isMessagesLoaded = false;
    this.messages = [];
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

const userChatStore = new UserChatStore();

userChatStore.dispatchToken = dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.CHAT_MESSAGE_RECEIVED:
      userChatStore.storeMessageReceived(action.data);
      // Check for longeviness
      break;
    case ActionTypes.CHAT_MESSAGE_SENT:
      // Do nothing, for now
      break;
    case ActionTypes.CHAT_STATUS_RECEIVED:
      const messages = action.data.messages;
      userChatStore.storeInitialMessages(messages);
      break;
    default:
      break;
  }
  userChatStore.emitChange(action.actionType, action.data);
});

export default userChatStore;
