import React, { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";

import {
  Paper,
  Button,
  IconButton,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from "@material-ui/core";
import { useEffect } from "react";

import fortuneWheelStore from "../../store/fortuneWheel";

import Rate from "../rate";

import ActionTypes from "../../constants/ActionTypes";

const BetsList = ({ multiplier, showColumnNames = false }) => {
  const [bets, setBets] = useState(fortuneWheelStore.getBets(multiplier) || []);

  const onUserBetReceived = ({ bet }) => {
    if (bet.multiplier === multiplier)
      setBets([...fortuneWheelStore.getBets(multiplier)]);
  };

  const onStatusReceived = () => {
    setBets([...fortuneWheelStore.getBets(multiplier)]);
  };
  useEffect(() => {
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_USER_BET,
      onUserBetReceived
    );
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
      onStatusReceived
    );
    return () => {
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
        onStatusReceived
      );

      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_USER_BET,
        onUserBetReceived
      );
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        {showColumnNames && (
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Bet Amount</TableCell>
              {!multiplier && <TableCell align="right">Multiplier</TableCell>}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {bets.map((bet) => {
            const {
              betCurrency,
              betAmount,
              username,
              betUUID,
              avatarUrl,
              userId,
              betMultiplier,
            } = bet;

            return (
              <TableRow key={betUUID}>
                <TableCell component="th" scope="row">
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <Avatar
                      style={{ width: 22, height: 22 }}
                      alt={username}
                      src={avatarUrl}
                    />
                    {bet.user.username}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Rate
                    shortCode={betCurrency}
                    amount={betAmount}
                    printShortCode={false}
                  />
                </TableCell>
                {!multiplier && (
                  <TableCell align="right">{betMultiplier}</TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default BetsList;
