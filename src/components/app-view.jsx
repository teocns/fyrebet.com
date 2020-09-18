import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import UserProfileView from "../views/user-profile";
import HomePlaygroundView from "../views/home-playground";
import AdminView from "../views/admin";
import FortuneWheelView from "../views/fortune-wheel";

const useStyles = makeStyles((theme) => ({
  appView: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
}));

const AppView = () => {
  const classes = useStyles();

  return (
    <div className={classes.appView}>
      <Route exact path="/" component={HomePlaygroundView} />
      <Route path="/profile" component={UserProfileView} />
      <Route path="/admin" component={AdminView} />
      <Route path={`/jackpot`} component={FortuneWheelView}></Route>
      <Route path={`/blackjack`} render={() => <p>Ciaooo</p>}></Route>
    </div>
  );
};

export default AppView;
