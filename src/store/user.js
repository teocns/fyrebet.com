import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Currencies from "../constants/Currencies";
import ratesStore from "./rates";

class UserStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.balances = null;
  }
  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  getActiveCurrency() {
    if (this.activeCurrency) {
      return this.activeCurrency;
    }
    const storedActiveCurrency = localStorage.getItem("activeCurrency");
    if (storedActiveCurrency && storedActiveCurrency in Currencies) {
      this.setActiveCurrency(storedActiveCurrency);
      return storedActiveCurrency;
    }
    const backdropCurrency = Currencies.BTC.code;
    this.setActiveCurrency(backdropCurrency);
    return backdropCurrency;
  }
  setActiveCurrency(shortCode) {
    if (!(shortCode in Currencies)) {
      return;
    }
    localStorage.setItem("activeCurrency", shortCode);
    this.activeCurrency = shortCode;
  }

  setBalance(balances) {
    this.balances = balances;
  }
  getBalance(shortCode) {
    if (shortCode) {
      return this.balances[shortCode];
    }
    return this.balances;
  }
  getActiveBalance() {
    // Returns object { shortCode, amount, usdValue }
    if (!this.balances) {
      return null;
    }

    const activeShortcode = this.getActiveCurrency();
    const valueInCrypto = this.getBalance(activeShortcode);

    const coinRate = ratesStore.getRates(activeShortcode);

    const ret = {
      amount: valueInCrypto,
      usdValue: coinRate.usdValue * valueInCrypto,
      shortCode: activeShortcode,
    };
    return ret;
  }
}

const userStore = new UserStore();

userStore.dispatchToken = dispatcher.register((event) => {
  let willEmitChange = true;
  switch (event.actionType) {
    case ActionTypes.User.BALANCE_ACTIVE_CURRENCY_CHANGED:
      userStore.setActiveCurrency(event.data.shortCode);
      break;
    case ActionTypes.User.BALANCE_UPDATED:
      userStore.setBalance(event.data.balances);
      break;
    default:
      willEmitChange = false; // We did not catch any Pertinent action type.
      break; // Do nothing else.
  }
  willEmitChange && userStore.emitChange(event.actionType, event.data);
});

export default userStore;
