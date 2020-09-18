import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Fetcher from "../helpers/fetcher";
import SocketEvents from "../constants/SocketEvents";

import sessionStore from "../store/session";

import { sendMessage } from "../socket";
import Environment from "../constants/Environment";

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
    actionType: ActionTypes.SESSION_USER_LOGOUT,
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

export function setAuthenticationToken(authenticationToken) {
  dispatcher.dispatch({
    actionType: ActionTypes.SESSION_AUTHENTICATION_TOKEN_RECEIVED,
    data: authenticationToken,
  });
  sendMessage(SocketEvents.AUTHENTICATE, authenticationToken); // Send authentication token to socket
}

export function onInitialStatusReceived(status) {
  console.log(status);
  dispatcher.dispatch({
    actionType: ActionTypes.SESSION_INITIAL_STATUS_RECEIVED,
    data: status,
  });

  if ("chat" in status) {
    dispatcher.dispatch({
      actionType: ActionTypes.CHAT_STATUS_RECEIVED,
      data: status.chat,
    });
  }

  if ("rates" in status) {
    dispatcher.dispatch({
      actionType: ActionTypes.RATES_UPDATED,
      data: {
        rates: status.rates,
      },
    });
  }

  const authenticationToken = sessionStore.getAuthenticationToken();

  if (typeof authenticationToken === "string" && authenticationToken.length) {
    // Try to authenticate
    sendMessage(SocketEvents.AUTHENTICATE, authenticationToken);
  }
}

export function onUserDataReceived(userData) {
  // Dispatch user data received and balance changes
  dispatcher.dispatch({
    actionType: ActionTypes.SESSION_USER_DATA_RECEIVED,
    data: userData,
  });
  if (userData && userData.balances)
    // Fire balance changes
    dispatcher.dispatch({
      actionType: ActionTypes.USER_BALANCE_CHANGED,
      data: userData.balances,
    });
}

export function onApiError(errorMessage) {
  console.log(errorMessage);
  dispatcher.dispatch({
    actionType: ActionTypes.API_ERROR,
    data: errorMessage,
  });
}

export function onApiSuccess(successMessage) {
  dispatcher.dispatch({
    actionType: ActionTypes.API_ERROR,
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
    actionType: ActionTypes.SESSION_USER_AVATAR_CHANGED,
    data: { avatar },
  });
}
