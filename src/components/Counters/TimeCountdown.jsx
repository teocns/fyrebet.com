import React, { useState } from "react";

import { getTimeRemaining } from "../../helpers/time";
import { trimLeft } from "../../helpers/utils";
import { Timer as TimerIcon } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { useEffect } from "react";

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

  delete vals.total;
  if (Object.values(vals).every((num) => num === NaN)) {
    return "--:--";
  }
  return trimLeft(
    trimLeft(
      Object.values(vals)
        .map((num) => pad(num))
        .join(":"),
      "0"
    ),
    ":"
  );
};

/**
 * Displays a count count down timer.
 * @param {object} props props
 * @param {number} props.deadlineUnixTime
 */
const TimerCountdown = ({ deadlineUnixTime }) => {
  const [remainingTime, setRemainingTime] = useState(
    getTimeRemaining(deadlineUnixTime)
  );
  const DisplayString = genStr(remainingTime);

  useEffect(() => {
    setTimeout(() => {
      // Update new string
      setRemainingTime(getTimeRemaining(deadlineUnixTime));
    }, 1000); // Fire after exactly one second
  });
  return (
    <div>
      <TimerIcon />
      <Typography variant="overline">{DisplayString}</Typography>
    </div>
  );
};

export default React.memo(TimerCountdown); // Export with memo as we don't want this to force higher-order component rendering;
