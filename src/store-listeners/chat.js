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
      default:
        break;
    }
  });
}
