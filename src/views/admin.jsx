import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AllUsersView from "./all-users";

const useStyles = makeStyles((theme) => ({
  appView: {
    overflowY: "scroll",
  },
}));

const AdminView = () => {
  const classes = useStyles();
  return <AllUsersView />;
};

export default AdminView;
