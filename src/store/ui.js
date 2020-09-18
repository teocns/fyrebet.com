import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

const CHANGE_EVENT = "change";

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
    this.modals = { login: { isOpen: false } };
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
  setCurrentView(view) {
    this.views.current = view;
  }
  getCurrentView() {
    return this.views.current;
  }
}

const uiStore = new UIStore();

dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.UI_ON_LOGIN_MODAL_TOGGLED:
      uiStore.toggleLoginModal();
      break;
    case ActionTypes.UI_ON_SIDEBAR_TOGGLE:
      uiStore.toggleSidebar();
      break;
    case ActionTypes.UI_GOTO_VIEW:
      uiStore.setCurrentView(action.data);
      break;
    default:
      break;
  }

  uiStore.emitChange(action.actionType, action.data);
});

export default uiStore;
