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

const useStyles = makeStyles((theme) => {
  return {
    chatTextFieldPaper: {
      borderRadius: "1.25rem",
      flex: "1",
      height: "2rem",
      padding: "0 1rem",
      overflow: "hidden",
      display: "inline-flex",
      background: theme.palette.inputOnPaper || "gray",
    },
    chatTextField: {
      border: "none",
      outline: "none",
      height: "100%",
      width: "100%",
      background: "transparent",
      overflow: "hidden",
      fontSize: "11px",
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
const ChatSearch = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.chatTextFieldPaper} elevation={0}>
      <input
        size="small"
        variant="standard"
        type="text"
        className={classes.chatTextField}
        placeholder="Find or start a conversation"
      />
      <IconButton
        disabled={true}
        style={{
          paddingRight: 0,
        }}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default ChatSearch;
