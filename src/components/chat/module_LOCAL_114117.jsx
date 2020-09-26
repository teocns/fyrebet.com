import React, { useState, useEffect, useRef } from "react";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";

import {
  Avatar,
  Typography,
  Paper,
  TextField,
  Divider,
  IconButton,
} from "@material-ui/core/";
import Skeleton from "@material-ui/lab/Skeleton";

import * as userChatActions from "../actions/chat";
import userChatStore from "../store/user-chat";

import ActionTypes from "../constants/ActionTypes";

import assetUrl from "../helpers/assetUrl";

import { motion, AnimatePresence } from "framer-motion";

import UserAvatarWithActions from "./user/user-avatar";
import theme from "../themes/fyrebet/fyrebet";
import LanguagePicker from "./pickers/language";
import { Send as SendIcon } from "@material-ui/icons";
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

export default function UserChat() {
  const [messages, setMessages] = useState(userChatStore.getUserChatMessages());
  const [messagesLoaded, setMessagesLoaded] = useState(
    userChatStore.isMessagesLoaded
  );

  const classes = useStyles();

  // Subscribe chat message updates, shall we?

  const onEnterMessageKeyPress = (event) => {
    if (event.key === "Enter") {
      // If enter is pressed...
      userChatActions.sendMessage(event.target.value.trim()); // Call actions function that interfaces with the server
      event.target.value = ""; // Reset the textfield text to empty
    }
  };
  const onChatMessagesLoaded = () => {
    setMessages(userChatStore.getUserChatMessages());
    setMessagesLoaded(userChatStore.isMessagesLoaded);
  };
  const bindEventListeners = () => {
    userChatStore.addChangeListener(
      ActionTypes.CHAT_STATUS_RECEIVED,
      onChatMessagesLoaded
    ); // When component mounted, subscribe to dispatcher events to receive each new message.

    userChatStore.addChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onMessageReceived
    ); // When component mounted, subscribe to dispatcher events to receive each new message.
  };

  const unbindEventListeners = () => {
    userChatStore.removeChangeListener(
      ActionTypes.CHAT_STATUS_RECEIVED,
      onChatMessagesLoaded
    ); // When component mounted, subscribe to dispatcher events to receive each new message.

    // On component unmounting, remove previous listener.
    userChatStore.removeChangeListener(
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
  useEffect(() => {
    bindEventListeners();
    // Scroll to the bottom
    scrollChatDown();
    return unbindEventListeners;
  });
  const onMessageReceived = () => {
    // Push message to the stack of 50 messges in the chat.
    setMessages([...userChatStore.getUserChatMessages()]);
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
  const scrollElement = useRef(null);
  const renderChatMessages = () => {
    if (messagesLoaded) {
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
  return (
    <Box
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "inline-flex",
        }}
      >
        <LanguagePicker />
      </div>
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

      <Box display="inline-flex" flexDirection="row" flexWrap="nowrap">
        <input
          type="text"
          className={classes.chatTextField}
          onKeyPress={onEnterMessageKeyPress}
          placeholder="Say something..."
        />
        <IconButton>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}