import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";

import { Link, BrowserRouter } from "react-router-dom";

import * as Icon from "@material-ui/icons/";

import VIEWS from "../constants/views";

import ActionTypes from "../constants/ActionTypes";

import { toggleLoginModal, toggleSidebar } from "../actions/ui";

import sessionStore from "../store/session";
import uiStore from "../store/ui";
import * as sessionActions from "../actions/session";
import { gotoView } from "../actions/ui";

import CurrencySelect from "./currency-select";

import ratesStore from "../store/rates";
import LanguagePicker from "./pickers/Language";

const useStyles = makeStyles((theme) => {
  return {
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  };
});

const AppBarComponent = () => {
  const classes = useStyles();

  const [user, setUser] = useState(sessionStore.getUser());
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isAuthenticated = sessionStore.isAuthenticated;

  const onUserUpdated = () => {
    setUser(sessionStore.getUser());
  };

  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.SESSION_USER_DATA_RECEIVED,
      onUserUpdated
    ); // When component mounted, subscribe to dispatcher events of session.

    return () => {
      // On component unmounting, remove previous listener.
      sessionStore.removeChangeListener(
        ActionTypes.SESSION_USER_DATA_RECEIVED,
        onUserUpdated
      );
    };
  });

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    sessionActions.logout();
    handleUserMenuClose();
  };

  const renderUserInfo = () => {
    if (isAuthenticated)
      return (
        <React.Fragment>
          <Button
            aria-label={user.username}
            style={{ color: "#ffffff" }}
            endIcon={<Icon.Person />}
            onClick={handleUserMenuOpen}
          >
            {user.username}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={handleUserMenuClose}
            >
              Profile
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin"
              onClick={handleUserMenuClose}
            >
              Admin Panel
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>My account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      );
    else
      return (
        <React.Fragment>
          <Button
            // component={Link}
            // to="/profile"
            aria-label="Login"
            style={{ color: "#ffffff" }}
            endIcon={<Icon.Person />}
            onClick={toggleLoginModal}
          >
            Login now
          </Button>
        </React.Fragment>
      );
  };

  return (
    <AppBar elevation={0} position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <Icon.Menu />
        </IconButton>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          component={Link}
          to="/"
        >
          <Icon.Home />
        </IconButton>

        <CurrencySelect></CurrencySelect>

        {renderUserInfo()}
        <LanguagePicker />
      </Toolbar>
    </AppBar>
  );
};
export default React.memo(AppBarComponent);
