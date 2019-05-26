import * as React from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      width: "100vw"
    }
  });

type State = {};

type Props = {
  classes: any;
  pageName: string;
};

class Stub extends React.Component<Props, State> {
  render() {
    const { classes, pageName } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h1">{pageName}</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Stub);
