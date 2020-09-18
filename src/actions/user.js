import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Fetcher from "../helpers/fetcher";
import SocketEvents from "../constants/SocketEvents";

import sessionStore from "../store/session";

import { sendMessage } from "../socket";
import Environment from "../constants/Environment";

export const getAll = async () => {
  return await Fetcher.get("/all-users");
};
