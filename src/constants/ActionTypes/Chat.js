import keyMirror from "keymirror";

const ActionTypes = keyMirror({
  MESSAGE_SENT: null,
  MESSAGE_RECEIVED: null,
  STATUS_RECEIVED: null,
  THREAD_DATA_RECEIVED: null,
  ROOM_CHANGE: null,
  THREAD_CLOSE: null,
  HISTORY_RECEIVED: null,
  SEARCH_QUERY: null,
  SEARCH_QUERY_API_CALL_EXECUTED: null,
  SEARCH_RESULTS_CHANGED: null,
  MODE_CHANGE: null,
  PREPARE_SEARCH_API_CALL: null,
  PUBLIC_ROOMS_RECEIVED: null,
  INITIALIZED: null, // Initialized what?
});

export default ActionTypes;
