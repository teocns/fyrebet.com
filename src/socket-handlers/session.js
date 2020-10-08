import dispatcher from "../dispatcher";

import * as sessionActions from "../actions/session";

import SocketEvents from "../constants/SocketEvents";
import Error from "../classes/Error";
const bindSessionSocketHandler = (socket) => {
  socket.on(SocketEvents.AUTHENTICATION_FAILED, () => {
    // Do nothing for now
  });

  socket.on(SocketEvents.SESSION_ID, (sessionId) => {
    sessionActions.onSessionIdReceived(sessionId);
    // sessionId received. Store it and send client data.
    setTimeout(() => {
      sessionActions.sendClientData();
    });
  });

  socket.on(SocketEvents.INITIAL_STATUS, (status) => {
    sessionActions.onInitialStatusReceived(status);
  });

  socket.on(SocketEvents.USER_DATA, (userData) => {
    sessionActions.onUserDataReceived(userData);
  });

  socket.on(SocketEvents.ERROR, (errorData) => {
    if (Error.inRespose(errorData))
      sessionActions.onApiError(new Error(errorData));
  });

  socket.on(SocketEvents.SUCCESS, (successMessage) => {
    sessionActions.onApiSuccess(successMessage);
  });

  socket.on(SocketEvents.USER_AVATAR_CHANGED, (avatar) => {
    sessionActions.onAvatarChanged(avatar);
  });
};

export default bindSessionSocketHandler;
