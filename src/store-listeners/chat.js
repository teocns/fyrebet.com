import * as chatActions from "../actions/chat";
import dispatcher from "../dispatcher";
const { default: ActionTypes } = require("../constants/ActionTypes");
// Listen to UI change

// Initialize this in store
export default function () {
  dispatcher.register((action) => {
    switch (action.actionType) {
      case ActionTypes.LANGUAGE_CHANGE:
        chatActions.onLanguageChanged(action.data.shortCode);
        break;
      case ActionTypes.SESSION_INITIAL_STATUS_RECEIVED:
        // Check if contains public chats
        if (action.data && "chatRooms" in action.data) {
          // Contains open chats, let's fire update vent
          setTimeout(() => {
            chatActions.onPublicRoomsReceived(action.data);
          });
        }
        break;
      case ActionTypes.SESSION_USER_DATA_RECEIVED:
        // Check if contains open chats
        if (action.data && "openChats" in action.data) {
          // Contains open chats, let's fire update vent
          chatActions.onUserOpenChatsReceived(action.data.openChats);
        }
        break;
      default:
        break;
    }
  });
}
