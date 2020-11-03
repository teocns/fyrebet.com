import React, { useState } from "react";

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
/**
 * A component that previews a game state
 * This component assumes a thread brief which is already present in the store
 */

const JackpotRoulettePreview = ({ threadUUID, isLoading = true }) => {
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
  });
  const [Numbers, setNumbers] = useState("12345");
  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers(parseFloat(Numbers + Math.random() * 100).toFixed(2));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const renderTotalPlayers = () => {};

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
      key={threadUUID}
      width={210}
      marginRight={0.5}
      my={5}
    >
      {threadBrief ? (
        <img
          style={{ width: 210, height: 118 }}
          alt={"Jackpot Roulette"}
          src={require("../../assets/jackpotbackground.jpg")}
        />
      ) : (
        <Skeleton variant="rect" width={210} height={118} />
      )}

      {threadBrief ? (
        <Box pr={2}>
          <Typography gutterBottom variant="body2">
            {threadBrief.currentPotSize}
          </Typography>
          <Typography display="block" variant="caption" color="textSecondary">
            Players: {threadBrief.playersCount}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Bla bla bla secondary text
            {/* {`${threadBrief.views} • ${threadBrief.createdAt}`} */}
          </Typography>
        </Box>
      ) : (
        <Box pt={0.5}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      )}

      <FlipNumbers
        height={12}
        width={12}
        color="rgb(107, 245, 114)"
        background="white"
        play
        perspective={200}
        numbers={Numbers.toString()}
      />
    </Box>
  );
};

export default JackpotRoulettePreview;
