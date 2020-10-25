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
import { Backdrop, Paper } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  appContent: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "100vh",
  },
  appView: {
    flex: 1,
    backgroundColor: "#ba111d",
  },
}));
export default function AppContent(props) {
  let appContentElement = useRef(undefined);
  const classes = useStyles();
  const theme = useTheme();

  const [ShouldFocusOnDrawer, setShouldFocusOnDrawer] = useState(
    uiStore.shouldFocusOnDrawer()
  );

  const onShouldFocusOnDrawerChanged = () => {
    setShouldFocusOnDrawer(uiStore.shouldFocusOnDrawer());
  };

  useEffect(() => {
    uiStore.addChangeListener(
      ActionTypes.UI_FOCUS_ON_APP_DRAWER,
      onShouldFocusOnDrawerChanged
    );

    uiStore.addChangeListener(
      ActionTypes.UI_UNFOCUS_FROM_APP_DRAWER,
      onShouldFocusOnDrawerChanged
    );

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.UI_FOCUS_ON_APP_DRAWER,
        onShouldFocusOnDrawerChanged
      );

      uiStore.removeChangeListener(
        ActionTypes.UI_UNFOCUS_FROM_APP_DRAWER,
        onShouldFocusOnDrawerChanged
      );
    };
  });
  return (
    <div className={classes.appContent}>
      <AppDrawer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
        }}
      >
        <Backdrop
          style={{ zIndex: theme.zIndex.appBar + 1 }}
          open={ShouldFocusOnDrawer}
        />
        <AppBarComponent />
        {/* <Paper
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "50%",
          }}
        ></Paper> */}
        <AppView className={classes.appView} />
      </div>
      {/* <LoginModal open={isLoginModalOpen} /> */}
      <Snackbars />
      <UserInteractionModal />
    </div>
  );
}
