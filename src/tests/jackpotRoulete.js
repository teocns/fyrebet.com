import * as jackpotRouletteActions from "../actions/jackpotRoulette";
import JackpotRouletteBet from "../models/Jackpot/Bet";

export default () => {
  window.onNewRoundBegin = () => {
    jackpotRouletteActions.onNewRoundBegin({
      isDrawn: false,
      createdTimestamp: parseInt(new Date() / 1000),
      drawTimestamp: parseInt(new Date() / 1000) + 30,
      roundUUID: "asdaD",
      hashedSecret: "Asdasd",
      roll: null,
    });
  };

  window.onRoundDraw = () => {
    jackpotRouletteActions.onRoundDraw({
      executedAtTimestamp: parseInt(new Date() / 1000),
      roundUUID: "asdaD",
      roll: Math.random() * 100,
      secret: "bbbb",
      winningBet: null,
    });
  };
};
