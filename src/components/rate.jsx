import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import ratesStore from "../store/rates";
import Currencies from "../constants/Currencies";
import ActionTypes from "../constants/ActionTypes";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    cryptoIconSvg: {
      width: "1em",
      height: "1em",
      marginRight: ".5em",
    },
  };
});

const Rate = ({
  shortCode,
  amount,
  printShortCode = true,
  iconPosition = "left",
}) => {
  const [shouldRatesBeUSD, setshouldRatesBeUSD] = useState(
    ratesStore.getShouldRatesBeUSD()
  );

  const onShouldRatesBeUSDChanged = (tf) => {
    setshouldRatesBeUSD(ratesStore.getShouldRatesBeUSD());
  };

  const classes = useStyles();
  useEffect(() => {
    ratesStore.addChangeListener(
      ActionTypes.RATES_SHOULD_DISPLAY_USD,
      onShouldRatesBeUSDChanged
    );
    return () => {
      ratesStore.removeChangeListener(
        ActionTypes.RATES_SHOULD_DISPLAY_USD,
        onShouldRatesBeUSDChanged
      );
    };
  });

  const printRate = () => {
    if (shouldRatesBeUSD || shortCode === "USD") {
      const rates = ratesStore.getRates();
      if (!(shortCode   in rates)) {
        return amount;
      }
      const convertedValue =
        undefined === amount ? 0 : rates[shortCode].usdValue * amount;
      return "$" + convertedValue.toFixed(2);
    } else {
      return Number.parseFloat(undefined === amount ? 0 : amount).toFixed(8);
    }
  };
  const currency = Currencies[shortCode];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: iconPosition === "left" ? "row" : "row-inverse",
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <img
          className={classes.cryptoIconSvg}
          src={currency.src}
          alt={currency.name}
        />
        <code style={{ flex: 1, flexGrow: 1 }}>{printRate()}</code>
      </div>
      {printShortCode && (
        <code style={{ marginLeft: ".5rem" }}>{currency.code}</code>
      )}
    </div>
  );
};

export default Rate;
