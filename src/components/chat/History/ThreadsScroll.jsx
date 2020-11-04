import React, { useEffect, useState, useRef } from "react";
import * as chatActions from "../../../actions/chat";
import chatStore from "../../../store/chat";
import ActionTypes from "../../../constants/ActionTypes";

import { motion } from "framer-motion";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../../themes/fyrebet";
import {
  TextField,
  Divider,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  Badge,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import clsx from "clsx";

import assetUrl from "../../../helpers/assetUrl";
import ChatHistoryThread from "../../../models/ChatHistoryThread";

import { prettyTimelapse } from "../../../helpers/time";

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
      width: "100%",
    },
    messageBoxUsername: {
      color: "#ececec",
    },
    userIcon: {
      width: 32,
      minWidth: 32,
      height: 32,
    },
    username: {
      fontSize: 13,
    },
    messageText: {
      fontSize: 13,
      color: theme.palette.text.secondary,
      flexGrow: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    messageTextUnread: {
      fontWeight: "bold",
      color: "#333333",
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
    // unreadMessagesCountBadge:{
    //   position:'absolute',
    //   right:''
    // }
  };
});

const ThreadsHistoryScroll = () => {
  const [chatHistory, setChatHistory] = useState(chatStore.getChatHistory());

  const isLoading = !Array.isArray(chatHistory);

  const onChatHistoryReceived = () => {
    setChatHistory([...chatStore.getChatHistory()]);
  };
  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_HISTORY_RECEIVED,
      onChatHistoryReceived
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onChatHistoryReceived
    );
    return () => {
      chatStore.removeChangeListener(
        ActionTypes.CHAT_HISTORY_RECEIVED,
        onChatHistoryReceived
      );
      chatStore.removeChangeListener(
        ActionTypes.CHAT_MESSAGE_RECEIVED,
        onChatHistoryReceived
      );
    };
  });

  const goToChat = (chatRoomUUID) => {
    chatActions.showChatThread(chatRoomUUID);
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
  const chatListItemTransitionLayout = {
    type: "spring",
    damping: 25,
    stiffness: 275,
    duration: 0.275,
  };

  /**
   *
   * @param {ChatHistoryThread} chatThread
   */
  const renderChat = (chatThread) => {
    return (
      <motion.div
        layout
        key={chatThread.chatRoomUUID}
        transition={chatListItemTransitionLayout}
      >
        <ListItem
          button
          onClick={() => {
            goToChat(chatThread.chatRoomUUID);
          }}
        >
          <div className={classes.messageBox}>
            <div
              style={{
                width: 32,
                minWidth: 32,
                height: 32,
                position: "relative",
              }}
            >
              {chatThread.unreadMessages > 0 ? (
                <Badge badgeContent={chatThread.unreadMessages} color="primary">
                  <Avatar
                    src={assetUrl(chatThread.iconUrl)}
                    className={classes.userIcon}
                  />
                </Badge>
              ) : (
                <Avatar
                  src={assetUrl(chatThread.iconUrl)}
                  className={classes.userIcon}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: theme.spacing(2),
                overflow: "hidden",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <Typography
                  className={classes.username}
                  variant="caption"
                  disabled
                >
                  {chatThread.chatName}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: theme.palette.text.hint }}
                >
                  {prettyTimelapse(chatThread.lastMessageTimestamp)}
                </Typography>
              </div>

              <Typography
                className={clsx({
                  [classes.messageText]: true,
                  [classes.messageTextUnread]: chatThread.unreadMessages > 0,
                })}
                variant="body1"
              >
                {chatThread.lastMessageText}
              </Typography>
            </div>
          </div>
        </ListItem>
      </motion.div>
    );
  };

  // useEffect(() => {
  //   bindEventListeners();
  //   return unbindEventListeners;
  // });

  const scrollElement = useRef(null);
  const classes = useStyles();
  return (
    <motion.div
      className={classes.messagesScroll}
      initial={{ opacity: 0.9, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <List ref={scrollElement}>{renderChatMessages()}</List>
    </motion.div>
  );
};

export default React.memo(ThreadsHistoryScroll);
