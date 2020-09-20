import React, { useState, useRef } from "react";

import sessionStore from "../../store/session";
import ActionTypes from "../../constants/ActionTypes";
import EnvironmentConstants from "../../constants/Environment";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField, Typography, Grid, Avatar } from "@material-ui/core";

import { Image as ImageIcon, Settings as EditIcon } from "@material-ui/icons";

import { motion } from "framer-motion";

import { updateAvatar } from "../../actions/session";
import { useEffect } from "react";
import assetUrl from "../../helpers/assetUrl";

const useStyles = makeStyles((theme) => ({
  avatarBox: {
    height: 128,
    width: 128,
    position: "relative",
  },
  imageIcon: {
    width: "75%",
    height: "75%",
  },
  editIcon: {},
  editIconContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const AvatarChangeable = () => {
  const [avatar, setAvatar] = useState(sessionStore.getUser().avatar);
  const classes = useStyles();

  const inputElement = useRef(null);
  const popFileInput = () => {
    inputElement && inputElement.current && inputElement.current.click();
  };
  const onFileInputChanged = ({ target: input }) => {
    if (input.files.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        let urlB64 = fileReader.result;
        // Remove url part
        const cutFromString = "base64,";
        const cutIndex = urlB64.indexOf(cutFromString) + cutFromString.length;
        updateAvatar(urlB64.substring(cutIndex));
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  };
  const onAvatarChanged = () => {
    console.log(sessionStore.getUser().avatar);
    setAvatar(sessionStore.getUser().avatar);
  };

  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.SESSION_USER_AVATAR_CHANGED,
      onAvatarChanged
    ); // When component mounted, subscribe to dispatcher events of session.
    sessionStore.addChangeListener(
      ActionTypes.SESSION_USER_DATA_RECEIVED,
      onAvatarChanged
    ); // When component mounted, subscribe to dispatcher events of session.

    return () => {
      // On component unmounting, remove previous listener.
      sessionStore.removeChangeListener(
        ActionTypes.SESSION_USER_DATA_RECEIVED,
        onAvatarChanged
      );
    };
  });
  return (
    <React.Fragment>
      <input
        ref={inputElement}
        type="file"
        style={{ display: "none" }}
        onChange={onFileInputChanged}
        accept="image/*"
      />
      <Avatar className={classes.avatarBox} onClick={popFileInput}>
        <motion.div
          className={classes.editIconContainer}
          initial={{
            scale: 1,
            backgroundColor: "rgb(0,0,0,0)",
            opacity: 0,
          }}
          whileHover={{
            scale: 2,
            backgroundColor: "rgb(0,0,0,0.62)",
            opacity: 1,
            transition: {
              duration: 0.125,
            },
          }}
        >
          <EditIcon className={classes.editIcon} />
        </motion.div>
        {avatar ? (
          <img src={assetUrl(avatar.sizes["128"])} alt="Avatar" />
        ) : (
          <ImageIcon className={classes.imageIcon} />
        )}
      </Avatar>
    </React.Fragment>
  );
};

export default AvatarChangeable;
