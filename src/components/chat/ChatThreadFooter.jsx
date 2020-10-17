import React, { useState, useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import chatStore from "../../store/chat";
import ActionTypes from "../../constants/ActionTypes";
import * as chatActions from "../../actions/chat";

import {
  Avatar,
  Typography,
  Paper,
  TextField,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@material-ui/core/";

import { Send as SendIcon } from "@material-ui/icons";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import * as ChatConstants from "../../constants/Chat";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    chatTextFieldPaper: {
      borderRadius: "1.25rem",
      flex: "1",
      flexGrow: 1,
      display: "inline-flex",
    },
    chatTextField: {
      border: "none",
      alignItems: "center",
      flex: "1",
      height: "1rem",
      outline: "none",
      background: "transparent",
      //backgroundColor: "#00000025",
      padding: "1rem",
      resize: "none",
      overflow: "hidden",
    },
    chatSendMessageBox: {
      margin: theme.spacing(1),
      marginRight: 0, // 0 due to button's integrated margin
      display: "inline-flex",
      flexWrap: "nowrap",
    },
  };
});

const ChatThreadFooter = () => {
  const [CanSendMessage, setCanSendMessage] = useState(false);
  const [ActiveChat, setActiveChat] = useState(chatStore.getActiveChatThread());

  const [CanChat, setCanChat] = useState(
    chatStore.getChatMode() === ChatConstants.ChatModeStatuses.IS_CHATTING
  );

  const classes = useStyles();

  const autoGrowTextarea = (evt) => {
    const element = evt.currentTarget;
    element.style.height = "0px";
    element.style.height = `calc(${element.scrollHeight}px - 2rem)`;
  };

  const onEnterMessageKeyPress = (event) => {
    if (event.key === "Enter") {
      // If enter is pressed...
      const messagePayload = event.target.value.trim();
      event.target.value = ""; // Reset the textfield text to empty
      setTimeout(() => {
        chatActions.sendMessage(messagePayload); // Call actions function that interfaces with the server
      });
      event.preventDefault(); // Prevent default so ENTER key does not really insert in the chat
      return false;
    }
  };
  const theme = useTheme();

  const onSubmit = () => {
    alert("submitted");
  };

  const onChatModeChanged = () => {
    setCanChat(
      chatStore.getChatMode() === ChatConstants.ChatModeStatuses.IS_CHATTING
    );
  };

  const onActiveChatChanged = () => {};
  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onActiveChatChanged
    );
    chatStore.addChangeListener(
      ActionTypes.CHAT_MODE_CHANGE,
      onChatModeChanged
    );
    return () => {
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
  const onInputMessageChanged = (a, b) => {
    const willBeAbleToSendMessage = !!a.target.value.toString().trim().length;
    if (willBeAbleToSendMessage !== CanSendMessage) {
      setCanSendMessage(willBeAbleToSendMessage);
    }
  };

  const chatTextField = useRef(null);
  return (
    <AnimatePresence>
      {CanChat && (
        <div className={classes.chatSendMessageBox} onSubmit={onSubmit}>
          <Paper className={classes.chatTextFieldPaper}>
            <textarea
              key="chat-textarea-messaging"
              type="text"
              ref={chatTextField}
              className={classes.chatTextField}
              //onKeyPress={onEnterMessageKeyPress}
              placeholder="Say something..."
              onInput={autoGrowTextarea}
              onKeyPress={onEnterMessageKeyPress}
              onChange={onInputMessageChanged}
            ></textarea>
            <AnimatePresence>
              {CanSendMessage && (
                <motion.div
                  exit={{
                    scale: 0,
                    transition: {
                      duration: 0.125,
                    },
                  }}
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  <IconButton
                    style={{
                      marginLeft: theme.spacing(0.5),
                      marginRight: theme.spacing(0.5),
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatThreadFooter;
