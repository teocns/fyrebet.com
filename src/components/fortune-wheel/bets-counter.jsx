import React, { useState, useEffect } from "react";

import fortuneWheelStore from "../../store/fortuneWheel";
import ActionTypes from "../../constants/ActionTypes";
import PersonIcon from "@material-ui/icons/Person";

const BetsCounter = ({ multiplier }) => {
  const [BetsCount, setBetsCount] = useState(
    fortuneWheelStore.getBets(multiplier).length
  );

  const onBetPlaced = ({ bet }) => {
    const _multiplier = bet.multiplier;

    if (_multiplier === multiplier) {
      setBetsCount(fortuneWheelStore.getBets(multiplier).length);
    }
  };

  const onStatusReceived = () => {
    setBetsCount(fortuneWheelStore.getBets(multiplier).length);
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
    <div>
      <PersonIcon style={{ color: "#ffffff" }} />
      <span style={{ color: "#ffffff" }}>{BetsCount}</span>
    </div>
  );
};

export default BetsCounter;
