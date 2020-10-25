import React from "react";

import { Divider } from "@material-ui/core";
import ChatThreadFooter from "./Footer";
import ChatThreadHeader from "./Header";
import ChatThreadMessagesScroll from "./MessagesScroll";

const ChatThreadComponent = () => {
  return (
    <React.Fragment>
      <ChatThreadHeader />
      <Divider />
      <ChatThreadMessagesScroll />
      <ChatThreadFooter />
    </React.Fragment>
  );
};

export default ChatThreadComponent;
