import React, { useState, useEffect } from "react";

import { Dialog } from "@material-ui/core";

import uiStore from "../../store/ui";
import ActionTypes from "../../constants/ActionTypes";

const UserProfileModal = () => {
  const [Open, setOpen] = useState(uiStore.modals.userProfile.isOpen);

  const onUserProfileModalToggle = () => {
    alert("Yeahh");
    setOpen(uiStore.modals.userProfile.isOpen);
  };
  useEffect(() => {
    uiStore.addChangeListener(
      ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE,
      onUserProfileModalToggle
    );

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.UI_USER_PROFILE_MODAL_TOGGLE,
        onUserProfileModalToggle
      );
    };
  });
  return <Dialog open={Open}>This is user profile modal</Dialog>;
};

export default UserProfileModal;
