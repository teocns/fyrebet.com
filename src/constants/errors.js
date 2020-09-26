const Errors = {
  ERR_UNKNOWN: "Uknown",
  ERR_INSUFFICIENT_BALANCE: "Insufficient balance",
  ERR_BETS_CLOSED: "Bets already closed",
  ERR_INVALID_CURRENCY: "Choose a currency to bet with.",
  ERR_ROUND_INEXISTENT: "Round does not exist",
  ERR_MESSAGE_TOO_SHORT: "Message too short",
  ERR_MESSAGE_TOO_LONG: "Message too long",
  ERR_INVALID_BET: "Error while placing your bet.",
  ERR_WAIT_BEFORE_SENDING_MESSAGE: "Please wait {0}s to text again.",
  ERR_UNAUTHENTICATED: "It seems you're not logged in yet!",
  ERR_INVALID_PICTURE: "Please try with another picture.",
  ERR_NO_ACCESS_TO_CONVERSATION:
    "You cannot send a message in this chat room at the time being.",
  ERR_USER_NOT_FOUND: "We cannot find the requested user.",
};

module.exports = Errors;
