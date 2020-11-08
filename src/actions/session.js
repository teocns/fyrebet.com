import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Fetcher from "../classes/fetcher";
import SocketEvents from "../constants/SocketEvents";

import sessionStore from "../store/session";
import languageStore from "../store/language";

import { sendMessage } from "../socket";
import Environment from "../constants/Environment";
import Error from "../classes/Error";
import SessionClientData from "../models/SessionClientData";
import User from "../models/User";
import ClientData from "../models/SessionClientData";

export function userEmailIsRegistered(email) {
  return new Promise((resolve) => {
    Fetcher.post("/is-email-registered/", { email })
      .then((isRegistered) => {
        resolve(isRegistered);
      })
      .catch((error) => {
        // Show snackbar
        window.showSnackbar(); // TODO: Change to UI store action dispatch
        //reject(error);
      });
  });
}

export function logout() {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.USER_LOGOUT,
  });
  window.location.reload();
}

export async function userAuthenticate({ email, password }) {
  try {
    let result = await Fetcher.post("/authenticate", {
      email: email,
      password: password,
    });
    if (result.loggedIn) {
      setAuthenticationToken(result.authentication_token);
    }
    return true;
  } catch (e) {
    throw e;
    // dispatcher.dispatch({
    //   actionType: ActionTypes.API_ERROR, // Was previously window.showSnackbar()
    // });
  }
}

export function onAuthenticationFailed() {
  dispatcher.dispatch({
    actionType: ActionTypes.AUTHENTICATION_FAILED,
  });
}

export function setAuthenticationToken(authenticationToken) {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.AUTHENTICATION_TOKEN_RECEIVED,
    data: authenticationToken,
  });
  sendMessage(SocketEvents.AUTHENTICATE, authenticationToken); // Send authentication token to socket
}

export function onInitialStatusReceived(status) {
  console.log(status);
  dispatcher.dispatch({
    actionType: ActionTypes.Session.INITIAL_STATUS_RECEIVED,
    data: status,
  });
  // TODO: move in rates actions
  if ("rates" in status) {
    dispatcher.dispatch({
      actionType: ActionTypes.RATES_UPDATED,
      data: {
        rates: status.rates,
      },
    });
  }
}

export function onUserDataReceived(userData) {
  const user = new User(userData);
  // Dispatch user data received and balance changes
  dispatcher.dispatch({
    actionType: ActionTypes.Session.USER_DATA_RECEIVED,
    data: { user },
  });
  if (user && user.balances)
    // Fire balance changes
    dispatcher.dispatch({
      actionType: ActionTypes.User.BALANCE_CHANGED,
      data: user.balances,
    });
}

export function onApiError(Error) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_SHOW_SNACKBAR,
    data: { message: Error.toString(), severity: "error" },
  });
}

export function onApiSuccess(successMessage) {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.API_ERROR,
    data: successMessage,
  });
}

export function updateAvatar(base64) {
  Fetcher.post(`/update-avatar`, {
    b64: base64,
  });
}

export function onAvatarChanged(avatar) {
  console.log("I got my avatar changed bro", avatar);
  dispatcher.dispatch({
    actionType: ActionTypes.User.AVATAR_CHANGED,
    data: { avatar },
  });
}
export function sendClientData() {
  const clientData = new ClientData();
  // Gather browser info
  if (window.navigator) {
    clientData.userAgent = window.navigator.userAgent;
    clientData.languages = window.navigator.languages;
    clientData.language = window.navigator.language;
  }
  const authenticationToken = sessionStore.getAuthenticationToken();

  if (
    typeof authenticationToken === "string" &&
    authenticationToken.length === 64
  ) {
    // Try to authenticate
    clientData.authenticationToken = authenticationToken;
  }
  //data.appLanguage = languageStore.getLang();
  sendMessage(SocketEvents.CLIENT_DATA, clientData);
}

export const onSessionIdReceived = (sessionId) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.ID_RECEIVED,
    data: { sessionId },
  });
};
