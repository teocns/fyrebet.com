import React, { useState } from "react";

import { ArrowBack } from "@material-ui/icons";

import * as chatActions from "../../actions/chat";

import { Tooltip, IconButton } from "@material-ui/core";

import * as ChatConstants from "../../constants/Chat";
const GoBackToHistoryButton = () => {
  // Wherever the user finds himself in, this button will lead him to
  // home of the chat module.
  // The speciality of this component is displaying how many notifications it has
  // For example, number of missed messages in other chats happening now

  const [MissedMessages, setMissedMessages] = useState(2);

  const goBackTitle = MissedMessages
    ? `${MissedMessages} in your chats.`
    : "Go back to chats screen";

  const goBackToHome = () => {
    chatActions.changeChatMode(ChatConstants.ChatModeStatuses.IS_HISTORY);
  };
  return (
    <Tooltip title="Go back to your main" aria-label={"Back"}>
      <IconButton
        aria-controls={`go-back`}
        aria-haspopup="true"
        onClick={goBackToHome}
      >
        <ArrowBack size="small" />
      </IconButton>
    </Tooltip>
  );
};

export default GoBackToHistoryButton;
