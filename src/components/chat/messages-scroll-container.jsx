import React, { useEffect } from "react";
import * as chatActions from "../../actions/chat";
import chatStore from "../../store/chat";

const MessagesScrollContainer = () => {
  const onMessageReceived = () => {
    // Push message to the stack of 50 messges in the chat.
    setMessages([...chatStore.getUserChatMessages()]);
  };
  const bindEventListeners = () => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_STATUS_RECEIVED,
      onChatMessagesLoaded
    ); // When component mounted, subscribe to dispatcher events to receive each new message.

    chatStore.addChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onMessageReceived
    ); // When component mounted, subscribe to dispatcher events to receive each new message.
  };

  const unbindEventListeners = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_STATUS_RECEIVED,
      onChatMessagesLoaded
    ); // When component mounted, subscribe to dispatcher events to receive each new message.

    // On component unmounting, remove previous listener.
    chatStore.removeChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onMessageReceived
    );
  };

  useEffect(() => {
    bindEventListeners();
    return unbindEventListeners;
  });
  return <div></div>;
};

export default MessagesScrollContainer;
