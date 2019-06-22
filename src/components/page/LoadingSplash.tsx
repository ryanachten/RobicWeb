import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  CircularProgress
} from "@material-ui/core";
import { Classes } from "jss";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      height: "80vh",
      justifyContent: "center"
    }
  });

type Props = {
  classes: Classes;
};
const LoadingSplash = ({ classes }: Props) => (
  <div className={classes.root}>
    <CircularProgress />
  </div>
);

const styled = withStyles(styles)(LoadingSplash);
export { styled as LoadingSplash };
