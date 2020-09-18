import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

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
