import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import Langs from "../constants/Langs";
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

  getLang() {
    if (undefined === this.lang) {
      let storedLang = localStorage.getItem("lang");
      if (storedLang) {
        return (this.lang = storedLang);
      } else {
        
        this.setLang(Langs.EN.shortCode);
        return this.lang;
      }
    }
    return this.lang;
  }
  setLang(lang) {
    if (!(lang in Langs)) {
      return;
    }
    // Save to local storage
    localStorage.setItem("lang", lang);
    this.lang = lang;
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
  setCurrentView(view) {
    this.views.current = view;
  }
  getCurrentView() {
    return this.views.current;
  }
  toggleUserProfileModal() {
    this.modals.userProfile.isOpen = !this.modals.userProfile.isOpen;
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
    case ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE:
      uiStore.toggleUserProfileModal();
      break;
    case ActionTypes.UI_CHANGE_LANGUAGE:
      uiStore.setLang(action.data.shortCode);
      break;
    default:
      break;
  }

  uiStore.emitChange(action.actionType, action.data);
});

export default uiStore;
