import dispatcher from "../dispatcher";
import ChatThreadMessage from "../models/ChatThreadMessage";

import SoundEffects from "../constants/SoundEffects";

import useSound from "use-sound";
import ActionTypes from "../constants/ActionTypes";

export function raiseNotification(actionType, data) {
  dispatcher.dispatch({
    actionType,
    data,
  });
}

/**
 *
 * @param {ChatThreadMessage} message
 */
export const notifyMessageReceived = (message) => {
  // Play sound
  dispatcher.dispatch({
    actionType: ActionTypes.NOTIFY_MESSAGE_RECEIVED,
    data: {
      message,
    },
  });
};
