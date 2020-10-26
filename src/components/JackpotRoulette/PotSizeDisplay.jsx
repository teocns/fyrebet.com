import React, { useEffect, useState } from "react";

import FlipNumbers from "react-flip-numbers";
import ActionTypes from "../../constants/ActionTypes";
import jackpotRouletteStore from "../../store/jackpotRoulette";

const JackpotRoulettePotSizeDisplay = () => {
  const [CurrentPotSize, setCurrentPotSize] = useState(
    jackpotRouletteStore.getPotSize()
  );

  const onBetPlaced = () => {
    setCurrentPotSize(jackpotRouletteStore.getPotSize());
  };
  useEffect(() => {
    jackpotRouletteStore.addChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_BET,
      onBetPlaced
    );
    return () => {
      jackpotRouletteStore.removeChangeListener(
        ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_BET,
        onBetPlaced
      );
    };
  });

  return <FlipNumbers numbers={CurrentPotSize} />;
};

export default React.memo(JackpotRoulettePotSizeDisplay);
