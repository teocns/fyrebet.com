import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";
import Currencies from "../constants/Currencies";
import ratesStore from "./rates";

import User from "../models/User";
const Errors = require("../constants/errors");
const CHANGE_EVENT = "change";

class SessionStore extends EventEmitter {
  /**
   * Determines if the user is authenticated
   * @type {boolean}
   */
  isAuthenticated;
  /**
   * Indicates if has the authentication token, hence authentication will be performed in the future
   * @type {boolean}
   */
  hasAuthenticationToken;
  /**
   * Authenticated user
   * @type {User}
   */
  user;
  /**
   * Suggests if an authentication attempt has been made
   * @type {boolean}
   */
  authenticationAttemptPerformed;
  /**
   * If an authentication attempt has finished (... AUTHENTICATE -> USER DATA | AUTHENTICATION_FAILED )
   */
  authenticationAttemptFinished;

  constructor(params) {
    super(params);
    this.isAuthenticated = false;

    if (this.getAuthenticationToken()) {
      this.hasAuthenticationToken = true;
    }
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

  /**
   * Authenticated user object
   * @returns {User}
   */
  getUser() {
    return this.user;
  }

  /**
   * Authenticated user object
   * @param {User} user
   */
  setUser(user) {
    this.isAuthenticated = !!user && user instanceof User && user.username;
    this.user = user;
    localStorage.setItem("authentication_token", user.authentication_token);
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

  storeSessionId({ sessionId }) {
    this.setSessionId(sessionId);
    this.isInitialized = true;
  }

  updateAvatar(avatar) {
    this.user.avatar = avatar;
  }

  willAuthenticate() {
    const authenticationToken = this.getAuthenticationToken();
    return (
      "string" === typeof authenticationToken &&
      authenticationToken.length === 64 &&
      !this.authenticationAttemptPerformed
    );
  }

  isAuthenticating() {
    return (
      this.authenticationAttemptPerformed && !this.authenticationAttempFinished
    );
  }

  onAuthenticationFailed() {
    this.authenticationAttemptPerformed = false;
    this.authenticationAttemptFinished = true;
  }
}

const sessionStore = new SessionStore();

sessionStore.dispatchToken = dispatcher.register((event) => {
  let willEmitChange = true;
  switch (event.actionType) {
    case ActionTypes.Session.USER_AVATAR_CHANGED:
      sessionStore.updateAvatar(event.data.avatar);
      break;
    case ActionTypes.Session.USER_DATA_RECEIVED:
      sessionStore.setUser(event.data.user);
      break;

    case ActionTypes.Session.AUTHENTICATION_TOKEN_RECEIVED:
      sessionStore.setAuthenticationToken(event.data);
      break;
    case ActionTypes.Session.ID_RECEIVED:
      sessionStore.storeSessionId({ sessionId: event.data.sessionId });
      break;

    case ActionTypes.Session.USER_LOGOUT:
      sessionStore.setAuthenticationToken(undefined);
      break;
    case ActionTypes.Session.AUTHENTICATION_FAILED:
      sessionStore.onAuthenticationFailed();
      break;
    case ActionTypes.Session.API_SUCCESS:
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
      willEmitChange = false;
      break; // do nothing
  }

  willEmitChange && sessionStore.emitChange(event.actionType, event.data);
});

export default sessionStore;
