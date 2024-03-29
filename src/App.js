import React, { useState, useEffect } from "react";

import "./App.css";

import AppContent from "./components/app-content";

import ActionTypes from "./constants/ActionTypes";

import { ThemeProvider } from "@material-ui/styles";

// Custom components

import theme from "./themes/fyrebet";

import Box from "@material-ui/core/Box";

import "./utils";

import { motion, AnimatePresence } from "framer-motion";

import sessionStore from "./store/session";
import { CssBaseline } from "@material-ui/core";
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  const onAppInitialized = () => {
    setIsInitialized(true);
  };
  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.SESSION_INITIAL_STATUS_RECEIVED,
      onAppInitialized
    );
    return () => {
      sessionStore.removeChangeListener(
        ActionTypes.SESSION_INITIAL_STATUS_RECEIVED,
        onAppInitialized
      );
    };
  });
  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "absolute",
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <AnimatePresence>{!isInitialized && <AppPreload />}</AnimatePresence> */}
        {/* <AnimatePresence>{isInitialized && }</AnimatePresence> */}
        <AppContent />
      </ThemeProvider>
    </div>
  );
}
