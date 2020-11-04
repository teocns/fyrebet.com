import React, { useState, useMemo, useCallback } from "react";

import { Grid, Box, Typography, Paper } from "@material-ui/core";
import jackpotRouletteStore from "../../store/jackpotRoulette";
import { Skeleton } from "@material-ui/lab";
import chatStore from "../../store/chat";
import JackpotRouletteThreadBrief from "../../models/Jackpot/ThreadBrief";

import FlipNumbers from "react-flip-numbers";
import {
  SettingsInputAntenna,
  SettingsInputComponentOutlined,
} from "@material-ui/icons";
import { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Person as UserIcon } from "@material-ui/icons";
import TimeCountdown from "../Counters/TimeCountdown";
/**
 * A component that previews a game state
 * This component assumes a thread brief which is already present in the store
 */

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  usdAmount: {
    color: "rgb(107, 245, 114)",
  },
  bgImage: {
    position: "absolute", // :)
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    opacity: 0,
  },
}));

const JackpotRoulettePreview = ({ threadUUID, isLoading = true }) => {
  const classes = useStyles();

  // const threadBrief = jackpotRouletteStore.getThreadBrief(threadUUID);

  // const [ThreadBrief, setThreadBrief] = useState(
  //   jackpotRouletteStore.getThreadBrief(
  //     threadUUID
  //       ? jackpotRouletteStore.getThreadBrief(threadUUID)
  //       : jackpotRouletteStore.getPublicThreadOfChoice()
  //   )
  // );

  // if (!ThreadBrief) {
  //   // Force loading as we don't have the thread brief
  //   isLoading = true;

  //   // Check if we should request the brief. Has it already been requested, are we waiting for it?
  // }

  const threadBrief = new JackpotRouletteThreadBrief({
    playersCount: 23,
    isPublic: 1,
    minBetUSD: 1.0,
    maxBetUSD: 5.0,
    currentPotSize: 120.0,
    drawTimestamp: useCallback(() => parseInt(Date.now() / 1000) + 30), // In 30 seconds
  });
  const [Numbers, setNumbers] = useState("12345");
  useEffect(() => {
    const interval = setInterval(() => {
      const newVal = parseFloat(
        parseFloat(Numbers) + Math.random() * 1000
      ).toFixed(2);
      setNumbers(newVal);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const renderTotalPlayers = () => {};

  /**
   * Renders a countdown timer informing of the time left to the draw
   */
  const renderDrawTimeLeft = () => {
    return <TimeCountdown deadlineUnixTime={threadBrief.drawTimestamp} />;
  };
  const renderGameCard = () => {
    return (
      <Paper>
        <img
          style={{ width: 210, height: 118 }}
          alt={"Jackpot Roulette"}
          src={require("../../assets/jackpotbackground.jpg")}
        />
      </Paper>
    );
  };
  const renderSkeletonCard = () => {};
  return (
    <Box
      component={Paper}
      className={classes.root}
      key={threadUUID}
      width={210}
      marginRight={0.5}
      my={5}
    >
      <img
        className={classes.bgImage}
        alt={"Jackpot Roulette"}
        src={require("../../assets/jackpotbackground.jpg")}
      />
      {renderDrawTimeLeft()}
      <Box pr={2}>
        <Typography gutterBottom variant="body2">
          {threadBrief.currentPotSize}
        </Typography>
        <Box display="inline-flex" alignItems="center">
          <UserIcon fontSize={"small"} />
          <Typography variant="button" color="textSecondary">
            {threadBrief.playersCount}
          </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary">
          Bla bla bla secondary text
        </Typography>
      </Box>

      <Box display="inline-flex">
        <Typography className={classes.usdAmount}>$</Typography>
        <FlipNumbers
          height={12}
          width={12}
          color={classes.usdAmount.color}
          background="white"
          play
          perspective={200}
          numbers={Numbers.toString()}
        />
      </Box>
    </Box>
  );
};

export default JackpotRoulettePreview;
