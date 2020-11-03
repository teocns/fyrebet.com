import Bet from "../Bet";

export default class LotteryBet extends Bet {
  lotteryBetUUID;
  timestamp;

  constructor(obj) {
    super();
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
