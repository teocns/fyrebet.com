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
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
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
      margin: 0,
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    messageBoxUsername: {
      color: "#ececec",
    },
    userIcon: {
      width: 32,
      height: 32,
      display: "none",
      position: "absolute",
      marginRight: theme.spacing(2),
    },
    username: {
      color: "",
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

const ChatMessagesScroll = () => {
  const [messages, setMessages] = useState(chatStore.getUserChatMessages());

  const MessagesLoaded = Array.isArray(messages) && messages.length;

  useEffect(() => {
    bindEventListeners();
    // Scroll to the bottom
    scrollChatDown();
    return unbindEventListeners;
  });

  const onChatMessagesLoaded = () => {
    setMessages(chatStore.getUserChatMessages());
  };
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

  const scrollChatDown = () => {
    setTimeout(() => {
      scrollElement.current.parentElement.scrollTop =
        scrollElement.current.scrollHeight;
    });
  };

  const renderChatMessages = () => {
    if (MessagesLoaded) {
      // Messages populated from store - it is safe to render messages
      return messages.map((message, index) => {
        // let isLastMessage = index === messages.length - 1;
        //console.log("islastmesage", isLastMessage);
        return renderMessageBox({ message });
      });
    } else {
      // Render skeletons, since we haven't received chat messages from socket
      return [...Array(20).keys()].map((message, index) => {
        return renderSkeletonBox();
      });
    }
  };

  const renderSkeletonBox = () => {
    return (
      <Paper key={Math.random()} className={classes.messageBox}>
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
      </Paper>
    );
  };
  let renderMessageBox = ({ message }) => {
    return (
      <div key={Math.random()}>
        <motion.div
        // initial={{ opacity: 0, scale: 0.75, bottom: 0 }}
        // animate={{ opacity: 1, scale: 1, bottom: 0 }}
        // exit={{ opacity: 0 }}
        >
          <Paper className={classes.messageBox}>
            <UserAvatarWithActions
              userUUID={message.userUUID}
              avatarUrl={message.avatarUrl}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                marginLeft: theme.spacing(1),
              }}
            >
              <Typography
                className={classes.username}
                variant="caption"
                disabled
              >
                {message.username}
              </Typography>
              <span>{message.messageText}</span>
            </div>
          </Paper>
        </motion.div>
      </div>
    );
  };

  useEffect(() => {
    bindEventListeners();
    return unbindEventListeners;
  });

  const scrollElement = useRef(null);
  const classes = useStyles();
  return (
    <div className={classes.messagesScroll}>
      <div
        style={{
          display: "block",
        }}
        ref={scrollElement}
      >
        {renderChatMessages()}
      </div>
    </div>
  );
};

export default ChatMessagesScroll;
