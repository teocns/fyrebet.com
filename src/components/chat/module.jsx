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

import chatStore from "../../store/chat";

import ActionTypes from "../../constants/ActionTypes";

import * as chatActions from "../../actions/chat";

import assetUrl from "../../helpers/assetUrl";

import { motion, AnimatePresence } from "framer-motion";

import UserAvatarWithActions from "../user/user-avatar";
import theme from "../../themes/fyrebet/fyrebet";

import { Send as SendIcon } from "@material-ui/icons";
import ChatMessagesScroll from "./messages-scroll";
import OpenChatsMini from "./open-chats-mini";

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
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
    chatTextFieldPaper: {
      borderRadius: "1.25rem",
      flex: "1",
    },
    chatTextField: {
      border: "none",
      display: "flex",
      flex: "1",
      outline: "none",
      height: "0",
      background: "transparent",
      //backgroundColor: "#00000025",
      padding: "1rem",
      resize: "none",
      overflow: "hidden",
    },
    chatSendMessageBox: {
      margin: theme.spacing(1),
      marginRight: 0, // 0 due to button's integrated margin
    },
  };
});

export default function Chat() {
  const [ActiveChatRoom, setActiveChatRoom] = useState(
    chatStore.getActiveChatRoom()
  );

  const classes = useStyles();

  // Subscribe chat message updates, shall we?

  const onEnterMessageKeyPress = (event) => {
    if (event.key === "Enter") {
      // If enter is pressed...
      chatActions.sendMessage(event.target.value.trim()); // Call actions function that interfaces with the server
      event.target.value = ""; // Reset the textfield text to empty
    }
  };

  const onChatRoomDataReceived = () => {
    setActiveChatRoom(chatStore.getActiveChatRoom());
  };

  const bindEventListeners = () => {
    if (!ActiveChatRoom) {
      // We need to request a chat room. Load default!
      chatActions.loadDefaultChatRoom();
    }
    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_DATA_RECEIVED,
      onChatRoomDataReceived
    );
  };

  const unbindEventListeners = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_ROOM_DATA_RECEIVED,
      onChatRoomDataReceived
    );
  };
  useEffect(() => {
    bindEventListeners();
    return unbindEventListeners;
  });
  const autoGrowTextarea = (evt) => {
    const element = evt.currentTarget;
    element.style.height = "0px";
    element.style.height = `calc(${element.scrollHeight}px - 2rem)`;
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
          alignItems: "center",
        }}
      >
        <OpenChatsMini />
      </div>
      <ChatMessagesScroll />

      <Box
        className={classes.chatSendMessageBox}
        display="inline-flex"
        flexDirection="row"
        flexWrap="nowrap"
      >
        <Paper className={classes.chatTextFieldPaper}>
          <textarea
            type="text"
            className={classes.chatTextField}
            //onKeyPress={onEnterMessageKeyPress}
            placeholder="Say something..."
            onInput={autoGrowTextarea}
            onKeyPress={onEnterMessageKeyPress}
          ></textarea>
        </Paper>
        <IconButton
          style={{
            marginLeft: theme.spacing(0.5),
            marginRight: theme.spacing(0.5),
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
