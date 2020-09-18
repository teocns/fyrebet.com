import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { motion, AnimatedText } from "framer-motion";

import BrandLogo from "./brandmark/logo-coming-soonold";
import BrandIcon from "./brandmark/logo-icon-positive";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      background: "#ffffff", //theme.palette.primary.main,

      height: "100vh",
      overflow: "hidden",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "75%",
      margin: "0 auto",
      width: "420px",
    },
    logoGroup: {
      display: "inline-flex",
      width: "100%",
      position: "relative",
    },
    logoItself: {
      display: "inline-flex",
      height: "auto",
    },
    logoIcon: {
      // position: "absolute",
      // height: "calc(100% + 38px)",
      // width: "100%",
      height: "100%",
    },
    logoIconAnimation: {
      position: "absolute",
      top: "-32px",
      height: "calc(100% + 38px)",
      width: "100%",
    },
    contents: {
      display: "inline-flex",
      height: "auto",
      width: "100%",
    },
  };
});
const AppPreload = () => {
  const classes = useStyles();

  const IconAnimationVariants = {
    initial: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      scale: 1,
    },
    inactive: {
      opacity: 0,
      scale: 0,
    },
    beforeRotate: {
      rotate: "0deg",
      scale: 1,
    },
    rotateOut: {
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1,
      },
      rotate: "-360deg",
      scale: 0,
    },
  };
  return (
    <div className={classes.root}>
      <div className={classes.logoGroup}>
        <motion.div
          className={classes.contents}
          initial={{
            opacity: 0,
            scaleX: 0.8,
            scaleY: 0.2,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <BrandLogo className={classes.logoItself} />
        </motion.div>
        {/* <motion.div
          className={classes.logoIconAnimation}
          variants={IconAnimationVariants}
          initial="beforeRotate"
          aniamte="rotateOut"
          // initial={{
          //   opacity: 0,
          //   scaleX: 0.8,
          //   scaleY: 0.2,
          // }}
          // animate={{
          //   opacity: 1,
          //   scaleX: 1,
          //   scaleY: 1,
          //   rotate: {
          //     toValue: "-360deg",
          //     transition: {
          //       duration: "2s",
          //       delay: "3s",
          //     },
          //   },
          // }}
          // transition={{
          //   type: "spring",
          //   stiffness: 260,
          //   damping: 20,
          // }}
        >
          <BrandIcon className={classes.logoIcon} />
        </motion.div> */}
      </div>
    </div>
  );
};

export default AppPreload;
