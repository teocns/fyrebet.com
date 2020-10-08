import React, { useState, useEffect } from "react";

import {
  Tooltip,
  Menu,
  Divider,
  MenuItem,
  IconButton,
  Typography,
} from "@material-ui/core";

import Langs from "../../constants/Langs";
import ActionTypes from "../../constants/ActionTypes";
import languageStore from "../../store/language";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as uiActions from "../../actions/ui";

const useStyles = makeStyles((theme) => {
  return {
    flag: {
      width: "1.25rem",
      height: "1.25rem",
    },
  };
});

const LanguagePicker = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [CurrentLanguage, setCurrentLanguage] = useState(
    Langs[languageStore.getLang()]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeLang = (shortCode) => {
    uiActions.changeLanguage(shortCode);
    setAnchorEl(null);
  };

  const uuid = Date.now();
  const theme = useTheme();
  const classes = useStyles();

  const onLanguageChanged = () => {
    setCurrentLanguage(Langs[languageStore.getLang()]);
  };

  useEffect(() => {
    languageStore.addChangeListener(
      ActionTypes.LANGUAGE_CHANGE,
      onLanguageChanged
    );

    return () => {
      languageStore.removeChangeListener(
        ActionTypes.LANGUAGE_CHANGE,
        onLanguageChanged
      );
    };
  });
  return (
    <React.Fragment>
      <Tooltip title="Change language" aria-label={CurrentLanguage.language}>
        <IconButton
          aria-controls={`language-picker-${uuid}`}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <img
            className={classes.flag}
            src={CurrentLanguage.flagAsset}
            alt={CurrentLanguage.language}
          />
        </IconButton>
      </Tooltip>

      <Menu
        id={`language-picker-${uuid}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={changeLang}
      >
        {Object.values(Langs).map(
          ({ shortCode, language, lang, flagAsset }) => {
            return (
              <MenuItem
                onClick={() => {
                  changeLang(shortCode);
                }}
                disabled={CurrentLanguage.lang === lang}
              >
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <img
                    className={classes.flag}
                    src={flagAsset}
                    alt={language}
                  />
                  <Typography
                    variant="caption"
                    style={{ marginLeft: theme.spacing(1) }}
                  >
                    {language}
                  </Typography>
                </div>
              </MenuItem>
            );
          }
        )}
      </Menu>
    </React.Fragment>
  );
};

export default LanguagePicker;
