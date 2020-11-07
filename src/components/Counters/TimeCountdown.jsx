import React, { useState } from "react";

import { getTimeRemaining } from "../../helpers/time";
import { trimLeft } from "../../helpers/utils";
import { Timer as TimerIcon } from "@material-ui/icons";
import { Typography, Box, LinearProgress } from "@material-ui/core";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
/**
 * Adds a leading zero to the number if necessary
 * @param {number} n
 */
const pad = (n) => {
  return n < 10 ? "0" + n : n;
};

const genStr = (vals) => {
  // [vals] could be day, minute, hour, second
  // Suppose we have 0:12:14:0 (d-h-m-s). We want to stop filtering at (d) as next value would be > 0

  if (vals.total <= 0) {
    return "--:--";
  }
  delete vals.total;

  // Trim 0 and : from left to right
  let cacheString = Object.values(vals)
    .map((num) => pad(num))
    .join(":");

  while (
    cacheString.length > 5 &&
    ((cacheString.charAt(0) === "0" &&
      (cacheString.charAt(1) === "0" || cacheString.charAt(1) === ":")) ||
      cacheString.charAt(0) === ":")
  ) {
    cacheString = cacheString.substring(1);
  }
  return cacheString;
};

const calculateProgress = (countdownStartUnix, deadlineUnix, round = false) => {
  /**
   * progress = [countDeadline (140) - timeNow(130)] === 10;

    total = [countDeadline (140) - countStart(120) ] === 20;
   */

  const progressMadeInSeconds = deadlineUnix - Date.now() / 1000;
  const totalProgressToBeMade = deadlineUnix - countdownStartUnix;
  const floatVal = (progressMadeInSeconds * 100) / totalProgressToBeMade;
  return round ? parseInt(floatVal) : floatVal;
};

/**
 * Displays a count count down timer.
 * @param {object} props props
 * @param {number} props.deadlineUnix
 * @param {number} props.countdownStartUnix
 * @param {boolean} props.isProgressBar
 */
const TimerCountdown = ({
  deadlineUnix,
  countdownStartUnix,
  isProgressBar,
  animate = true,
}) => {
  const [remainingTime, setRemainingTime] = useState(
    getTimeRemaining(deadlineUnix)
  );

  const isTimeOut = remainingTime.total <= 0;

  useEffect(() => {
    let timeOut = undefined;
    // Keep refershing only if time is not up, otherwise stop it.
    if (!isTimeOut) {
      const refreshInterval = isProgressBar ? 50 : 1000; // Put a faster refresh interval for ProgressBar
      timeOut = setTimeout(() => {
        // Update new string
        setRemainingTime(getTimeRemaining(deadlineUnix));
      }, refreshInterval); // Fire after exactly one second
    } else {
      console.log("Stopped timer");
    }
    return () => {
      clearTimeout(timeOut); // Avoid duplicates / excess invocations.
    };
  });
  const renderProgress = () => {
    const progr = calculateProgress(countdownStartUnix, deadlineUnix);
    const progressElement = (
      <LinearProgress variant="determinate" color="secondary" value={progr} />
    );

    if (animate) {
      const cntDone = progr <= 0;
      return (
        <motion.div
          animate={{
            bottom: cntDone ? 100 : 0,
            opacity: cntDone ? 0 : 1,
          }}
          initial={{
            bottom: cntDone ? 100 : 0,
            opacity: cntDone ? 0 : 1,
          }}
        >
          {progressElement}
        </motion.div>
      );
    } else {
      return progressElement;
    }
  };
  const renderTimer = () => {
    const DisplayString = genStr(remainingTime);
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <TimerIcon style={{ fontSize: 13 }} />
        <Typography variant="overline" style={{ lineHeight: "13px" }}>
          {DisplayString}
        </Typography>
      </div>
    );
  };
  return isProgressBar ? renderProgress() : renderTimer();
};

export default React.memo(TimerCountdown); // Export with memo as we don't want this to force higher-order component rendering;
