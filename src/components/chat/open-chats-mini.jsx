import React, { useState, useEffect } from "react";
import chatStore from "../../store/chat";

import { makeStyles } from "@material-ui/core/styles";

import { Avatar, Badge } from "@material-ui/core";
import ActionTypes from "../../constants/ActionTypes";
import assetUrl from "../../helpers/assetUrl";

import * as chatActions from "../../actions/chat";
const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "inline-flex",
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
  const [OpenChatRooms, setOpenChatRooms] = useState(
    //chatStore.getOpenChatRooms()
    chatStore.getOpenChats()
    // [
    //   {
    //     avatarUrl:
    //       "https://cdn.fyrebet.com/avatars/306c9688-6177-40ab-a087-0fec6c435156-32.png",
    //     userUUID: "3b3450a8-eb57-11ea-b736-fa163ea309a4",
    //     chatRoomUUID: "e5ba6fd9-023b-11eb-847a-fa163ea309a4",
    //     username: "playboy20",
    //     unreadCount: 1,
    //   },
    // ]
  );

  const hasAny = Array.isArray(OpenChatRooms) && OpenChatRooms.length;

  const onOpenChatRoomsReceived = () => {
    setOpenChatRooms(chatStore.getOpenChats());
  };

  const goToRoom = (chatRoomUUID) => {
    chatActions.changeActiveChatRoom({ chatRoomUUID });
  };
  useEffect(() => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_OPEN_ROOMS_RECEIVED,
      onOpenChatRoomsReceived
    );
    return () => {
      chatStore.removeChangeListener(
        ActionTypes.CHAT_OPEN_ROOMS_RECEIVED,
        onOpenChatRoomsReceived
      );
    };
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {!!hasAny &&
        OpenChatRooms.map(({ chatRoomUUID, avatarUrl, unreadCount }) => {
          const render = () => {
            const avatarElement = (
              <Avatar className={classes.avatar} src={assetUrl(avatarUrl)} />
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
            <div
              style={{ display: "contents" }}
              key={chatRoomUUID}
              onClick={() => {
                goToRoom(chatRoomUUID);
              }}
            >
              {render()}
            </div>
          );
        })}
    </div>
  );
};

export default OpenChatsMini;
