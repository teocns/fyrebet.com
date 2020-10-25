import React, { useEffect, useState } from "react";

import useSound from "use-sound";
import ActionTypes from "../../constants/ActionTypes";

import notificationStore from "../../store/notification";

import SoundEffectsList from "../../constants/SoundEffects";
import chatStore from "../../store/chat";
import { ChatModeStatuses } from "../../constants/Chat";
import ChatThreadMessage from "../../models/ChatThreadMessage";

const VOLUME = 0.2;

const ChatSoundEffects = () => {
  const [ActiveChat, setActiveChat] = useState(chatStore.getActiveChatThread());

  const [ChatMode, setChatMode] = useState(chatStore.getChatMode());

  const [messageReceivedInChat] = useSound(
    SoundEffectsList.CHAT_MESSAGE_RECEIVED_IN_CHAT,
    {
      volume: VOLUME,
    }
  );

  const [messageReceivedOutChat] = useSound(
    SoundEffectsList.CHAT_MESSAGE_RECEIVED_IN_CHAT,
    {
      volume: VOLUME,
    }
  );
  const [messageSent] = useSound(null);

  /**
   * @param {object} obj
   * @param {ChatThreadMessage} obj.message
   */
  const onMessageReceived = ({ message }) => {
    // Check if we're in the chat or outside
    if (
      ChatMode !== ChatModeStatuses.IS_CHATTING ||
      ActiveChat.chatRoomUUID !== message.chatRoomUUID
    ) {
      messageReceivedOutChat();
    } else {
      messageReceivedInChat();
    }
  };

  const onChatModeChanged = () => {
    setChatMode(chatStore.getChatMode());
  };

  const onActiveChatChanged = () => {
    setActiveChat(chatStore.getActiveChatThread());
  };

  useEffect(() => {
    notificationStore.addChangeListener(
      ActionTypes.NOTIFY_MESSAGE_RECEIVED,
      onMessageReceived
    );
    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onActiveChatChanged
    );
    chatStore.addChangeListener(
      ActionTypes.CHAT_MODE_CHANGE,
      onChatModeChanged
    );
    return () => {
      notificationStore.removeChangeListener(
        ActionTypes.NOTIFY_MESSAGE_RECEIVED,
        onMessageReceived
      );
      chatStore.removeChangeListener(
        ActionTypes.CHAT_ROOM_CHANGE,
        onActiveChatChanged
      );
      chatStore.removeChangeListener(
        ActionTypes.CHAT_MODE_CHANGE,
        onChatModeChanged
      );
    };
  });

  return null;
};

export default React.memo(ChatSoundEffects);
