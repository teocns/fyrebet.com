import React, { useEffect, useState, useRef } from "react";
import * as chatActions from "../../actions/chat";
import chatStore from "../../store/chat";
import ActionTypes from "../../constants/ActionTypes";

import { motion } from "framer-motion";
import UserAvatarWithActions from "../user/user-avatar";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../themes/fyrebet/fyrebet";
import {
  TextField,
  Divider,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import assetUrl from "../../helpers/assetUrl";
import ChatHistoryThread from "../../models/ChatHistoryThread";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    menuButton: {},
    title: {
      flexGrow: 1,
    },
    messageBox: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    messageBoxUsername: {
      color: "#ececec",
    },
    userIcon: {
      width: 34,
      minWidth: 34,
      height: 34,
      marginRight: 8,
    },
    username: {
      fontSize: 13,
    },
    messageText: {
      fontSize: 13,
      color: theme.palette.text.secondary,
    },
    skeletonTextContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      width: "100%",
    },
    skeletonText: { width: "100%", height: "1rem" },
    messagesScroll: {
      flexGrow: 1,
      flesBasis: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll",
      overflowX: "hidden",
      // scrollbarWidth: 0,
    },
    chatTextField: {
      background: "transparent",
      border: "none",
      display: "flex",
      flex: "1",
      outline: "none",
      padding: theme.spacing(1),
    },
  };
});

const HistoryScroll = () => {
  const [chatHistory, setChatHistory] = useState(chatStore.getChatHistory());
  const isLoading = !Array.isArray(chatHistory);


  const onChatHistoryReceived = () => {
    setChatHistory(chatStore.getChatHistory());
  };
  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_HISTORY_RECEIVED,
      onChatHistoryReceived
    );
    return () => {
      return chatStore.removeChangeListener(
        ActionTypes.CHAT_HISTORY_RECEIVED,
        onChatHistoryReceived
      );
    };
  });

  const goToChat = (chatRoomUUID) => {
    chatActions.changeActiveChatRoom(chatRoomUUID);
  };

  const renderChatMessages = () => {
    if (!isLoading) {
      // Messages populated from store - it is safe to render messages
      return chatHistory.map(renderChat);
    } else {
      // Render skeletons, since we haven't received chat messages from socket
      return [...Array(20).keys()].map((message, index) => {
        return renderSkeletonBox();
      });
    }
  };

  const renderSkeletonBox = () => {
    return (
      <ListItem button key={Math.random()} className={classes.messageBox}>
        <Skeleton variant="circle" className={classes.userIcon} />
        <div className={classes.skeletonTextContainer}>
          <Skeleton
            animation="wave"
            className={classes.skeletonText}
            variant="text"
          />
          <Skeleton
            animation="wave"
            className={classes.skeletonText}
            variant="text"
          />
        </div>
      </ListItem>
    );
  };

  /**
   *
   * @param {ChatHistoryThread} chatThread
   */
  const renderChat = (chatThread) => {
    return (
      <ListItem
        button
        key={Math.random()}
        onClick={() => {
          goToChat(chatThread.chatRoomUUID);
        }}
      >
        <div className={classes.messageBox}>
          <Avatar
            src={assetUrl(chatThread.iconUrl)}
            className={classes.userIcon}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              marginLeft: theme.spacing(1),
            }}
          >
            <Typography className={classes.username} variant="caption" disabled>
              {chatThread.chatName}
            </Typography>
            <Typography className={classes.messageText} variant="body1">
              {chatThread.lastMessageText}
            </Typography>
          </div>
        </div>
      </ListItem>
    );
  };

  // useEffect(() => {
  //   bindEventListeners();
  //   return unbindEventListeners;
  // });

  const scrollElement = useRef(null);
  const classes = useStyles();
  return (
    <div className={classes.messagesScroll}>
      <List ref={scrollElement}>{renderChatMessages()}</List>
    </div>
  );
};

export default React.memo(HistoryScroll);
