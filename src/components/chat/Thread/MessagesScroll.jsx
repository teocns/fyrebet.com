import React, { useEffect, useState, useRef } from "react";
import * as chatActions from "../../../actions/chat";
import chatStore from "../../../store/chat";
import ActionTypes from "../../../constants/ActionTypes";

import { motion } from "framer-motion";
import UserAvatarWithActions from "../../user/user-avatar";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../../themes/fyrebet/fyrebet";
import {
  TextField,
  Divider,
  Typography,
  ListItem,
  List,
  Avatar,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import ChatThreadMessage from "../../../models/ChatThreadMessage";
import ChatThread from "../../../models/ChatThread";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
    },
    avatarContainer: {
      width: 28,
      height: 28,
    },
    menuButton: {},
    title: {
      flexGrow: 1,
    },
    messageBox: {
      margin: 0,
      // padding: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      alignItems: "start",
    },
    messageBoxUsername: {
      color: "#ececec",
    },
    userIcon: {
      width: 28,
      height: 28,
      minWidth: 28,
      minHeight: 28,
      marginTop: 28 / 7,
    },
    username: {
      fontSize: 11,
      color: theme.palette.text.disabled,
      fontWeight: "bold",
    },
    messageText: {
      fontSize: 13,
    },
    skeletonTextContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      width: "100%",
      marginLeft: 8,
    },
    skeletonText: { height: "1rem" },
    messagesScroll: {
      flexGrow: 1,
      flesBasis: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column-reverse",
      overflowY: "scroll",
      overflowX: "hidden",
      // scrollbarWidth: 0,
    },
    chatTextField: {
      background: "transparent",
      border: "none",
      display: "flex",
      flex: "1",
      outline: "none",
      padding: theme.spacing(1),
    },
  };
});

