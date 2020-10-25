import React, { useEffect, useRef, useState } from "react";
import ChartJS from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jackpotRouletteStore from "../../store/jackpotRoulette";
import { makeStyles } from "@material-ui/core/styles";
import { motion, useAnimation } from "framer";
// import {
//   SLOTS,
//   SLOTS_COLORS,
//   SLOTS_MULTIPLIERS,
// } from "../../constants/fortune-wheel";
import ActionTypes from "../../constants/ActionTypes";
import JackpotRouletteRound from "../../models/Jackpot/Round";
import chatStore from "../../store/chat";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },

  wheelContainer: {
    position: "relative",
    overflow: "hidden",
    pointerEvents: "none",
  },
  canvasElement: {
    //maxHeight: 420,
  },
}));

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const Slots = [1, 2, 3, 4];
const chartClockwiseColors = Slots.map((slot) => {
  return getRandomColor();
});

const JackpotRouletteWheel = (props) => {
  const [CurrentRound, setCurrentRound] = useState(
    jackpotRouletteStore.getCurrentRound()
  );

  const previousRound = jackpotRouletteStore.getPreviousRound();
  const previousRoll = previousRound ? previousRound.roll : 0;

  const roll =
    CurrentRound instanceof JackpotRouletteRound && CurrentRound.isDrawn
      ? CurrentRound.roll
      : previousRoll;

  const isDrawn = CurrentRound && CurrentRound.isDrawn;

  let rotationDegrees = 0,
    lastNumberTick = 0;
  const calculateRotationFromRoll = (roll) => {
    //let ret = Math.round(degreeToSlotRatio * roll); // We want at least 3 spins;
    let ret = (360 * roll) / Slots.length; // We want at least 3 spins;

    return (rotationDegrees = -ret - 1080); // 2 spins
  };
  // const getColorByRoll = (roll) => {
  //   return SLOTS_COLORS[Math.floor(roll)];
  // };
  const onWheelRotated = (changes) => {
    // Find the actual slot color

    let rotationDegrees = parseFloat(
      (Math.abs(changes["rotate"]) % 360).toFixed(2)
    );

    let currentRollPoint = Math.floor(
      ((54 * rotationDegrees) / 360).toFixed(2)
    );

    // let gotColor = getColorByRoll(currentRollPoint);

    //arrowPointerElement.current.style.color = gotColor;
  };

  const animationControls = useAnimation();
  const animationData = {
    rotate: calculateRotationFromRoll(roll ? roll : previousRoll),
    transition: {
      duration: isDrawn ? 7 : 0,
      //type: "spring",
      //stiffness: 260,
      //damping: 10,
    },
    transitionEnd: {
      rotate: rotationDegrees % 360,
    },
  };

  animationControls.start(animationData);

  const cv = useRef(undefined);
  const wheelContainer = useRef(undefined);

  const classes = useStyles();

  const DEGREE_TO_SLOT_RATIO = 360 / Slots.length;
  const DEGREE_TO_SLOT_RATIO_HALVED = 360 / Slots.length / 2;

  const setJackpotRouletteWheelHeight = (height) => {
    //console.log(`Setting to ${height}`);
    wheelContainer &&
      wheelContainer.current &&
      (wheelContainer.current.style.height = `${height}px`);
  };
  const onResize = (chartEl) => {
    console.log("resized");
    //setJackpotRouletteWheelHeight(chartEl.height / 5);
  };

  const onRoundDraw = () => {
    setCurrentRound(jackpotRouletteStore.getCurrentRound());
  };
  const onRoundBegin = ({ round }) => {
    setCurrentRound(jackpotRouletteStore.getCurrentRound());
  };

  const initializeCanvas = () => {
    var Chart = new ChartJS(cv.current.getContext("2d"), {
      type: "doughnut",
      plugins: [ChartDataLabels],
      options: {
        cutoutPercentage: 85,
        animation: {
          duration: 0,
        },

        responsive: true,
        onResize: onResize,
        onHover: false,
        // aspectRatio: 1,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },

        plugins: {
          datalabels: {
            color: "white",

            font: {
              size: 12,
            },

            rotation: function ({ dataIndex }) {
              let rotation =
                (360 * dataIndex + 1) / Slots.length +
                DEGREE_TO_SLOT_RATIO_HALVED;
              //console.log(`Rotation #${dataIndex} = ${rotation}°`);
              return rotation;
            },
            // formatter: function (_, context) {
            //   if (context.datasetIndex === 0)
            //     return `x${SLOTS_MULTIPLIERS[context.dataIndex]}`;
            //   return "▲";
            // },
          },
        },
      },
      data: {
        labels: Slots,

        datasets: [
          {
            label: "Multipliers",
            data: Array(Slots.length).fill(1),
            backgroundColor: chartClockwiseColors,
            borderAlign: "inner",
            borderColor: "#FFFFFF00",
            borderWidth: 1,
          },
          // {
          //   label: "Indicators",
          //   data: Array(54).fill(1),
          //   backgroundColor: "#ffffff26",
          //   borderColor: "#BA111D",
          //   borderWidth: 1,
          // },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
      },
    });

    //setJackpotRouletteWheelHeight(Chart.height / 5);
  };
  useEffect(() => {
    bindStoreListeners();

    initializeCanvas();

    return unbindStoreListeners;
  });

  const bindStoreListeners = () => {
    jackpotRouletteStore.addChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW,
      onRoundDraw
    );

    jackpotRouletteStore.addChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW,
      onRoundBegin
    );
  };

  const unbindStoreListeners = () => {
    jackpotRouletteStore.removeChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_DRAW,
      onRoundDraw
    );

    jackpotRouletteStore.removeChangeListener(
      ActionTypes.GAME_JACKPOT_ROULETTE_ROUND_NEW,
      onRoundBegin
    );
  };
  return (
    <div className={classes.wheelContainer} ref={wheelContainer}>
      <motion.div animate={animationControls} onUpdate={onWheelRotated}>
        <canvas ref={cv} className={classes.canvasElement}></canvas>
      </motion.div>
    </div>
  );
};
export default React.memo(JackpotRouletteWheel);
