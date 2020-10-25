import dispatcher from "../dispatcher";
import SocketEvents from "../constants/SocketEvents";
import LotteryBet from "../models/Lottery/Bet";

import { sendMessage as socketSendMessage } from "../socket";

/**
 *
 * @param {LotteryBet} bet
 */

export const joinLottery = (bet) => {
  socketSendMessage(SocketEvents.LOTTERY_JOIN, bet);
};

export const requestData = () => {
  socketSendMessage(SocketEvents.LOTTERY_DATA_REQUEST);
};

export const requestBrief = async () => {
  socketSendMessage(SocketEvents.LOTTERY_BRIEF_REQUEST);
};
