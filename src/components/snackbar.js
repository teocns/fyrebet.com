import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";

import uiStore from "../store/ui";
import ActionTypes from "../constants/ActionTypes";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

// Need to pass handleClick(message) as prop
export default function Snackbars() {
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  useEffect(() => {
    uiStore.addChangeListener(ActionTypes.UI_SHOW_SNACKBAR, showSnackbar); // When component mounted, subscribe to dispatcher events.

    return () => {
      // On component unmounting, remove previous listener.
      uiStore.removeChangeListener(ActionTypes.UI_SHOW_SNACKBAR, showSnackbar);
    };
  });

  const showSnackbar = ({ message, severity }) => {
    setSnackPack((prev) => [
      ...prev,
      { severity, message, key: new Date().getTime() },
    ]);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const classes = useStyles();
  return (
    <div>
      {messageInfo && messageInfo.severity && (
        <Snackbar
          key={messageInfo ? messageInfo.key : undefined}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          onExited={handleExited}
        >
          <Alert
            onClose={handleClose}
            severity={messageInfo && messageInfo.severity}
          >
            {messageInfo ? messageInfo.message : undefined}
          </Alert>
        </Snackbar>
      )}
      {(!messageInfo || !messageInfo.severity) && (
        <Snackbar
          key={messageInfo ? messageInfo.key : undefined}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          onExited={handleExited}
          message={messageInfo ? messageInfo.message : undefined}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                className={classes.close}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />
      )}
    </div>
  );
}
