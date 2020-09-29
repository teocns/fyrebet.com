import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";
import Currencies from "../constants/Currencies";
import ratesStore from "./rates";
const Errors = require("../constants/errors");
const CHANGE_EVENT = "change";

class SessionStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;

    this.connectionInitiatedTimestamp = undefined; // When
    this._isAuthenticated = false;
    this.user = {
      authentication_token: localStorage.authentication_token,
      email: undefined,
      username: undefined,
    };
    this.authentication_token_sent_timestamp = false;
    this.sessionId = undefined;
  }
  addChangeListener(event, callback) {
    this.on(event ?? CHANGE_EVENT, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event ?? CHANGE_EVENT, callback);
  }

  emitChange(event, data) {
    this.emit(event ?? CHANGE_EVENT, data);
  }

  storeMessageReceived(message) {
    // Keep a maximum stack of 255 messages received. Why not?
    if (this.chatMessages.length > 244) this.chatMessages.shift();
    this.chatMessages.push(message);
    this.lastMessageReceived = new Date().getTime();
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem("authentication_token", user.authentication_token);
    this._isAuthenticated = true;
  }

  getAuthenticationToken() {
    return localStorage.getItem("authentication_token");
  }
  setAuthenticationToken(authentication_token) {
    this.user.authentication_token = authentication_token;
    localStorage.setItem("authentication_token", authentication_token);
  }
  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  onInitialStatusReceived({ sessionId }) {
    this.setSessionId(sessionId);
    this.isInitialized = true;
  }
  isAuthenticated() {
    return !!this.user.username;
  }

  updateAvatar(avatar) {
    this.user.avatar = avatar;
  }
}

const sessionStore = new SessionStore();

sessionStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.SESSION_USER_AVATAR_CHANGED:
      sessionStore.updateAvatar(event.data.avatar);
      break;
    case ActionTypes.SESSION_USER_DATA_RECEIVED:
      sessionStore.setUser(event.data);
      break;

    case ActionTypes.SESSION_AUTHENTICATION_TOKEN_RECEIVED:
      sessionStore.setAuthenticationToken(event.data);
      break;
    case ActionTypes.SESSION_INITIAL_STATUS_RECEIVED:
      sessionStore.onInitialStatusReceived({ sessionId: event.data.sessionId });
      break;

    case ActionTypes.SESSION_USER_LOGOUT:
      sessionStore.setAuthenticationToken(undefined);
      break;

    case ActionTypes.API_SUCCESS:
      // Snackbar component will subscribe to this
      setTimeout(() => {
        dispatcher.dispatch({
          actionType: ActionTypes.UI_SHOW_SNACKBAR,
          data: {
            message: Errors[event.data] || event.data,
            severity: "success",
          },
        });
      });
      break;
    default:
      break; // do nothing
  }
  sessionStore.emitChange(event.actionType, event.data);
});

export default sessionStore;
