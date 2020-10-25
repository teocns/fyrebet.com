import React, { useState, useEffect } from "react";

import lotteryActions from "../../actions/lottery";

import lotteryStore from "../../store/lottery";

import { Paper, Typography } from "@material-ui/core";

import { getTimeRemaining } from "../../helpers/time";

const LotteryWidget = () => {
  const [LotteryBrief, setLotteryBrief] = useState(lotteryStore.getBrief());

  const [TimeLeft, setTimeLeft] = useState(
    getTimeRemaining(LotteryBrief.drawTimestamp)
  );

  useEffect(() => {
    let renderTimeLeftTimeout = setTimeout(() => {
      setTimeLeft(getTimeRemaining(LotteryBrief.drawTimestamp));
    }, 1000);

    return () => {
      clearTimeout(renderTimeLeftTimeout);
    };
  });
  return (
    <Paper>
      <Typography>{LotteryBrief.prize}</Typography>
      <Typography>
        {TimeLeft.minutes}:{TimeLeft.seconds}
      </Typography>
    </Paper>
  );
};

export default React.memo(LotteryWidget);
