import React from "react";

import { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import assetUrl from "../helpers/assetUrl";

import logoBanner from "../assets/brand/bull-logo-full.png";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    alignItems: "center",
    background: "white",
  },
  banner: {
    maxWidth: 480,
    width: 480,
  },
}));

/**
 * A preload component that displays the fyrebet logo until all the games are loaded
 */
const AppPreload = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img
        src={assetUrl(logoBanner)}
        className={classes.banner}
        alt="Fyrebet"
      />
    </div>
  );
};

export default AppPreload;
