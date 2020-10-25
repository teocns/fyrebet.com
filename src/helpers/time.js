import moment from "moment";

export const prettyTimelapse = (date) => {
  if (!moment.isMoment(date)) {
    date = moment.unix(date); // ok for js date, milliseconds or string in ISO format
  }
  if (date.isSame(moment(), "day")) {
    return date.format("hh:mm a");
  } else if (date.isSame(moment().subtract(1, "d"), "day")) {
    return "Yesterday";
  } else if (date.isSame(moment(), "week")) {
    return date.format("dddd");
  } else {
    return date.format("DD/MM/YYYY");
  }
};

/**
 * @typedef {Object} TimeRemaining
 * @property {number} total
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * @param {number} endtime
 * @returns {TimeRemaining}
 */
export function getTimeRemaining(endtime) {
  const total = endtime - parseInt(Date.now() / 1000);
  const seconds = Math.floor(total % 60);
  const minutes = Math.floor((total / 60) % 60);
  const hours = Math.floor((total / (60 * 60)) % 24);
  const days = Math.floor(total / (60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}
