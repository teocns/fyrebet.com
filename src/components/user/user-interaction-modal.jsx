import React, { useState, useEffect } from "react";

import {
  Avatar,
  Dialog,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import * as Icons from "@material-ui/icons/";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import uiStore from "../../store/ui";
import ActionTypes from "../../constants/ActionTypes";
import { openUserProfileModal } from "../../actions/ui";

import { getUserBrief } from "../../actions/user";
import Skeleton from "@material-ui/lab/Skeleton";

import assetUrl from "../../helpers/assetUrl";
import Currencies from "../../constants/Currencies";
const useStyles = makeStyles((theme) => {
  return {
    userAvatar: {
      width: 64,
      height: 64,
      marginRight: theme.spacing(2),
    },
    username: {
      flex: 1,
      fontSize: "1.25rem",
    },
  };
});

const UserInteractionModal = () => {
  const [Open, setOpen] = useState(uiStore.modals.userProfile.isOpen);
  const [userBrief, setUserBrief] = useState(null);
  const onUserProfileModalToggle = ({ userUUID }) => {
    const _willBeOpen = uiStore.modals.userProfile.isOpen;
    setOpen(_willBeOpen);
    if (!_willBeOpen) {
      // Reset component state
      setTimeout(() => {
        setUserBrief(null);
      });
    } else {
      getUserBrief(userUUID).then((_userBrief) => {
        if (_userBrief && _userBrief.username) {
          setUserBrief(_userBrief);
        }
      });
    }
  };
  
  useEffect(() => {
    uiStore.addChangeListener(
      ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE,
      onUserProfileModalToggle
    );

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE,
        onUserProfileModalToggle
      );
    };
  });

  const classes = useStyles();

  const renderUserAvatar = () => {
    if (userBrief) {
      return (
        <Avatar
          className={classes.userAvatar}
          src={assetUrl(userBrief.avatarUrl)}
        />
      );
    }
    return <Skeleton variant="circle" className={classes.userAvatar} />;
  };
  const renderUsername = () => {
    if (userBrief) {
      return (
        <Typography className={classes.username}>
          {userBrief.username}
        </Typography>
      );
    }
    return <Skeleton className={classes.username} variant="text" />;
  };

  const theme = useTheme();
  return (
    <Dialog onBackdropClick={openUserProfileModal} open={Open}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          margin: theme.spacing(2),
          minWidth: 320,
        }}
      >
        {renderUserAvatar()}
        {renderUsername()}
      </div>
      <Divider />

      <div style={{ display: "inline-flex" }}>
        <Tooltip
          title="Block all user's communications with you"
          aria-label="Block"
        >
          <IconButton aria-label="Block">
            <Icons.Block />
          </IconButton>
        </Tooltip>
        <Tooltip title="Have a private chat with the user" aria-label="Chat">
          <IconButton aria-label="Chat">
            <Icons.Chat />
          </IconButton>
        </Tooltip>
      </div>
    </Dialog>
  );
};

export default UserInteractionModal;
