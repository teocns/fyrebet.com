import React from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 99,
    background: "#ffffffe6",
    opacity: "0",
    transition: "opacity .275s",
    pointerEvents: "none",
  },
  open: {
    opacity: "1",
  },
  circularProgress: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)!important",
  },
});

class LoadingOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    let { classes } = this.props;
    this.state = {
      open: classes.root,
    };
    window.loadingOverlay = (val) => {
      if (val) {
        this.setState({
          open: (this.props.root, this.props.open),
        });
      } else {
        this.setState({
          open: this.props.root,
        });
      }
    };
  }

  render() {
    return (
      <div className={this.state.open} disabled>
        <CircularProgress
          className={this.props.circularProgress}
          color="primary"
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(LoadingOverlay);
