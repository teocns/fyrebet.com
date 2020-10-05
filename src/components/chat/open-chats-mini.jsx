import React, { useState, useEffect, useRef } from "react";
import chatStore from "../../store/chat";

import { makeStyles } from "@material-ui/core/styles";

import { Avatar, Badge, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ActionTypes from "../../constants/ActionTypes";
import assetUrl from "../../helpers/assetUrl";

import * as chatActions from "../../actions/chat";
import { CHAT_ROOM_DATA } from "../../constants/SocketEvents";

import { findIndex, Position } from "find-index";
import move from "array-move";
import { motion, useMotionValue } from "framer-motion";

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 },
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "inline-flex",
      margin: theme.spacing(2),
    },
    avatar: {
      height: 24,
      width: 24,
    },
    avatarContainer: {
      position: "relative",
    },
    notificationBox: {
      position: "",
    },
  };
});

const OpenChatsMini = () => {
  const [OpenChatRooms, setOpenChatRooms] = useState(chatStore.getOpenChats());

  const [ActiveChatRoom, setActiveChatRoom] = useState(
    chatStore.getActiveChatRoom()
  );

  const OpenChatsUUIDs = Object.keys(OpenChatRooms).reverse();
  const hasAny =
    OpenChatRooms && Array.isArray(OpenChatsUUIDs) && OpenChatsUUIDs.length > 0;

  const onOpenChatRoomsChanged = () => {
    setOpenChatRooms(chatStore.getOpenChats());
  };

  const goToRoom = (chatRoomUUID) => {
    chatActions.changeActiveChatRoom(chatRoomUUID);
  };

  const onActiveChatRoomChanged = () => {
    setActiveChatRoom(chatStore.getActiveChatRoom());
    onOpenChatRoomsChanged();
  };

  const theme = useTheme();

  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_OPEN_ROOMS_CHANGED,
      onOpenChatRoomsChanged
    );
    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onActiveChatRoomChanged
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_DATA_RECEIVED,
      onActiveChatRoomChanged
    );

    return () => {
      chatStore.removeChangeListener(
        ActionTypes.CHAT_OPEN_ROOMS_CHANGED,
        onOpenChatRoomsChanged
      );
      chatStore.removeChangeListener(
        ActionTypes.CHAT_ROOM_CHANGE,
        onActiveChatRoomChanged
      );
      chatStore.removeChangeListener(
        ActionTypes.CHAT_ROOM_DATA_RECEIVED,
        onActiveChatRoomChanged
      );
    };
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {hasAny &&
        OpenChatsUUIDs.map((chatRoomUUID) => {
          const chatRoom = OpenChatRooms[chatRoomUUID];
          if (!chatRoom) {
            return;
          }
          const IsLoading = "isLoading" in chatRoom;

          const isNotificationPopup = () => {};
          const render = () => {
            if (IsLoading) {
              return <Skeleton variant="circle" className={classes.avatar} />;
            }
            const { unreadCount, chatRoomType, iconUrl } = chatRoom;

            const avatarElement = (
              <Avatar className={classes.avatar} src={assetUrl(iconUrl)} />
            );
            if (unreadCount) {
              return (
                <Badge
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  overlap="circle"
                  color="secondary"
                  badgeContent={unreadCount}
                >
                  {avatarElement}
                </Badge>
              );
            }
            return avatarElement;
          };
          return (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.12 }}
              style={{ cursor: "pointer", marginRight: theme.spacing(1) }}
              key={chatRoomUUID}
              onClick={() => {
                goToRoom(chatRoomUUID);
              }}
            >
              {render()}
            </motion.div>
          );
        })}
    </div>
  );
};

export default OpenChatsMini;
