import React, { useEffect, useState, useMemo } from "react";

import { makeStyles } from "@material-ui/core/styles";

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

import { ExitToApp } from "@material-ui/icons";

import * as userActions from "../actions/user";
import * as sessionActions from "../actions/session";
import { initialize } from "../socket";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    overflowY: "scroll",
  },
});

let initialized = false;
const AllUsersView = () => {
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    initialized = true;
    userActions
      .getAll()
      .then((result) => {
        //debugger;
        setRows(result);
      })
      .catch();
  }, [false]);
  const switchSession = (authenticationToken) => {
    sessionActions.setAuthenticationToken(authenticationToken);
  };
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => {
                    switchSession(row.authentication_token);
                  }}
                >
                  <ExitToApp />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllUsersView;
