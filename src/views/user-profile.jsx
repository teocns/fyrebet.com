import React, { useState } from "react";

import sessionStore from "../store/session";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField, Typography, Grid, Avatar } from "@material-ui/core";

import { Image as ImageIcon, Edit as EditIcon } from "@material-ui/icons";

import { motion } from "framer-motion";

import AvatarChangeable from "../components/user/avatar-changeable";

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

const UserProfileView = () => {
  const [user, updateUser] = useState(sessionStore.getUser());

  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xs={12} style={{ justifyContent: "center" }}>
          <AvatarChangeable />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Change your username</Typography>
          <TextField label="Username" value={user.username} />
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfileView;
