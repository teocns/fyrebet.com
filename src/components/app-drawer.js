import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import dispatcher from "../dispatcher";

import Chat from "./chat/module";
import uiStore from "../store/ui";
import { toggleSidebar } from "../actions/ui";

import { motion, AnimatePresence, useAnimation } from "framer";
import Drawer from "@material-ui/core/Drawer";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ActionTypes from "../constants/ActionTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    position: "relative!important",
    width: 320,
    willChange: "width",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  hide: {
    display: "none",
  },
}));

export default function AppDrawer() {
  const classes = useStyles();
  const theme = useTheme();

  const [isOpen, setOpen] = useState(uiStore.sidebarIsOpen());

  const changeListener = () => {
    setOpen(uiStore.sidebarIsOpen());
  };
  useEffect(() => {
    uiStore.addChangeListener(ActionTypes.UI_ON_SIDEBAR_TOGGLE, changeListener);

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.UI_ON_SIDEBAR_TOGGLE,
        changeListener
      );
    };
  });

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className={classes.root}
          initial={{
            opacity: isOpen ? 1 : 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <Drawer
            className={clsx({
              [classes.drawer]: true,
            })}
            classes={{ paper: classes.drawer }}
            variant="persistent"
            anchor="left"
            open={true}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={toggleSidebar}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <Chat style={{ height: "100%" }} id="coolfra" />
          </Drawer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
