import keyMirror from "keymirror";

const ActionTypes = keyMirror({
  ROUND_DRAW: null,
  ROUND_NEW: null,
  ROUND_BET: null,
  THREADS_SYNC_RECEIVED: null, // All threads brief
  THREAD_SYNC_RECEIVED: null, // Single thread
  THREADS_BRIEF_RECEIVED: null,
  THREAD_CHANGE: null,
});

export default ActionTypes;
