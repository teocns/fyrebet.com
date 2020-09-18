import React, { useRef, useEffect, useState } from "react";

import { Send } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { motion, AnimatePresence, useAnimation } from "framer";
import fortuneWheelStore from "../../store/fortune-wheel";
import ActionTypes from "../../constants/ActionTypes";
import SpinningWheel from "./canvas";

import { placeBet } from "../../actions/fortune-wheel";

import { SLOTS_COLORS } from "../../constants/fortune-wheel";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },

  wheelContainer: {
    position: "relative",
    //transform: "scale(-1)", // Reverse
    //maxWidth: "320px",
  },
  pointerArrow: {
    position: "absolute",
    left: "50%",
    top: "8%",
    transform: "translateX(-50%) rotate(270deg)",
    fontSize: "1.5rem",
  },
  countDown: {
    display: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%) ",
    fontSize: "2rem",
  },
}));

let lastRotationDegrees = 0;
let lastNumberTick = 0;
let timerUpdateInterval = undefined;
const FortuneWheelComponent = (props) => {
  const previousRound = fortuneWheelStore.getPreviousRound();

  const currentRound = fortuneWheelStore.getCurrentRound();

  const [round, setRound] = useState(currentRound);
  const [roll, setRoll] = useState(currentRound && currentRound.roll);

  const isLoaded = !!round && !!round.roundId;

  const onRoundDraw = ({ round }) => {
    console.log("onRoundDraw: #", round.roll);
    setRoll(round.roll);
  };

  const onRoundBegin = ({ round }) => {
    console.log("onRoundBegin", round);
    setRound(round);
  };

  useEffect(() => {
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW,
      onRoundDraw
    );
    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN,
      onRoundBegin
    );

    fortuneWheelStore.addChangeListener(
      ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
      onRoundBegin
    );
    if (isLoaded && !round.isDrawn && timerElementRef.current) {
      // Begin timer
      const timerEl = timerElementRef.current;

      timerUpdateInterval = setInterval(() => {
        let timeLeft = (
          round.drawTimestamp - (Date.now() / 1000).toFixed(2)
        ).toFixed(2);
        if (timeLeft > 0) {
          timerEl.innerText = timeLeft.toString() + "s";
        } else {
          timerEl.innerText = "";
          clearInterval(timerUpdateInterval);
        }
      }, 10);
    }
    return () => {
      clearInterval(timerUpdateInterval);
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_ROUND_DRAW,
        onRoundDraw
      );
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_ROUND_BEGIN,
        onRoundBegin
      );
      fortuneWheelStore.removeChangeListener(
        ActionTypes.GAME_FORTUNE_WHEEL_STATUS,
        onRoundBegin
      );
    };
  });

  const calculateDegreesFromRoll = (roll) => {
    //let ret = Math.round(degreeToSlotRatio * roll); // We want at least 3 spins;
    let ret = (360 * roll) / 54; // We want at least 3 spins;

    return (lastRotationDegrees = -ret - 1080); // 2 spins
  };
  const getColorByRoll = (roll) => {
    return SLOTS_COLORS[Math.floor(roll)];
  };
  const onWheelRotated = (changes) => {
    // Find the actual slot color

    let rotationDegrees = parseFloat(
      (Math.abs(changes["rotate"]) % 360).toFixed(2)
    );

    let currentRollPoint = Math.floor(
      ((54 * rotationDegrees) / 360).toFixed(2)
    );
    // if (currentRollPoint !== lastNumberTick) {
    //   lastNumberTick = currentRollPoint;
    //   //rouletteClickSfx.play();
    // }

    let gotColor = getColorByRoll(currentRollPoint);
    //console.log(`Got COLOR: ${gotColor} from ROLL ${currentRollPoint}`);
    arrowPointerElement.current.style.color = gotColor;
  };

  const classes = useStyles();

  const animationControls = useAnimation();

  isLoaded &&
    animationControls.start({
      rotate: calculateDegreesFromRoll(
        roll || (previousRound && previousRound.roll)
      ),
      transition: {
        duration: currentRound.isDrawn ? 10 : 0,
        // ease: "easeOut",
      },
      transitionEnd: {
        rotate: lastRotationDegrees % 360,
      },
    });

  const arrowPointerElement = useRef(null);

  // const rouletteClickSfx = new Audio(require("../assets/click_sfx.mp3"));

  const timerElementRef = useRef(null);

  return (
    <div className={classes.wheelContainer}>
      <SpinningWheel
        animationData={{
          animationControls,
          onWheelRotated,
        }}
      />
      <p ref={timerElementRef} className={classes.countDown}>
        {(() => {
          if (isLoaded && round.drawTimestamp) {
            return (
              parseInt(Date.now() / 1000) - round.drawTimestamp
            ).toString();
          }
          return "";
        })()}
      </p>
      <Send
        ref={arrowPointerElement}
        className={classes.pointerArrow}
        style={{
          color: getColorByRoll(round.roll),
        }}
      />
    </div>
  );
};

export default React.memo(FortuneWheelComponent);
