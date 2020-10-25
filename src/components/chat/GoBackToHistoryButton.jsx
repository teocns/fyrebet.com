import React, { useState } from "react";

import { ArrowBack } from "@material-ui/icons";

import * as uiActions from "../../actions/ui";

import { Tooltip, IconButton } from "@material-ui/core";

import AppDrawerViews from "../../constants/AppDrawerViews";

const GoBackToHistoryButton = () => {
  // Wherever the user finds himself in, this button will lead him to
  // home of the chat module.
  // The speciality of this component is displaying how many notifications it has
  // For example, number of missed messages in other chats happening now

  const [MissedMessages, setMissedMessages] = useState(2);

  const goBackTitle = MissedMessages
    ? `${MissedMessages} in your chats.`
    : "Go back to chats screen";

  const goToHistory = () => {
    uiActions.changeAppDrawerView(AppDrawerViews.CHAT_HISTORY);
  };
  return (
    <Tooltip title="Go back to your main" aria-label={"Back"}>
      <IconButton
        aria-controls={`go-back`}
        size="small"
        aria-haspopup="true"
        onClick={goToHistory}
      >
        <ArrowBack size="small" />
      </IconButton>
    </Tooltip>
  );
};

export default GoBackToHistoryButton;
