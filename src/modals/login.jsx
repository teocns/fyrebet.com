import React, { useState, useRef } from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";

import { motion, AnimatePresence } from "framer-motion";

import { toggleLoginModal } from "../actions/ui";

import * as User from "../actions/session";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
  },
  inputField: {
    margin: theme.spacing(1),
  },
  dialogActions: theme.spacing(1),

  passwordDialogContent: {
    display: "block",
  },

  paperComponet: {
    overflow: "hidden",
    position: "relative",
  },

  linearProgress: {
    transition: "opacity .275s",
    opacity: 0,
  },
  linearProgressToggled: {
    opacity: "0!important",
  },
}));

export default function LoginModal(props) {
  const theme = useTheme();

  const steps = {
    INPUT_EMAIL: 0,
    INPUT_PASSWORD: 1,
    REGISTER: 2,
  };

  const [currentStep, setStep] = useState(steps.INPUT_EMAIL);

  const [credentials, updateCredentials] = useState({
    email: "",
    password: "",
  });

  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);

  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const [isAjaxLoading, setAjaxLoading] = useState(false);

  let emailElement = useRef(null);
  let passwordElement = useRef(null);

  const classes = useStyles();

  let logIn = async () => {
    // Check if password is right
    console.log("logign in");
    if (!isPasswordValid) return;

    let success = await User.userAuthenticate(credentials);
    if (success) {
      console.log(true);
      // Authenticated, so close the pop-up
      toggleLoginModal();
    } else if (false) {
      // Maybe display error? For now throw an alert
      alert(false);
    }

    setAjaxLoading(false);
  };

  let afterEmailInput = async () => {
    if (isEmailValid) {
      // Fetch user and check if it's registration or login
      try {
        setAjaxLoading(true);
        setStep(
          User.userEmailIsRegistered(credentials.email)
            ? steps.INPUT_PASSWORD
            : steps.REGISTER
        );
      } catch (e) {
        console.log(e);
        window.showSnackbar();
      } finally {
        setAjaxLoading(false);
      }
    }
  };

  let validateEmail = (val) => {
    let email = val.toString().trim();
    if (!val) return;
    console.log("updating email");

    let isValid = email && email.match(/^\S+@\S+\.\S+$/) ? true : false;
    setEmailValid(isValid);
    isValid &&
      updateCredentials({ email: email, password: credentials.password });
    return isValid;
  };
  let validatePassword = (val) => {
    let password = val.toString().trim();
    if (!val) return;
    password = val;
    let isValid = password && password.length >= 4 && password.length <= 32;
    setPasswordValid(isValid);
    isValid &&
      updateCredentials({ email: credentials.email, password: password });
    return isValid;
  };

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.root}
        PaperProps={{
          className: classes.paperComponet,
        }}
      >
        <AnimatePresence>
          {isAjaxLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LinearProgress />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {currentStep === steps.INPUT_EMAIL && (
            <motion.div
              exit={{
                x: "-100%",
                position: "absolute",
              }}
              animate={{
                x: 0,
              }}
              initial={{
                x: currentStep === steps.INPUT_EMAIL ? 0 : "-100%",
              }}
            >
              <DialogContent className={classes.dialogContent}>
                <TextField
                  className={classes.inputField}
                  label="Your email or username"
                  error={showEmailError}
                  name="email"
                  type="email"
                  helperText={
                    showEmailError ? "Please input a valid email" : ""
                  }
                  ref={emailElement}
                  id="login-modal-input-email"
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      afterEmailInput();
                    }
                  }}
                  onChange={(event) => {
                    if (validateEmail(event.target.value)) {
                      setShowEmailError(false);
                    }
                  }}
                  onBlur={() => {
                    if (!isEmailValid) {
                      setShowEmailError(true);
                    }
                  }}
                  variant="outlined"
                />
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {currentStep === steps.INPUT_PASSWORD && (
            <motion.div
              exit={{
                x: "100%",
                position: "absolute",
              }}
              animate={{
                x: 0,
              }}
              initial={{
                x: "100%",
              }}
            >
              <DialogContent className={classes.dialogContent}>
                <TextField
                  className={classes.inputField}
                  label="Input a password"
                  type="password"
                  name="password"
                  helperText={
                    showPasswordError && "Must be between 4-32 characters"
                  }
                  ref={passwordElement}
                  error={showPasswordError}
                  variant="outlined"
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      logIn();
                    }
                  }}
                  onChange={(event) => {
                    if (validatePassword(event.target.value)) {
                      setShowPasswordError(false);
                    }
                  }}
                  onBlur={() => {
                    if (!isPasswordValid) {
                      setShowPasswordError(true);
                    }
                  }}
                />
                <Link href="#" style={theme.typography.caption}>
                  Forgot your password?
                </Link>
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep === steps.INPUT_EMAIL && (
          <DialogActions className={classes.dialogActions}>
            <Button
              disabled={isEmailValid ? "" : "disabled"}
              variant="contained"
              color="primary"
              onClick={afterEmailInput}
            >
              Next
            </Button>
          </DialogActions>
        )}

        {currentStep === steps.INPUT_PASSWORD && (
          <DialogActions className={classes.dialogActions}>
            <Button
              variant="contained"
              color="primary"
              onClick={logIn}
              disabled={isPasswordValid ? "" : "disabled"}
            >
              Log in
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
