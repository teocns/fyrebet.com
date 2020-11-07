import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import UserProfileView from "../views/user-profile";
import HomePlaygroundView from "../views/home-playground";
import AdminView from "../views/admin";
import JackpotRoulette from "../views/JackpotRoulette";
import CreateDuelView from "../views/duels/CreateDuel";
import { Backdrop } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appView: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    background: "rgb(34, 7, 52)",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const AppView = () => {
  const classes = useStyles();

  return (
    <div className={classes.appView}>
      <Route exact path="/" component={HomePlaygroundView} />
      <Route path="/profile" component={UserProfileView} />
      <Route path="/admin" component={AdminView} />
      <Route path={`/jackpot`} component={JackpotRoulette}></Route>
      <Route path={`/blackjack`} render={() => <p>Ciaooo</p>}></Route>
      <Route path={`/duel`} component={CreateDuelView}></Route>
    </div>
  );
};

export default AppView;
