import keyMirror from "keymirror";

const ActionTypes = keyMirror({
  USER_DATA_RECEIVED: null,
  USER_AVATAR_CHANGED: null,
  USER_UPDATED: null,
  CHAT_MESSAGE_RECEIVED: null,
  USER_LOGOUT: null,
  AUTHENTICATION_TOKEN_RECEIVED: null,
  INITIAL_STATUS_RECEIVED: null,
  ID_RECEIVED: null,
  API_ERROR: null,
});

export default ActionTypes;
