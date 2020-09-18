import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Currencies from "../constants/Currencies";
import ratesStore from "./rates";

const CHANGE_EVENT = "change";

class BalanceStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.balances = null;
  }
  addChangeListener(event, callback) {
    this.on(event ?? CHANGE_EVENT, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event ?? CHANGE_EVENT, callback);
  }

  emitChange(event, data) {
    this.emit(event ?? CHANGE_EVENT, data);
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

const balanceStore = new BalanceStore();

balanceStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED:
      balanceStore.setActiveCurrency(event.data.shortCode);
      break;
    case ActionTypes.BALANCE_UPDATED:
      balanceStore.setBalance(event.data.balances);
      break;
    default:
      break; // Do nothing
  }
  balanceStore.emitChange(event.actionType, event.data);
});

export default balanceStore;
