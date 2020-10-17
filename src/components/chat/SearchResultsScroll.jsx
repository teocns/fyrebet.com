import React, { useEffect, useState, useRef } from "react";
import * as chatActions from "../../actions/chat";
import chatStore from "../../store/chat";
import ActionTypes from "../../constants/ActionTypes";

import { motion } from "framer-motion";
import UserAvatarWithActions from "../user/user-avatar";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../themes/fyrebet/fyrebet";

import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import {
  TextField,
  Divider,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@material-ui/core";

import PhotographerTakingPictures from "../../assets/illustrations/photographer-taking-pictures.svg";
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
    preloadContainer: {
      margin: 0,
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    progress: {
      width: 16,
      height: 16,
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

const ChatSearchResultsScroll = () => {
  const [SearchResults, setSearchResults] = useState(
    chatStore.getSearchResults()
  );

  const SearchQuery = chatStore.getSearchQuery();
  const isLoadingSearchResults = chatStore.isLoadingSearchResults();

  // const [IsLoading, setIsLoading] = useState(chatStore.isLoadingSearchResults());

  // Optimize chat loading
  // When user keeps typing, don't remove results that match data he's typing in

  const onChatSearchResultsChanged = () => {
    setSearchResults(chatStore.getSearchResults());
  };

  const subscribeToChatStoreEvents = () => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_SEARCH_QUERY_CHANGE,
      onChatSearchResultsChanged
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_SEARCH_RESULTS_CHANGED,
      onChatSearchResultsChanged
    );
    return unsubscribeToChatStoreEvents;
  };

  const unsubscribeToChatStoreEvents = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_SEARCH_QUERY_CHANGE,
      onChatSearchResultsChanged
    );
    chatStore.removeChangeListener(
      ActionTypes.CHAT_SEARCH_RESULTS_CHANGED,
      onChatSearchResultsChanged
    );
  };
  useEffect(subscribeToChatStoreEvents);

  const renderSkeleton = () => {
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
  const renderResult = ({ userUUID, iconUrl, username, lastMessage }) => {
    return (
      <div key={Math.random()} className={classes.messageBox}>
        <UserAvatarWithActions userUUID={userUUID} avatarUrl={iconUrl} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginLeft: theme.spacing(1),
          }}
        >
          <Typography className={classes.username} variant="caption" disabled>
            {username}
          </Typography>
          <Typography className={classes.messageText} variant="body2">
            {lastMessage}
          </Typography>
        </div>
      </div>
    );
  };

  const renderNothingFound = () => {
    return (
      <div
        style={{
          margin: theme.spacing(2),
        }}
      >
        <img
          style={{ width: "75%", height: "75%" }}
          src={PhotographerTakingPictures}
          alt=""
        />
        <Typography variant="h6">Nothing Found</Typography>
        <Typography
          style={{
            color: theme.palette.text.hint,
            marginTop: theme.spacing(1),
          }}
          variant="subtitle2"
        >
          No matches were found for "{SearchQuery}". Try checking for typos or
          using complete words.
        </Typography>
      </div>
    );
  };

  const renderSearchResults = () => {
    let results = [];
    if (Array.isArray(SearchResults)) {
      results = SearchResults.map(renderResult);
    }

    if (isLoadingSearchResults) {
      results.push(
        <div key={Math.random()} className={classes.preloadContainer}>
          <CircularProgress size={32} />
        </div>
      );
    } else if (!results.length) {
      results.push(renderNothingFound());
    }
    return results;
  };

  const classes = useStyles();
  return (
    <div className={classes.messagesScroll}>
      <div
        style={{
          display: "block",
        }}
      >
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default ChatSearchResultsScroll;
