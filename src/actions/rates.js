//import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import { sendMessage } from "../socket";
import dispatcher from "../dispatcher";

// Subscribes to socket's fortune wheel room
export function onRatesUpdated(rates) {
  dispatcher.dispatch({
    actionType: ActionTypes.RATES_UPDATED,
    data: { rates },
  });
}

export function toggleShouldRatesBeUSD() {
  dispatcher.dispatch({
    actionType: ActionTypes.RATES_SHOULD_DISPLAY_USD,
  });
}
