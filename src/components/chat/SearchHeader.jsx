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
import { Search as SearchIcon } from "@material-ui/icons";
import GoBackToHistoryButton from "./GoBackToHistoryButton";

const useStyles = makeStyles((theme) => {
  return {
    chatTextFieldPaper: {
      borderRadius: "1.25rem",
      flex: "1",
      height: "2rem",
      padding: "0 1rem",
      marginRight: theme.spacing(2),
      overflow: "hidden",
      display: "inline-flex",
      background: theme.palette.input.comment.background,
    },
    chatTextField: {
      border: "none",
      outline: "none",
      height: "100%",
      color: theme.palette.text.primary,
      width: "100%",
      background: "transparent",
      overflow: "hidden",
      display: "flex",
      flex: 1,
    },
    chatSendMessageBox: {
      margin: theme.spacing(1),
      marginRight: 0, // 0 due to button's integrated margin
      alignItems: "center",
    },
  };
});

// Displays old user chats as well as
const ChatSearchHeader = () => {
  const onQuery = (event) => {
    let searchQuery = event.target.value;
    chatActions.searchQuery(searchQuery).then((result) => {
      console.log(result);
    });
  };

  const classes = useStyles();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "between",
        width: "100%",
      }}
    >
      <GoBackToHistoryButton />
      <Paper className={classes.chatTextFieldPaper} elevation={0}>
        <input
          size="small"
          variant="standard"
          type="text"
          className={classes.chatTextField}
          placeholder="Find or start a conversation"
          onChange={onQuery}
        />
      </Paper>
    </div>
  );
};

export default ChatSearchHeader;
