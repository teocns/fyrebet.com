import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import Langs from "../constants/Langs";

export function toggleSidebar(willOpen) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_ON_SIDEBAR_TOGGLE,
    data: willOpen,
  });
}

export function toggleLoginModal() {
  console.log("toggling login modal");
  dispatcher.dispatch({
    actionType: ActionTypes.UI_ON_LOGIN_MODAL_TOGGLED,
  });
}

export function setSidebarView(VIEW) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_SIDEBAR_CONTENT_CHANGING,
    data: VIEW,
  });
}

export function onSidebarViewChanged(VIEW) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_SIDEBAR_CONTENT_CHANGED,
  });
}

export function showSnackbar(message, severity) {
  severity = typeof severity !== "string" ? "" : severity;
  message = typeof message !== "string" ? "" : message;
  severity = !severity && !message ? "error" : severity;
  message = !message
    ? "An error occured, please verify your connection and try again."
    : message;

  dispatcher.dispatch({
    actionType: ActionTypes.UI_SHOW_SNACKBAR,
    data: {
      message: message,
      severity: severity,
    },
  });
}

export function gotoView(VIEW) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_GOTO_VIEW,
    data: VIEW,
  });
}

export function openUserProfileModal(userUUID) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE,
    data: { userUUID },
  });
}

export function changeLanguage(shortCode) {
  if (!(shortCode in Langs)) {
    return;
  }

  dispatcher.dispatch({
    actionType: ActionTypes.LANGUAGE_CHANGE,
    data: { shortCode },
  });
}

export function focusOnAppDrawer() {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_FOCUS_ON_APP_DRAWER,
  });
}

export function unfocusOnAppDrawer() {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_UNFOCUS_FROM_APP_DRAWER,
  });
}

export function changeAppDrawerView(appDrawerView) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI_CHANGE_APP_DRAWER_VIEW,
    data: { appDrawerView },
  });
}
