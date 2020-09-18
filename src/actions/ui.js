import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

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
