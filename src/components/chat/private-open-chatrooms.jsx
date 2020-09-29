import React, { useState, useEffect } from "react";
import chatStore from "../../store/chat";

const OpenPrivateChatRooms = () => {
  const [OpenChatRooms, setOpenChatRooms] = useState(
    chatStore.getOpenChatRooms()
  );

  return <div></div>;
};

export default OpenPrivateChatRooms;
