import React, { useState, useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import chatStore from "../../../store/chat";
import languageStore from "../../../store/language";
import ActionTypes from "../../../constants/ActionTypes";
import * as chatActions from "../../../actions/chat";
import Langs from "../../../constants/Langs";
import {
  Avatar,
  Typography,
  Paper,
  TextField,
  Box,
  Input,
  Divider,
  IconButton,
  Tooltip,
} from "@material-ui/core/";

import { Send as SendIcon } from "@material-ui/icons";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import Skeleton from "@material-ui/lab/Skeleton";

import * as ChatConstants from "../../../constants/Chat";
import ChatThread from "../../../models/ChatThread";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    chatTextFieldPaper: {
      borderRadius: 5,
      flex: "1",
      flexGrow: 1,
      display: "inline-flex",
    },
    chatTextField: {
      border: "none",
      alignItems: "center",
      flex: "1",
      outline: "none",
      height: "3rem",
      background: "transparent",
      boxShadow: "none",
      //backgroundColor: "#00000025",
      padding: "1rem",
      resize: "none",
      overflow: "hidden",
      "&:focus": {
        outline: "none",
      },
    },
    chatSendMessageBox: {
      display: "inline-flex",
      flexWrap: "nowrap",
      padding: theme.spacing(2),
    },
  };
});

const ChatThreadFooter = () => {
  const [CanSendMessage, setCanSendMessage] = useState(false);

  const [ActiveChat, setActiveChat] = useState(chatStore.getActiveChatThread());

  const languageName = Langs[languageStore.getLang()].language;

  const isLoading =
    !(ActiveChat instanceof ChatThread) || ActiveChat.isLoading === true;

  const classes = useStyles();

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

  const onActiveChatChanged = () => {
    setActiveChat(chatStore.getActiveChatThread());
  };
  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onActiveChatChanged
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onActiveChatChanged
    );

    return () => {
      chatStore.removeChangeListener(
        ActionTypes.CHAT_ROOM_CHANGE,
        onActiveChatChanged
      );

      chatStore.removeChangeListener(
        ActionTypes.CHAT_THREAD_DATA_RECEIVED,
        onActiveChatChanged
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

  const renderSkeleton = () => {
    return (
      <Skeleton
        variant="rect"
        animation={"wave"}
        style={{ height: "2.5rem", width: "100%", borderRadius: 5 }}
      />
    );
  };

  const renderChatbox = () => {
    return (
      <Paper className={classes.chatTextFieldPaper}>
        <Input
          key="chat-textarea-messaging"
          type="text"
          ref={chatTextField}
          disableUnderline={true}
          className={classes.chatTextField}
          //onKeyPress={onEnterMessageKeyPress}
          placeholder={
            ActiveChat.chatRoomType === "PUBLIC"
              ? `Chat here (${languageName})`
              : "Chat here"
          }
          onKeyPress={onEnterMessageKeyPress}
          onChange={onInputMessageChanged}
        />
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
    );
  };

  const render = () => {
    if (isLoading) {
      return renderSkeleton();
    } else {
      return renderChatbox();
    }
  };
  return (
    <AnimatePresence>
      <div className={classes.chatSendMessageBox}>{render()}</div>
    </AnimatePresence>
  );
};

export default ChatThreadFooter;
