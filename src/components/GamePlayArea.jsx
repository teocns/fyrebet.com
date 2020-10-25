import React, { useEffect, useState, useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import clsx from "clsx";

import LoginModal from "../modals/login";
import AppBarComponent from "./AppBar";
import Snackbars from "./snackbar";
import AppView from "./app-view";

import { motion, AnimatePresence } from "framer-motion";
import uiStore from "../store/ui";

import ActionTypes from "../constants/ActionTypes";
import AppDrawer from "./AppDrawer";
import UserInteractionModal from "./user/user-interaction-modal";
import { Backdrop, Paper, Frame } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.appBar + 1,
    flex: 1,
    margin: theme.spacing(4),
    perspective: 500,
  },
  animatingComponent: {
    transformStyle: "preserve-3d",
    width: "100%",
    height: "100%",
  },
  paperComponent: {
    width: "100%",
    height: "100%",
  },
}));

const GamePlayAreaComponent = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <motion.div
        className={classes.animatingComponent}
        transition={{
          type: "spring",

          stiffness: 350,
          damping: 25,
        }}
        initial={{ opacity: 0.5, rotateX: -5, scale: 0.75, y: 100 }}
        animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
      >
        <Paper elevation={2} className={classes.paperComponent}>
          {props.children}
        </Paper>
      </motion.div>
    </div>
  );
};

export default GamePlayAreaComponent;
