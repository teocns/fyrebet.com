import React from "react";

import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import assetUrl from "../../helpers/assetUrl";

import { openUserProfileModal } from "../../actions/ui";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      "&:hover": {
        cursor: "pointer",
      },
    },
  };
});

const UserAvatarWithActions = ({ userUUID, avatarUrl, height, width }) => {
  const classes = useStyles();
  const onUserAvatarClick = () => {
    openUserProfileModal(userUUID);
  };

  return (
    <Avatar
      onClick={onUserAvatarClick}
      className={classes.root}
      style={{
        height,
        width,
        marginTop: height / 7,
      }}
      alt=""
      src={assetUrl(avatarUrl)}
    />
  );
};

export default UserAvatarWithActions;
