import keyMirror from "keymirror";

const ActionTypes = keyMirror({
  USER_BET_X2: null,
  USER_BET_X3: null,
  USER_BET_X5: null,
  USER_BET_X50: null,
  ROUND_BEGIN: null,
  ROUND_DRAW: null,
  USER_BET: null,
  BETS_CLOSED: null,
  STATUS: null,
  ROOM_JOIN: null,
  ROOM_LEAVE: null,
});

export default ActionTypes;