// This component assumes that data has been prefetched. Given that the user will
const ChatMessagesScroll = (props) => {
  const [messages, setMessages] = useState(
    chatStore.getActiveChatThreadMessages()
  );
  const activeChat = chatStore.getActiveChatThread();

  /**
   * Array that contains grouped messages when user sends multiple messages altogether
   * Example from index 0 to 4 if first 5 messages are from the same user
   * @type {Array.<Array<number,number>>}
   */
  const groupedMessagesIndexes = [];

  /**
   * Avatar set to sticky when scrolling
   * Contains element index, function handler
   * @type {number}
   */
  var stickyAvatarMessageIndex = undefined;
  const isLoading = !(activeChat instanceof ChatThread) || activeChat.isLoading;

  useEffect(() => {
    bindEventListeners();
    // Scroll to the bottom
    scrollChatDown();
    !isLoading &&
      setTimeout(() => {
        triggerChatVisited();
      });
    return unbindEventListeners;
  });

  const onChatThreadDataReceived = ({ chatThread }) => {
    // Check if we really need to update this component
    if (
      chatStore.getActiveChatThread().chatRoomUUID === chatThread.chatRoomUUID
    ) {
      console.log("chatThreadDataReceived");
      setMessages([...chatStore.getActiveChatThreadMessages()]);
    }
  };

  const onChatRoomChanged = () => {
    setMessages(chatStore.getActiveChatThreadMessages());
  };

  const onMessageReceived = ({ message }) => {
    // Check if we really need to change this
    if (message.chatRoomUUID === activeChat.chatRoomUUID) {
      setMessages([...chatStore.getActiveChatThreadMessages()]);
    }
  };
  const bindEventListeners = () => {
    chatStore.addChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatThreadDataReceived
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onMessageReceived
    );

    chatStore.addChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onChatRoomChanged
    );
  };

  const triggerChatVisited = () => {
    // Should trigger when messages are clearly visible to the user.
    // This sets all the messages to 'seen'
    chatActions.triggerChatVisited(activeChat.chatRoomUUID);
  };
  const unbindEventListeners = () => {
    chatStore.removeChangeListener(
      ActionTypes.CHAT_THREAD_DATA_RECEIVED,
      onChatThreadDataReceived
    ); // When component mounted, subscribe to dispatcher events to receive each new message.

    // On component unmounting, remove previous listener.
    chatStore.removeChangeListener(
      ActionTypes.CHAT_MESSAGE_RECEIVED,
      onMessageReceived
    );

    chatStore.removeChangeListener(
      ActionTypes.CHAT_ROOM_CHANGE,
      onChatRoomChanged
    );
  };

  const onChatScroll = (el) => {
    return;
    /**
     * @type {Node}
     */
    const scrollContainer = el.currentTarget;

    // Find the total scroll length
    const maxScrollLen = scrollContainer.firstChild.scrollHeight;

    const visibleScrollLength = scrollContainer.offsetHeight;

    // Find how much it is scrolled
    // When it's 0, it means it's to the bottom
    // If it's equal tok maxScrollLen, it's to the top
    const howMuchIsScrolled = -scrollContainer.scrollTop;

    if (howMuchIsScrolled === 0) {
      console.log("We are at the bottom");
    } else if (howMuchIsScrolled === maxScrollLen - visibleScrollLength) {
      console.log("We are at the top");
    }
    //console.log(howMuchIsScrolled, visibleScrollLength, maxScrollLen);

    // Find visible message first index
    // Long algorithm
    const scrollPositionTopInVisibleArea =
      maxScrollLen - visibleScrollLength - howMuchIsScrolled;
    //console.log(scrollPositionTopInVisibleArea);
    //const avatarMarginFromTopOfMessageBox = 12;
    // Iterate each element in the scroll
    for (let i = 0; i < scrollContainer.firstChild.childNodes.length; i++) {
      const currentMessageBox = scrollContainer.firstChild.childNodes[i];

      // Get the first element that is visible in the scroll area
      if (currentMessageBox.offsetTop >= scrollPositionTopInVisibleArea) {
        let currentChildIndex = i;
        // Find if it is included in a grouped messages index
        for (let messageGroup of groupedMessagesIndexes) {
          //console.log(messageGroup, currentChildIndex);
          if (
            currentChildIndex >= messageGroup[0] &&
            currentChildIndex <= messageGroup[messageGroup.length - 1]
          ) {
            if (
              stickyAvatarMessageIndex &&
              stickyAvatarMessageIndex === messageGroup[0]
            ) {
              // Do nothing
              console.log("DOING NOTHING");
              return;
            }

            // Retrieve the first message, and bring the avatar on top fixed

            if (stickyAvatarMessageIndex) {
              const targetMessageBox =
                scrollContainer.firstChild.childNodes[stickyAvatarMessageIndex];
              try {
                if (targetMessageBox) {
                  const targetAvatar = targetMessageBox.querySelector(
                    '[name="AvatarContainer"] > *'
                  );
                  targetAvatar.style.position = "relative";
                  targetAvatar.style.top = "0";
                }
              } catch (e) {
                debugger;
              }

              stickyAvatarMessageIndex = undefined;
            }

            // Get the avatar
            const targetMessageBox =
              scrollContainer.firstChild.childNodes[messageGroup[0]];
            if (targetMessageBox) {
              try {
                stickyAvatarMessageIndex = messageGroup[0];

                let foundAvatar = targetMessageBox.querySelector(
                  '[name="AvatarContainer"] > *'
                );
                foundAvatar.style.position = "fixed";
                foundAvatar.style.top = `${scrollContainer.offsetTop + 12}px`;
              } catch (e) {
                debugger;
              }
            }

            // Add a returning function
          }
        }
        // We have found the first child, visible
        break;
      }
    }
  };

  const avatarTrigger = (scrollContainer, currentChildIndex, messageGroup) => {
    // Find the scroll position whereas THIS avatar should go STICKY
    const scrollFunction = () => {
      if (
        currentChildIndex >= messageGroup[0] &&
        currentChildIndex <= messageGroup[messageGroup.length - 1]
      ) {
        // Retrieve the first message, and bring the avatar on top fixed
        let containingAvatarElement =
          scrollContainer.firstChild.childNodes[messageGroup[0]];
        // Get the avatar
        let foundAvatar = containingAvatarElement.querySelector(
          ".AvatarContainer"
        );
        foundAvatar.style.position = "fixed";
        foundAvatar.style.top = `${scrollContainer.offsetTop}px`;
      } else {
        scrollContainer.removeChangeListener(scrollFunction);
        let containingAvatarElement =
          scrollContainer.firstChild.childNodes[messageGroup[0]];
        // Get the avatar
        let foundAvatar = containingAvatarElement.querySelector(
          ".AvatarContainer"
        );
        foundAvatar.style = "";
      }
    };
    scrollContainer.addEventListener("scroll", scrollFunction);
  };
  const scrollChatDown = () => {
    setTimeout(() => {
      scrollElement.current.parentElement.scrollTop =
        scrollElement.current.scrollHeight;
    });
  };

  const renderChatMessages = () => {
    if (!isLoading) {
      // Messages populated from store - it is safe to render messages

      let groupedMessageIndexStart = undefined;
      let lastMessageUserUUID = undefined;
      const returnCachedelements = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        if (message.userUUID === lastMessageUserUUID) {
          returnCachedelements.push(
            renderMessageBox({ message, isGrouped: true, index: i })
          );
          // Continuous grouping found
          if (groupedMessageIndexStart === undefined)
            groupedMessageIndexStart = i - 1;
          continue;
        } else if (groupedMessageIndexStart !== undefined) {
          // Here ends the grouped messages train
          groupedMessagesIndexes.push([groupedMessageIndexStart, i - 1]);
          groupedMessageIndexStart = undefined;
        }
        returnCachedelements.push(
          renderMessageBox({ message, isGrouped: false, index: i })
        );
        lastMessageUserUUID = message.userUUID;
      }
      if (groupedMessageIndexStart !== undefined) {
        groupedMessagesIndexes.push([
          groupedMessageIndexStart,
          messages.length - 1,
        ]);
      }
      return returnCachedelements;
    } else {
      // Render skeletons, since we haven't received chat messages from socket
      return [...Array(20).keys()].map((message, index) => {
        return renderSkeletonBox();
      });
    }
  };
  const findFirstScrollingParent = (node) => {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return findFirstScrollingParent(node.parentNode);
    }
  };
  const userIconIsVisible = (el) => {
    if (window.debugger) {
      debugger;
    }
    // let visibleContainerHeight = el.parentElement.parentElement.offsetHeight;

    const elementDistanceFromTopToBottom = el.offsetTop;
    let howMuchIsScrolled = el.parentElement.parentElement.scrollTop;

    let visibleScrollLength = el.parentElement.parentElement.offsetHeight;

    let totalScrollLength = el.parentElement.scrollHeight;
    // Element height from top to bottom
    console.log(
      `visibleScroll: ${visibleScrollLength}`,
      `elDistFromTop:${elementDistanceFromTopToBottom}`,
      `maxScroll:${totalScrollLength}`,
      `scrolled:${howMuchIsScrolled}`,
      `res:${
        totalScrollLength - elementDistanceFromTopToBottom + howMuchIsScrolled
      }`,
      `isInSight:${
        totalScrollLength - elementDistanceFromTopToBottom + howMuchIsScrolled <
        visibleScrollLength
      }`
    );
    return (
      totalScrollLength - elementDistanceFromTopToBottom + howMuchIsScrolled <
      visibleScrollLength
    );
  };

  const renderSkeletonBox = () => {
    return (
      <ListItem key={Math.random()} className={classes.messageBox}>
        <div className={classes.userIcon}>
          <Skeleton
            variant="circle"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={classes.skeletonTextContainer}>
          <Skeleton
            animation="wave"
            style={{ width: "40%", height: ".5rem", marginTop: ".5rem" }}
            className={classes.skeletonText}
            variant="text"
          />
          <Skeleton
            animation="wave"
            style={{ width: "100%", height: ".5rem", marginTop: ".25rem" }}
            className={classes.skeletonText}
            variant="text"
          />
        </div>
      </ListItem>
    );
  };

  /**
   *
   * @param {ChatThreadMessage} message
   * @param {boolean} isGrouped - If the message is being sent by the same user, it's pointless to render his username and avatar multiple times. Apply a short-hand version of message box
   */
  const renderMessageBox = ({ message, isGrouped, index }) => {
    return (
      <ListItem
        id={`message-box-${index}`}
        key={Math.random()}
        style={{
          paddingTop: isGrouped ? 0 : "auto",
        }}
      >
        <div className={classes.messageBox}>
          {!isGrouped && (
            <div className={classes.avatarContainer} name={"AvatarContainer"}>
              <UserAvatarWithActions
                userUUID={message.userUUID}
                avatarUrl={message.avatarUrl}
                width={28}
                height={28}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              marginLeft: isGrouped ? 36 : 8,
            }}
          >
            {!isGrouped && (
              <Typography
                className={classes.username}
                variant="caption"
                disabled
              >
                {message.username}
              </Typography>
            )}

            <Typography className={classes.messageText} variant="subtitle2">
              {message.messageText}
            </Typography>
          </div>
        </div>
      </ListItem>
    );
  };

  const scrollElement = useRef(null);
  const classes = useStyles();
  return (
    <motion.div
      className={classes.messagesScroll}
      initial={{ opacity: 0.9, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      onScroll={onChatScroll}
    >
      <List ref={scrollElement}>{renderChatMessages()}</List>
    </motion.div>
  );
};

export default React.memo(ChatMessagesScroll);
