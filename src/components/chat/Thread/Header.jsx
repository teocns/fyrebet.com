import React, { useState } from "react";
import chatStore from "../../../store/chat";
import ChatThread from "../../../models/ChatThread";
import { useEffect } from "react";
import ActionTypes from "../../../constants/ActionTypes";
import { Skeleton } from "@material-ui/lab";
import GoBackToHistoryButton from "../GoBackToHistoryButton";
import LanguagePicker from "../../pickers/Language";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Avatar, Typography, IconButton } from "@material-ui/core";
import { Language, MoreVert } from "@material-ui/icons";

import * as ChatConstants from "../../../constants/Chat";
import { motion } from "framer";
import assetUrl from "../../../helpers/assetUrl";

const useStyles = makeStyles((theme) => {
  return {
    flag: {
      width: "1.25rem",
      height: "1.25rem",
    },
    icon: {
      width: 22,
      height: 22,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  };
});

const ChatThreadHeader = () => {
  const [ActiveChat, setActiveChat] = useState(chatStore.getActiveChatThread());

  const isLoading = !(ActiveChat instanceof ChatThread) || ActiveChat.isLoading;
  const onChatThreadChanged = () => {
    setActiveChat(chatStore.getActiveChatThread());
  };

  const bindEventListeners = () => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatThreadChanged
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onChatThreadChanged
    );
  };
  const unbindEventListeners = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatThreadChanged
    );

    chatStore.removeChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onChatThreadChanged
    );
  };
  useEffect(() => {
    bindEventListeners();
    return unbindEventListeners;
  });

  const theme = useTheme();

  const renderChatName = () => {
    // If the chat is public, render a dropdown
    if (ActiveChat.chatRoomType === ChatConstants.Types.PUBLIC)
      return <LanguagePicker asIcon={false} />;
    return <Typography variant="body2"> {ActiveChat.chatName}</Typography>;
  };

  const classes = useStyles();
  const renderChatInfo = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "start",
            flex: 1,
          }}
        >
          <Skeleton
            className={classes.icon}
            variant="circle"
            animation="wave"
          />
          <Skeleton variant="text" width={8 * theme.typography.fontSize} />
        </div>
      );
    }

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "start",
          flex: 1,
        }}
      >
        <Avatar className={classes.icon} src={assetUrl(ActiveChat.iconUrl)} />
        {renderChatName()}
      </div>
    );
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      }}
    >
      <GoBackToHistoryButton />
      {renderChatInfo()}
      <IconButton size="small">
        <MoreVert />
      </IconButton>
    </div>
  );
};

export default ChatThreadHeader;
