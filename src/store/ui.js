import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import AppDrawerViews from "../constants/AppDrawerViews";

class UIStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.messages = [];
    this.sidebar = {
      isOpen: true,
      width: 320,
    };
    this.views = {
      current: "",
    };
    this.modals = {
      login: { isOpen: false },
      userProfile: {
        isOpen: false,
      },
    };
  }

  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  storeMessageReceived(message) {
    // Keep a maximum stack of 255 messages received. Why not?
    if (this.messages.length > 244) this.messages.shift();
    this.messages.push(message);
    this.lastMessageReceived = new Date().getTime();
  }
  storeMessageSent() {
    this.lastMessageSent = new Date().getTime();
  }

  getSidebar() {
    return this.sidebar;
  }
  sidebarIsOpen() {
    return this.sidebar.isOpen;
  }
  getSidebarWidth() {
    return this.sidebar.width;
  }
  toggleSidebar() {
    this.sidebar.isOpen = !this.sidebar.isOpen;
  }
  toggleLoginModal() {
    this.modals.login.isOpen = !this.modals.login.isOpen;
  }
  loginModalIsOpen() {
    return this.modals.login.isOpen;
  }

  setAppDrawerView(view) {
    if (!(view in AppDrawerViews)) {
      return;
    }

    this.appDrawerView = view;
    localStorage.setItem("appDrawerView", this.appDrawerView);
  }
  getAppDrawerView() {
    // When the drawer is freshly initialized, it shall return CHATTING on GLOBAL
    if (!this.appDrawerView) {
      let _appDrawerView = localStorage.getItem("appDrawerView");
      const _appDrawerViewExists = !!(_appDrawerView in AppDrawerViews);
      this.appDrawerView =
        _appDrawerView && _appDrawerViewExists
          ? _appDrawerView
          : AppDrawerViews.CHATTING;
      localStorage.setItem("appDrawerView", this.appDrawerView);
    }
    return this.appDrawerView;
  }

  toggleUserProfileModal() {
    this.modals.userProfile.isOpen = !this.modals.userProfile.isOpen;
  }

  /**
   * If true, a backdrop will cover everything but the app drawer.
   * @param {boolean} [bool] - Setter if specified
   */
  shouldFocusOnDrawer(bool) {
    if ("boolean" === typeof bool) {
      this._shouldFocusOnDrawer = bool;
    }
    return this._shouldFocusOnDrawer;
  }
}

const uiStore = new UIStore();

dispatcher.register((action) => {
  let willEmitOwnChange = true;
  switch (action.actionType) {
    case ActionTypes.UI.ON_LOGIN_MODAL_TOGGLED:
      uiStore.toggleLoginModal();
      break;
    case ActionTypes.UI.ON_SIDEBAR_TOGGLE:
      uiStore.toggleSidebar();
      break;
    case ActionTypes.UI.GOTO_VIEW:
      uiStore.setCurrentView(action.data);
      break;
    case ActionTypes.UI.USER_PROFILE_MODAL_TOGGLE:
      uiStore.toggleUserProfileModal();
      break;
    case ActionTypes.UI.FOCUS_ON_APP_DRAWER:
      uiStore.shouldFocusOnDrawer(true);
      break;
    case ActionTypes.UI.UNFOCUS_FROM_APP_DRAWER:
      uiStore.shouldFocusOnDrawer(false);
      break;
    case ActionTypes.UI.CHANGE_APP_DRAWER_VIEW:
      uiStore.setAppDrawerView(action.data.appDrawerView);
      break;
    default:
      willEmitOwnChange = false;
      break;
  }

  willEmitOwnChange && uiStore.emitChange(action.actionType, action.data);
});

export default uiStore;
