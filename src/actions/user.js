import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Fetcher from "../classes/fetcher";
import SocketEvents from "../constants/SocketEvents";

import sessionStore from "../store/session";

import { sendMessage } from "../socket";
import Environment from "../constants/Environment";

export const getAll = async () => {
  return await Fetcher.get("/all-users");
};

export const getUserBrief = (userUUID) => {
  return Fetcher.get("/user-brief", { userUUID });
};

export const autoComplete = async (query) => {
  return (await Fetcher.get("/userAutocomplete", { query })) || [];
};

export function onBalanceUpdated(balances) {
  dispatcher.dispatch({
    actionType: ActionTypes.BALANCE_UPDATED,
    data: { balances },
  });
}

export function changeActiveBalance(shortCode) {
  dispatcher.dispatch({
    actionType: ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED,
    data: { shortCode },
  });
}
