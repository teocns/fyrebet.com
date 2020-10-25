import React from "react";
import { Paper, Button } from "@material-ui/core";
import AddUsersAutocomplete from "../../components/pickers/AddUsersAutocomplete";

import { makeStyles } from "@material-ui/core/styles";
import { PersonAdd as PersonAddIcon } from "@material-ui/icons";

import GamePlayAreaComponent from "../../components/GamePlayArea";

const useStyles = makeStyles((theme) => {
  return {
    addPeopleIcon: {
      margin: "1rem",
    },
  };
});

const CreateDuelView = () => {
  const classes = useStyles();

  return (
    <GamePlayAreaComponent>
      <Button>
        <PersonAddIcon className={classes.addPeopleIcon} />
        ADD ME FAGs
      </Button>
    </GamePlayAreaComponent>
  );
};

export default CreateDuelView;
