import * as React from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { CircularProgress } from "@material-ui/core";
import PageTitle from "../components/PageTitle";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100vh",
      width: "100vw"
    },
    title: {
      marginBottom: theme.spacing.unit * 4
    }
  });

type State = {};

type Props = {
  classes: Classes;
};

class Loading extends React.Component<WithStyles<typeof styles>, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <PageTitle label="Hold tight, we're loading..." />
        <CircularProgress />
      </div>
    );
  }
}

export default withStyles(styles)(Loading);
