import React, { useEffect, useState, useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import clsx from "clsx";

import LoginModal from "../modals/login";
import AppHeader from "./app-bar";
import Snackbars from "./snackbar";
import AppView from "./app-view";

import { motion, AnimatePresence } from "framer-motion";
import uiStore from "../store/ui";

import ActionTypes from "../constants/ActionTypes";
import AppDrawer from "./app-drawer";
const useStyles = makeStyles((theme) => ({
  appContent: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
}));
export default function AppContent(props) {
  let appContentElement = useRef(undefined);
  const classes = useStyles();
  const theme = useTheme();

  const [isSidebarOpen, setSidebarOpen] = useState(uiStore.sidebarIsOpen());
  const [isLoginModalOpen, setLoginModalOpen] = useState(
    uiStore.loginModalIsOpen()
  );

  const toggleSidebar = () => {
    setSidebarOpen(uiStore.sidebarIsOpen());
  };
  const toggleLoginModal = () => {
    setLoginModalOpen(uiStore.loginModalIsOpen());
  };

  const style_goFullScreen = (initialWidth) => ({
    position: "absolute",
    top: 0,
    left: `${uiStore.getSidebarWidth()}px`,
    width: `${initialWidth + uiStore.getSidebarWidth()}px`,
  });

  useEffect(() => {
    uiStore.addChangeListener(ActionTypes.UI_ON_SIDEBAR_TOGGLE, toggleSidebar);
    uiStore.addChangeListener(
      ActionTypes.UI_ON_LOGIN_MODAL_TOGGLED,
      toggleLoginModal
    );

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.UI_ON_SIDEBAR_TOGGLE,
        toggleSidebar
      );
      uiStore.removeChangeListener(
        ActionTypes.UI_ON_LOGIN_MODAL_TOGGLED,
        toggleLoginModal
      );
    };
  });
  return (
    <motion.div
      display="flex"
      flexDirection="column"
      animate={style_goFullScreen}
      className={clsx({
        [classes.appContent]: true,
      })}
      ref={appContentElement}
    >
      <AppDrawer />
      <AppHeader />
      <AppView />
      <LoginModal open={isLoginModalOpen} />
      <Snackbars />
    </motion.div>
  );
}
