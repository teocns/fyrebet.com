const keyMirror = require("keymirror");

const SocketEvents = keyMirror({
  SESSION_ID: null, // Server sent session ID from handshake
  CLIENT_DATA: null, // Client data
  AUTHENTICATE: null, // Client sends authentication request
  USER_DATA: null, // Fires when user data is sent from server to client
  USER_AVATAR_CHANGED: null,
  BALANCE_UPDATED: null,
  AUTHENTICATION_FAILED: null,
  LAST_CHAT_MESSAGES: null, // Gets last chat messages - TODO: Update to CHAT_STATUS
  SEND_CHAT_MESSAGE: null,
  ERROR: null,
  SUCCESS: null,
  CHAT_MESSAGE_RECEIVED: null,
  CHAT_ROOM_DATA: null,
  CHAT_ROOM_DATA_REQUEST: null,
  CHAT_ROOM_LEAVE: null,
  CHAT_ROOM_VISITED: null, // User is reading messages
  CHAT_ROOM_BLURRED: null, // User closed or moved away from the chat
  HANDSHAKE_SOCKET_ID: null,
  INITIAL_STATUS: null,
  RATES_UPDATED: null,
  FORTUNE_WHEEL_ROUND_BEGIN: null,
  FORTUNE_WHEEL_ROUND_DRAW: null,
  FORTUNE_WHEEL_STATUS: null,
  FORTUNE_WHEEL_USER_BET: null,
  FORTUNE_WHEEL_JOIN: null,
  FORTUNE_WHEEL_LEAVE: null,
  JACKPOT_ROULETTE_PLACE_BET: null,
});

module.exports = SocketEvents;
