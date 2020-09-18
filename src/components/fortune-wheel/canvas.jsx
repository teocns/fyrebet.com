import React, { useEffect, useRef } from "react";
import ChartJS from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer";
import {
  SLOTS,
  SLOTS_COLORS,
  SLOTS_MULTIPLIERS,
} from "../../constants/fortune-wheel";

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

const chartClockwiseColors = SLOTS.map((slot) => {
  return SLOTS_COLORS[slot];
});

const SpinningWheel = (props) => {
  const { animationControls, onWheelRotated } = props.animationData;

  const cv = useRef(undefined);
  const wheelContainer = useRef(undefined);

  const classes = useStyles();

  const DEGREE_TO_SLOT_RATIO = 360 / SLOTS.length;
  const DEGREE_TO_SLOT_RATIO_HALVED = 360 / SLOTS.length / 2;

  const setSpinningWheelHeight = (height) => {
    //console.log(`Setting to ${height}`);
    wheelContainer &&
      wheelContainer.current &&
      (wheelContainer.current.style.height = `${height}px`);
  };
  const onResize = (chartEl) => {
    console.log("resized");
    setSpinningWheelHeight(chartEl.height / 5);
  };
  useEffect(() => {
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
        aspectRatio: 1,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        // elements: {
        //   arc: {
        //     borderColor: "yellow",
        //     borderWidth: {
        //       left: 0,
        //       right: 0,
        //       bottom: 6,
        //       top: 0,
        //     },
        //   },
        // },
        plugins: {
          datalabels: {
            color: "white",
            // display: function (context) {
            //   return "x";
            //   //return `x${SLOTS_MULTIPLIERS[context.dataIndex]}`;
            // },
            font: {
              // weight: "bold",
              size: 12,
            },

            rotation: function ({ dataIndex }) {
              let rotation =
                (360 * dataIndex + 1) / SLOTS.length +
                DEGREE_TO_SLOT_RATIO_HALVED;
              //console.log(`Rotation #${dataIndex} = ${rotation}°`);
              return rotation;
            },
            formatter: function (_, context) {
              if (context.datasetIndex === 0)
                return `x${SLOTS_MULTIPLIERS[context.dataIndex]}`;
              return "▲";
            },
          },
        },
      },
      data: {
        labels: SLOTS,

        datasets: [
          {
            label: "Multipliers",
            data: Array(54).fill(1),
            backgroundColor: chartClockwiseColors,
            borderAlign: "inner",
            borderColor: "#BA111D",
            borderWidth: 1,
            // borderColor: {
            //   left: "#BA111D",
            //   right: "#BA111D",
            //   bottom: "#BA111D",
            //   top: "#000",
            // },

            // borderWidth: "1px 0 0 0",
            // borderWidth: [2, 0, 0, 0],
            // borderWidth: {
            //   left: 0,
            //   right: 0,
            //   bottom: 5,
            //   top: 0,
            // },
            // borderSkipped: {
            //   left: true,
            //   right: true,
            //   bottom: true,
            //   top: false,
            // },
            //weight: 2,
          },
          {
            label: "Indicators",
            data: Array(54).fill(1),
            backgroundColor: "#ffffff26",
            borderColor: "#BA111D",
            borderWidth: 1,
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
      },
    });

    setSpinningWheelHeight(Chart.height / 5);
  });
  return (
    <div className={classes.wheelContainer} ref={wheelContainer}>
      <motion.div animate={animationControls} onUpdate={onWheelRotated}>
        <canvas ref={cv} className={classes.canvasElement}></canvas>
      </motion.div>
    </div>
  );
};
export default React.memo(SpinningWheel);
