import dispatcher from "../dispatcher";
import SocketEvents from "../constants/SocketEvents";
import LotteryBet from "../models/Lottery/Bet";

import { sendMessage as socketSendMessage } from "../socket";

/**
 *
 * @param {LotteryBet} bet
 */
