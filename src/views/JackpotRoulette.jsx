import React, { useEffect, useState, useRef } from "react";

import clsx from "clsx";
import ActionTypes from "../constants/ActionTypes";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Button,
  Paper,
  Box,
  TextField,
  Typography,
} from "@material-ui/core";
import JackpotRouletteComponent from "../components/JackpotRoulette/GameArea";

import BetsCounter from "../components/fortune-wheel/bets-counter";

import BetsList from "../components/fortune-wheel/bets-list";

import jackpotRouletteActions from "../actions/jackpotRoulette";

import { COLORS } from "../constants/fortune-wheel";
import BetsAmount from "../components/fortune-wheel/bets-amount";
import PlaceBetModule from "../components/place-bet-module";

import jackpotRouletteStore from "../store/jackpotRoulette";

import JackpotRoulettePotSizeDisplay from "../components/JackpotRoulette/PotSizeDisplay";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
    background: `url(${require("../assets/redstage.jpg")})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  jackpotWheel: {
    //maxWidth: "300px",
  },
  betButton: {
    width: "100%",
  },
  bet50Button: {
    backgroundColor: COLORS.X50,
    color: "#ffffff",
  },
  bet2Button: {
    backgroundColor: COLORS.X2,
    color: "#ffffff",
  },
  bet3Button: {
    backgroundColor: COLORS.X3,
    color: "#ffffff",
  },
  bet5Button: {
    backgroundColor: COLORS.X5,
    color: "#ffffff",
  },
  betsColumnSection: {
    margin: 0,
  },
  betsModule: {
    transformStyle: "preserve-3d",
    transition: "transform 0.8s",
    transform: "rotateX(10deg)",
  },
  betsOpenModule: {
    transform: "rotateX(0deg)",
  },
  betPopup: {
    display: "absolute",
  },
}));

const JackpotRouletteView = ({ threadUUID }) => {
  if (!threadUUID){
    throw "JackpoRouletteView invoked with no threadUUID argument.";
  }
  const activeThread = jackpotRouletteStore.getActiveThread();

  if (!activeThread || activeThread.threadUUID !== threadUUID){
    jackpotRouletteActions.setActiveThread(threadUUID);
  }
  const [ActiveThread, setActiveThread] = useState(
    
  );

  
  const [BetsOpen, setBetsOpen] = useState(false);

  const classes = useStyles();
  const betsModule = useRef(undefined);

  const onRoundBegin = () => {
    setBetsOpen(true);
  };

  const onRoundClose = () => {
    setBetsOpen(false);
  };

  useEffect(() => {
    // Join Fortune Wheel Socket Room

    jackpotRouletteStore.addChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW,
      onRoundBegin
    );
    jackpotRouletteStore.addChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW,
      onRoundClose
    );
    jackpotRouletteActions.joinThread();
    return () => {
      jackpotRouletteStore.removeChangeListener(
        ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW,
        onRoundBegin
      );
      jackpotRouletteStore.removeChangeListener(
        ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW,
        onRoundClose
      );
      jackpotRouletteActions.leaveThread();
    };
  });

  if (!threadUUID) {
    // Get public thread of choice
    const thread = jackpotRouletteStore.getDefaultThreadBrief();
    if (!threadUUID) {
      return <Typography>Game unavailable.</Typography>;
    }
    threadUUID = thread.threadUUID;
  }
  if (!ActiveThread) {
    throw "JackpotRouletteView - Active thread is null;";
  }

  return (
    <Grid container className={classes.root} direction="row">
      <Grid item xs={12} md={12}>
        <JackpotRouletteComponent className={classes.jackpotWheel} />
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          perspective: "1000px",
        }}
      >
        <Grid
          container
          className={clsx({
            [classes.betsModule]: true,
            [classes.betsOpenModule]: BetsOpen,
          })}
          ref={betsModule}
        >
          <Grid item xs={12}>
            {
              <JackpotRoulettePotSizeDisplay
                threadUUID={ActiveThread.threadUUID}
              />
            }
            <Button
              variant="contained"
              onClick={() => {
                jackpotRouletteActions.onNewRoundBegin({
                  isDrawn: false,
                  createdTimestamp: parseInt(new Date() / 1000),
                  drawTimestamp: parseInt(new Date() / 1000) + 30,
                  roundUUID: "asdaD",
                  hashedSecret: "Asdasd",
                  roll: 12,
                });
              }}
            >
              begin
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                jackpotRouletteActions.onRoundDraw({
                  executedAtTimestamp: parseInt(new Date() / 1000),
                  roundUUID: "asdaD",
                  roll: Math.random() * 100,
                  secret: "bbbb",
                  winningBet: null,
                });
              }}
            >
              draw
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JackpotRouletteView;
