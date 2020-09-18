import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import { sendMessage as socketSendMessage } from "../socket";
export function sendMessage(data) {
  //console.log("sending message from user chat actions");

  socketSendMessage(SocketEvents.SEND_CHAT_MESSAGE, data);
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_SENT,
    data: data,
  });
}

export function onChatMessageReceived(messageData) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_MESSAGE_RECEIVED,
    data: messageData,
  });
}

export function onChatStatusReceived(chatStatus) {
  dispatcher.dispatch({
    actionType: ActionTypes.CHAT_STATUS_RECEIVED,
    data: chatStatus,
  });
}
