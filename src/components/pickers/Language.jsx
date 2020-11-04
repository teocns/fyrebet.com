import React, { useState, useEffect } from "react";

import {
  Tooltip,
  Menu,
  Divider,
  Box,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";

import Langs from "../../constants/Langs";
import ActionTypes from "../../constants/ActionTypes";
import languageStore from "../../store/language";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as uiActions from "../../actions/ui";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
const useStyles = makeStyles((theme) => {
  return {
    icon: {
      width: 22,
      height: 22,
    },
  };
});

/**
 * @param {object} obj
 * @param {boolean} obj.showSelectedValueName - Ccomponent will not return an IconButton but a select if true
 */
const LanguagePicker = ({ asIcon }) => {
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

  const renderSelectedLanguage = () => {
    if (!asIcon) {
      return (
        <Button
          disableElevation={true}
          variant="text"
          onClick={handleClick}
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
        >
          {CurrentLanguage.language.toLowerCase()}
        </Button>
      );
    }
    return (
      <Tooltip title="Change language" aria-label={CurrentLanguage.language}>
        <IconButton
          aria-controls={`language-picker-${uuid}`}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Avatar
            className={classes.icon}
            src={CurrentLanguage.flagAsset}
            alt={CurrentLanguage.language}
          />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <React.Fragment>
      {renderSelectedLanguage()}
      <Menu
        id={`language-picker-${uuid}`}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
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
                    className={classes.icon}
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

export default React.memo(LanguagePicker);
