import React, { useEffect, useState } from "react";

import { Button, Box, Grid, Paper, TextField } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import userStore from "../store/user";
import ActionTypes from "../constants/ActionTypes";
import Currencies from "../constants/Currencies";
import { SettingsApplications } from "@material-ui/icons";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      background: theme.palette.primary,
    },
    textField: {
      "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
      },
    },
    cryptoIconSvg: {
      width: "1em",
      height: "1em",
      marginRight: ".5em",
    },
  };
});

const doubleAmount = () => {
  // Get current balance
};

// Pick amount, X2, REPEAT, etc
const PlaceBetModule = () => {
  const [ActiveBalance, SetActiveBalance] = useState(
    userStore.getActiveBalance()
  );

  const onBalanceUpdated = () => {
    SetActiveBalance(userStore.getActiveBalance());
  };
  useEffect(() => {
    userStore.addChangeListener(ActionTypes.BALANCE_UPDATED, onBalanceUpdated);
    userStore.addChangeListener(
      ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED,
      onBalanceUpdated
    );
    return () => {
      userStore.removeChangeListener(
        ActionTypes.BALANCE_UPDATED,
        onBalanceUpdated
      );
      userStore.removeChangeListener(
        ActionTypes.BALANCE_ACTIVE_CURRENCY_CHANGED,
        onBalanceUpdated
      );
    };
  });

  const theme = useTheme();
  const classes = useStyles();

  if (ActiveBalance)
    return (
      <TextField
        component={Paper}
        variant="outlined"
        type="number"
        defaultValue={1}
        className={classes.textField}
        InputProps={{
          startAdornment: (
            <img
              className={classes.cryptoIconSvg}
              src={Currencies[ActiveBalance.shortCode].src}
              alt={Currencies[ActiveBalance.shortCode].name}
            />
          ),
          endAdornment: (
            <div
              style={{
                display: "inline-flex",
              }}
            >
              <Button>½</Button>
              <Button onClick={doubleAmount}>2×</Button>
              <Button>Max</Button>
            </div>
          ),
        }}
      />
    );
  return <div style={{ display: "none" }}></div>;
};

export default PlaceBetModule;
