import dispatcher from "../dispatcher";

import ratesStore from "../store/rates";

export function getValueInUSD({ currency, amount }) {
  const rates = ratesStore.getRates();
  const convertedValue =
    undefined === amount ? 0 : rates[currency].usdValue * amount;
  return parseFloat(convertedValue.toFixed(2));
}

export function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
