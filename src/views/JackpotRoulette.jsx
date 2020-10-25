import React, { useEffect, useState, useRef } from "react";

import clsx from "clsx";
import ActionTypes from "../constants/ActionTypes";
import { makeStyles } from "@material-ui/core/styles";

import { Grid, Button, Paper, Box, TextField } from "@material-ui/core";
import JackpotRouletteComponent from "../components/JackpotRoulette/Component";

import BetsCounter from "../components/fortune-wheel/bets-counter";

import BetsList from "../components/fortune-wheel/bets-list";

import { joinRoom, leaveRoom, placeBet } from "../actions/fortune-wheel";

import { COLORS } from "../constants/fortune-wheel";
import BetsAmount from "../components/fortune-wheel/bets-amount";
import PlaceBetModule from "../components/place-bet-module";

import fortuneWheelStore from "../store/fortuneWheel";

import tests from "../tests/jackpotRoulete";
import jackpotRoulete from "../tests/jackpotRoulete";

import * as jackpotRouletteActions from "../actions/jackpotRoulette";
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

const JackpotRouletteView = () => {
  const [BetsOpen, setBetsOpen] = useState(false);
  const classes = useStyles();
  tests();
  useEffect(() => {
    // Join Fortune Wheel Socket Room

    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN,
      onRoundBegin
    );
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW,
      onRoundClose
    );
    joinRoom();
    return () => {
      leaveRoom();
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN,
        onRoundBegin
      );
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW,
        onRoundClose
      );
    };
  });

  const betAmountInputEl = useRef(undefined);
  const betsModule = useRef(undefined);

  const onRoundBegin = () => {
    setBetsOpen(true);
  };

  const onRoundClose = () => {
    setBetsOpen(false);
  };

  const betOn = (multiplier) => {
    if (!(betAmountInputEl && betAmountInputEl.current)) {
      return;
    }

    const betAmount = parseFloat(
      betAmountInputEl.current.querySelector("input").value
    );
    const betCurrency = "btc";
    placeBet({ betAmount, multiplier, betCurrency });
  };
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
            {<JackpotRoulettePotSizeDisplay />}
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

          {/* {[2, 3, 5, 50].map((multiplier) => {
            return (
              <Grid item xs={3} className={classes.betsColumnSection}>
                <Button
                  variant="contained"
                  size="large"
                  className={clsx({
                    [classes[`bet${multiplier}Button`]]: true,
                    [classes.betButton]: true,
                  })}
                  onClick={() => {
                    betOn(multiplier);
                  }}
                >
                  X2
                </Button>
                <div
                  style={{
                    display: "inline-flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <BetsCounter multiplier={multiplier} />
                  <BetsAmount multiplier={multiplier} />
                </div>
                <BetsList multiplier={multiplier} showColumnNames={false} />
              </Grid>
            );
          })} */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JackpotRouletteView;
