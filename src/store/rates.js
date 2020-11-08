import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { sendMessage } from "../socket";

class RatesStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.rates = {};
  }

  addChangeListener(actionType, callback) {
    this.on(actionType, callback);
  }

  removeChangeListener(actionType, callback) {
    this.removeListener(actionType, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  setRates(rates) {
    this.rates = rates;
  }

  getRates(shortCode) {
    if (shortCode) {
      return this.rates[shortCode];
    }
    return this.rates;
  }

  getShouldRatesBeUSD() {
    function isset(prop) {
      return typeof prop === "boolean";
    }

    // Invoked as getter
    if (!isset(this._shouldRatesBeUSD)) {
      // Try to get from local storage

      const val = localStorage.getItem("shouldRatesBeUSD");
      if (!isset(val)) {
        localStorage.setItem(
          "shouldRatesBeUSD",
          (this._shouldRatesBeUSD = true)
        );
      }
    }
    return this._shouldRatesBeUSD;
  }

  toggleShouldRatesBeUSD() {
    localStorage.setItem(
      "shouldRatesBeUSD",
      (this._shouldRatesBeUSD = !this._shouldRatesBeUSD)
    );
  }
}

const ratesStore = new RatesStore();

ratesStore.dispatchToken = dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.Rates.UPDATED:
      console.log("Rates updated");
      ratesStore.setRates(action.data.rates);
      break;
    case ActionTypes.Rates.SHOULD_DISPLAY_USD:
      ratesStore.toggleShouldRatesBeUSD();
      break;
    default:
      // Do nothign
      break;
  }
  ratesStore.emitChange(action.actionType, action.data);
});

export default ratesStore;
