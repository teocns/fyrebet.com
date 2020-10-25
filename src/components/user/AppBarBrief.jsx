import React, { useState } from "react";
import sessionStore from "../../store/session";

import { Avatar } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import assetUrl from "../../helpers/assetUrl";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      "&:hover": {
        cursor: "pointer",
      },
    },
  };
});

const AppBarUserBrief = () => {
  const [User, setUser] = useState(sessionStore.getUser());
  return (
    <div>
      <Avatar src={assetUrl(User.avatarUrl)} />
    </div>
  );
};

export default AppBarUserBrief;
