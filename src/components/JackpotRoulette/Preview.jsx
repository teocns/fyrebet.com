import React, { useState, useRef } from "react";

import {
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardActionArea,
} from "@material-ui/core";
import jackpotRouletteStore from "../../store/jackpotRoulette";
import { Skeleton } from "@material-ui/lab";
import chatStore from "../../store/chat";
import JackpotRouletteThreadBrief from "../../models/Jackpot/ThreadBrief";
import { Link } from "react-router-dom";
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
    overflow: "hidden",
    maxWidth: 480,
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
  cardComponent: {
    margin: 0,
  },
}));

const dNowStart = parseInt(Date.now() / 1000);
const gameDrawTimestamp = dNowStart + 5;

const threadBrief = new JackpotRouletteThreadBrief({
  playersCount: 23,
  isPublic: 1,
  minBetUSD: 1.0,
  maxBetUSD: 5.0,
  currentPotSize: 120.0,
  drawCountdownStartedTimestamp: dNowStart,
  drawTimestamp: gameDrawTimestamp,
});

/**
 * Component assumes that
 */
const JackpotRoulettePreview = ({ threadUUID, isLoading = false }) => {
  const classes = useStyles();

  const [ThreadBrief, setThreadBrief] = useState(
    jackpotRouletteStore.getThreadBrief(threadUUID)
  );

  // if (!ThreadBrief) {
  //   // Force loading as we don't have the thread brief
  //   isLoading = true;

  //   // Check if we should request the brief. Has it already been requested, are we waiting for it?
  // }

  const [Numbers, setNumbers] = useState("12345");
  useEffect(() => {
    const interval = setTimeout(() => {
      const newVal = parseFloat(
        parseFloat(Numbers) + Math.random() * 1000
      ).toFixed(2);
      setNumbers(newVal);
    }, 750);

    return () => {
      clearTimeout(interval);
    };
  });

  const renderTotalPlayers = () => {};

  /**
   * Renders a countdown timer informing of the time left to the draw
   */

  const renderSkeletonCard = () => {};

  // console.log({
  //   drawTimestamp: threadBrief.drawTimestamp,
  //   drawCountdownStartedTimestamp: threadBrief.drawCountdownStartedTimestamp,
  //   diff: threadBrief.drawTimestamp - threadBrief.drawCountdownStartedTimestamp,
  //   left: threadBrief.drawTimestamp - parseInt(Date.now() / 1000),
  // });

  const displayProgressbar = !(
    threadBrief.drawTimestamp - parseInt(Date.now() / 1000) <=
    0
  );

  const lnkRef = useRef(null);

  return (
    <Card
      elevation={2}
      background={"white"}
      className={classes.root}
      onClick={() => {
        lnkRef && lnkRef.current && lnkRef.current.click();
      }}
    >
      <Link to={"/jackpot"} ref={lnkRef} style={{ display: "none" }} />
      <Box
        component={CardActionArea}
        className={classes.cardComponent}
        key={threadUUID}
        width={210}
        marginRight={0.5}
        my={5}
      >
        <img
          className={classes.bgImage}
          alt={"Jackpot Roulette"}
          store
          src={require("../../assets/jackpotbackground.jpg")}
        />

        <Box display="flex" pb={2}>
          <TimeCountdown
            isProgressBar={true}
            countdownStartUnix={threadBrief.drawCountdownStartedTimestamp}
            deadlineUnix={threadBrief.drawTimestamp}
          />
        </Box>
        <Typography gutterBottom variant="h6">
          Jackpot
        </Typography>
        <Box
          display="inline-flex"
          flex="1"
          alignItems="center"
          style={{ fontSize: 17 }}
        >
          <Typography className={classes.usdAmount}>$</Typography>
          <FlipNumbers
            height={18}
            width={18}
            color={classes.usdAmount.color}
            background="white"
            play
            perspective={5000}
            numberStyle={{ fontWeight: 900, fontSize: 17 }}
            nonNumberStyle={{ fontWeight: 900, fontSize: 17 }}
            numbers={new Number(Numbers).toLocaleString()}
          />
        </Box>
        {/* Footer with Number of players and time left */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flex="1"
          p={1}
        >
          <Box display="flex" alignItems="center">
            <UserIcon style={{ fontSize: 13 }} />
            <Typography variant="overline" color="textSecondary">
              {threadBrief.playersCount}
            </Typography>
          </Box>
          <TimeCountdown
            countdownStartUnix={threadBrief.drawCountdownStartedTimestamp}
            isProgressBar={false}
            deadlineUnix={threadBrief.drawTimestamp}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default JackpotRoulettePreview;
