import React, { useState, useEffect, useRef } from "react";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";

import * as notificationActions from "../../actions/notification";

import {
  Avatar,
  Typography,
  Paper,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@material-ui/core/";
import Skeleton from "@material-ui/lab/Skeleton";

import chatStore from "../../store/chat";

import ActionTypes from "../../constants/ActionTypes";

import * as chatActions from "../../actions/chat";

import assetUrl from "../../helpers/assetUrl";

import { motion, AnimatePresence } from "framer-motion";

import UserAvatarWithActions from "../user/user-avatar";

import theme from "../../themes/fyrebet";

import { Search as SearchIcon } from "@material-ui/icons";
import ChatMessagesScroll from "./Thread/MessagesScroll";
//import PublicEnvironmentNotifications from "./PublicInteractionRow.jsx";

import ChatSearchHeader from "./SearchHeader";
import ChatSearchResultsScroll from "./SearchResultsScroll";

import * as ChatConstants from "../../constants/Chat";
import AppDrawerViews from "../../constants/AppDrawerViews";

import ThreadsHistoryScroll from "./History/ThreadsScroll";
import ChatInfoHeader from "./ChatInfoHeader";
import ChatThreadFooter from "./Thread/Footer";
import ChatSoundEffects from "./ChatSoundEffects";
import { useHistory } from "react-router-dom";

import * as uiActions from "../../actions/ui";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    menuButton: {},
    title: {
      flexGrow: 1,
    },
    chatDefaultHeader: {
      display: "inline-flex",
      alignItems: "center",
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
  };
});

export default function Chat() {
  const [ActiveChatRoom, setActiveChatRoom] = useState(
    chatStore.getActiveChatThread()
  );

  const [ChatMode, setChatMode] = useState(chatStore.getChatMode());

  const [IsChatInitialized, setIsChatInitialized] = useState(
    chatStore.isInitialized
  );

  const classes = useStyles();

  // Subscribe chat message updates, shall we?

  const onChatRoomDataReceived = () => {
    alert("YUEA");
    setActiveChatRoom(chatStore.getActiveChatThread());
  };

  const onChatModeChanged = () => {
    setChatMode(chatStore.getChatMode());
  };

  const onChatInitialized = () => {
    setIsChatInitialized(chatStore.isInitialized);
  };

  const bindEventListeners = () => {
    // Load a "default" chat thread if conditions met

    chatStore.addChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatRoomDataReceived
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_MODE_CHANGE,
      onChatModeChanged
    );
    chatStore.addChangeListener(
      ActionTypes.CHAT_INITIALIZED,
      onChatInitialized
    );
  };

  const unbindEventListeners = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatRoomDataReceived
    );
    chatStore.removeChangeListener(
      ActionTypes.CHAT_MODE_CHANGE,
      onChatModeChanged
    );
    chatStore.removeChangeListener(
      ActionTypes.CHAT_INITIALIZED,
      onChatInitialized
    );
  };
  useEffect(() => {
    bindEventListeners();
    return unbindEventListeners;
  });

  const renderList = () => {
    if (!IsChatInitialized) {
      return <div>Chat initializing</div>;
    }
    switch (ChatMode) {
      case ChatConstants.ChatModeStatuses.IS_CHATTING:
        return <ChatMessagesScroll />;
      case ChatConstants.ChatModeStatuses.IS_SEARCHING:
        return <ChatSearchResultsScroll />;
      case ChatConstants.ChatModeStatuses.IS_HISTORY:
        // Default shows user history
        return <ThreadsHistoryScroll />;
      default:
        console.log("Rendering nothing");
        break; // Redner nothing
    }
  };

  const goToSearchChatUsers = () => {
    uiActions.changeAppDrawerView(AppDrawerViews.FIND_USERS_GOTO_CHAT);
  };
  const renderHeader = () => {
    switch (ChatMode) {
      case ChatConstants.ChatModeStatuses.IS_CHATTING:
        return <ChatInfoHeader />;
        break;
      case ChatConstants.ChatModeStatuses.IS_SEARCHING:
        return <ChatSearchHeader />;
        break;
      default:
        // IS_HISTORY
        return (
          <div className={classes.chatDefaultHeader}>
            <Tooltip
              title="Search for messages and users"
              aria-label={"Search"}
            >
              <IconButton
                aria-controls={`go-back`}
                aria-haspopup="true"
                onClick={() => {}}
              >
                <SearchIcon size="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
        break;
    }

    return;
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
          flexDirection: "column",
        }}
      >
        {renderHeader()}

        {/* <PublicEnvironmentNotifications /> */}
      </div>

      {renderList()}
      <ChatThreadFooter />
      <ChatSoundEffects />
      {/* <AnimatePresence>
        {ChatMode === ChatConstants.ChatModeStatuses.IS_CHATTING && (
          <motion.div
            animate={{
              opacity: 1,
              scale:-1
            }}
            exit={{
              scale: 0,
            }}
          >
            
          </motion.div>
        )}
      </AnimatePresence> */}
    </Box>
  );
}
