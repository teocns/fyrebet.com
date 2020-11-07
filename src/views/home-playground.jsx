/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LotteryWidget from "../components/Widgets/Lottery";
import JackpotRouletteView from "./JackpotRoulette";
import jackpotRouletteStore from "../store/jackpotRoulette";
import jackpotRouletteActions from "../actions/jackpotRoulette";
import JackpotRoulettePreview from "../components/JackpotRoulette/Preview";
import chatStore from "../store/chat";

const useStyles = makeStyles((theme) => ({
  appView: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },

  gameCard: {
    margin: theme.spacing(3),
    width: 200,
    height: 100,
    overflow: "hidden",
    display: "block",
  },

  gameCardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  root: {
    //background: require("../assets/background.jpg"),
  },
}));

/**
 * We require to have:
 * - Public thread of jackpot roulette
 * @param {any} props
 */
const GamesPreviewView = (props) => {
  const classes = useStyles();

  // const briefsLoaded = Object.values(briefs).every(
  //   (item) => item !== undefined
  // );

  // We gotta make sure that thread briefs are up to date.

  return (
    <div className={classes.root}>
      <Paper
        component={Link}
        to="/jackpot"
        className={classes.gameCard}
        elevation={2}
      >
        <motion.img
          whileHover={{
            scale: 1.15,
          }}
          transition={{
            duration: 0.175,
          }}
          src={require("../assets/jackpotbackground.jpg")}
          className={classes.gameCardImage}
        />
      </Paper>

      <JackpotRoulettePreview />
      <Paper component={Link} to="/duel" style={{ padding: "3rem" }}>
        Create duel
      </Paper>
    </div>
  );
};

export default GamesPreviewView;
