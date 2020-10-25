import React, { useState } from "react";

import {
  Tooltip,
  IconButton,
  MenuItem,
  Menu,
  Divider,
  Typography,
} from "@material-ui/core";

import Langs from "../../constants/Langs";
import ActionTypes from "../../constants/ActionTypes";
import languageStore from "../../store/language";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import * as uiActions from "../../actions/ui";

import * as chatActions from "../../actions/chat";
import * as ChatConstants from "../../constants/Chat";
import { ArrowBack } from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";
import chatStore from "../../store/chat";

const useStyles = makeStyles((theme) => {
  return {
    row: {
      display: "inline-flex",
      alignItems: "center",
    },
    chatName: {
      flex: 1,
    },
    chatIcon: {},
  };
});

const ChatInfoHeader = () => {
  const [CurrentChat, setCurrentChat] = useState(
    chatStore.getActiveChatThread()
  );

  const isLoading =
    typeof CurrentChat !== "object" ? true : CurrentChat.isLoading;

  const onClose = () => {
    // Goes back to history
    // chatActions.changeChatMode(ChatConstants.ChatModeStatuses.IS_HISTORY);
  };

  const classes = useStyles();

  const renderUserInfo = () => {
    return <p>header</p>;
    if (isLoading) {
      return (
        <React.Fragment>
          <Skeleton
            animation="wave"
            variant="circle"
            className={classes.chatIcon}
          />
          <Skeleton
            animation="wave"
            className={classes.chatName}
            variant="text"
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Avatar src={CurrentChat.iconUrl} />
          <Typography>chat name</Typography>
        </React.Fragment>
      );
    }
  };
  return (
    <div className={classes.row}>
      <Tooltip title="Go back" aria-label={"Go back"}>
        <IconButton
          aria-controls={`go-back`}
          aria-haspopup="true"
          onClick={onClose}
        >
          <ArrowBack size="small" />
        </IconButton>
      </Tooltip>
      <div>{renderUserInfo()}</div>
    </div>
  );
};

export default ChatInfoHeader;
