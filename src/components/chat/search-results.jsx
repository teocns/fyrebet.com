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
      fontSize: 13,
    },
    messageText: {
      fontSize: 13,
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
      flexDirection: "column-reverse",
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

const ChatSearchResuls = () => {
  const [SearchResults, setSearchResults] = useState(
    chatStore.getSearchResults()
  );

  const onChatSearchResultsChanged = () => {
    setSearchResults(chatStore.getSearchResults());
  };

  const subscribeToChatStoreEvents = () => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_SEARCH_QUERY_CHANGE,
      onChatSearchResultsChanged
    );
    return unsubscribeToChatStoreEvents;
  };
  const unsubscribeToChatStoreEvents = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_SEARCH_QUERY_CHANGE,
      onChatSearchResultsChanged
    );
  };
  useEffect(subscribeToChatStoreEvents);

  const renderSkeleton = () => {};
  const renderResult = ({ userUUID, iconUrl, username, lastMessage }) => {
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

  const renderList = () => {
    if (!Array.isArray(SearchResults)) {
      // Results not loaded, render skeletons instead
      return [...Array(10).keys()].map(renderSkeleton);
    } else {
      // Render each chat box
      return SearchResults.map(() => {});
    }
  };
  return (
    <div className={classes.messagesScroll}>
      <div
        style={{
          display: "block",
        }}
        ref={scrollElement}
      >
        {}
      </div>
    </div>
  );
};

export default ChatSearchResuls;
