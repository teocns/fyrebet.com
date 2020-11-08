import keyMirror from "keymirror";

const ActionTypes = keyMirror({
  ON_LOGIN_MODAL_TOGGLED: null,
  ON_LOGIN_MODAL_OPENED: null,
  ON_LOGIN_MODAL_CLOSED: null,
  ON_SIDEBAR_TOGGLE: null,
  USER_PROFILE_MODAL_TOGGLE: null,
  SIDEBAR_CONTENT_CHANGING: null,
  SIDEBAR_CONTENT_CHANGED: null,
  SHOW_SNACKBAR: null,
  GOTO_VIEW: null,
  TOGGLE_PRINT_RATES_USD: null,
  ERROR: null,
  UNFOCUS_FROM_APP_DRAWER: null,
  FOCUS_ON_APP_DRAWER: null,
  CHANGE_APP_DRAWER_VIEW: null,
});

export default ActionTypes;
