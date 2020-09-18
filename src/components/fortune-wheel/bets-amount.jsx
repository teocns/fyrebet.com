import React, { useState, useEffect } from "react";

import fortuneWheelStore from "../../store/fortune-wheel";
import ActionTypes from "../../constants/ActionTypes";
import PersonIcon from "@material-ui/icons/Person";

const BetsAmount = ({ multiplier }) => {
  const [BetsTotal, setBetsTotal] = useState(
    fortuneWheelStore.getBetsAmountUSD(multiplier)
  );

  const onBetPlaced = ({ bet }) => {
    if (bet.multiplier === multiplier) {
      setBetsTotal(fortuneWheelStore.getBetsAmountUSD(multiplier));
    }
  };
  const onStatusReceived = () => {
    setBetsTotal(fortuneWheelStore.getBetsAmountUSD(multiplier));
  };
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_USER_BET,
      onBetPlaced
    );

    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
      onStatusReceived
    );

    return () => {
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_USER_BET,
        onBetPlaced
      );

      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
        onStatusReceived
      );
    };
  });

  return (
    <span style={{ color: "#ffffff" }}>
      ${numberWithCommas(BetsTotal.toFixed(2))}
    </span>
  );
};

export default BetsAmount;
