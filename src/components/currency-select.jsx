import React, { useRef, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import ActionTypes from "../constants/ActionTypes";

import {
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  Button,
  FormControl,
  Divider,
  IconButton,
  Fab,
} from "@material-ui/core";

import Currencies from "../constants/Currencies";
import { useState } from "react";
import sessionStore from "../store/session";

import * as balanceActions from "../actions/balance";

import Rate from "./rate";
import balanceStore from "../store/balance";

import * as Icons from "@material-ui/icons/";

import { toggleShouldRatesBeUSD } from "../actions/rates";
import ratesStore from "../store/rates";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
    color: "#ffffff",
  },
  cryptoIconSvg: {
    width: "1em",
    height: "1em",
    marginRight: ".5em",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
  },
}));

const CurrencySelect = () => {
  const classes = useStyles();
  const selectElement = useRef(null);

  const [SelectedCurrency, setSelectedCurrency] = useState(
    Object.values(Currencies)[0].code
  );

  const [ShouldRatesBeUSD, setShouldRatesBeUSD] = useState(
    ratesStore.getShouldRatesBeUSD()
  );

  const [IsOpen, setIsOpen] = useState(false);

  const [balances, setBalances] = useState(balanceStore.getBalance());

  const onBalanceUpdated = () => {
    setBalances(balanceStore.getBalance());
  };

  const onShouldRatesBeUSDChanged = () => {
    setShouldRatesBeUSD(ratesStore.getShouldRatesBeUSD());
  };

  useEffect(() => {
    balanceStore.addChangeListener(
      ActionTypes.BALANCE_UPDATED,
      onBalanceUpdated
    );
    balanceStore.addChangeListener(
      ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED,
      onActiveBalanceChange
    );
    ratesStore.addChangeListener(
      ActionTypes.RATES_SHOULD_DISPLAY_USD,
      onShouldRatesBeUSDChanged
    );
    return () => {
      balanceStore.removeChangeListener(
        ActionTypes.BALANCE_UPDATED,
        onBalanceUpdated
      );
      balanceStore.removeChangeListener(
        ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED,
        onActiveBalanceChange
      );
      ratesStore.removeChangeListener(
        ActionTypes.RATES_SHOULD_DISPLAY_USD,
        onShouldRatesBeUSDChanged
      );
    };
  });

  const renderCurrencies = () => {
    return Object.values(Currencies).map((currency, index) => {
      return (
        <MenuItem key={index} value={currency.code}>
          <Rate shortCode={currency.code} amount={balances[currency.code]} />
        </MenuItem>
      );
    });
  };

  const onActiveBalanceChange = () => {
    setSelectedCurrency(balanceStore.getActiveBalance().shortCode);
  };

  const changeCurrency = (event) => {
    const shortCode = event.target.value;
    if (shortCode in Currencies) {
      balanceActions.changeActiveBalance(shortCode);
    }
  };
  if (!balances) {
    return <div style={{ display: "none" }}></div>;
  }
  return (
    <FormControl
      disabled={balances === undefined}
      variant="outlined"
      className={classes.formControl}
    >
      <Select
        id="demo-controlled-open-select"
        ref={selectElement}
        value={SelectedCurrency}
        open={IsOpen}
        onClose={(e) => {
          setIsOpen(false);
        }}
        onOpen={() => {
          setIsOpen(true);
        }}
        displayEmpty
        className={classes.selectEmpty}
        onChange={changeCurrency}
      >
        {renderCurrencies()}
        <Divider />
        <Tooltip
          title="Print all currencies in USD"
          aria-label="Currency converter"
        >
          <IconButton aria-label="AttachMoney" onClick={toggleShouldRatesBeUSD}>
            {ShouldRatesBeUSD ? <Icons.MoneyOff /> : <Icons.AttachMoney />}
          </IconButton>
        </Tooltip>
        <Tooltip title="View your betting stats" aria-label="Stats">
          <IconButton aria-label="InsertChart">
            <Icons.InsertChart />
          </IconButton>
        </Tooltip>
      </Select>
    </FormControl>
  );
};

export default CurrencySelect;
