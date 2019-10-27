import React from "react";
import {
  withStyles,
  Theme,
  createStyles,
  CircularProgress
} from "@material-ui/core";
import { Classes } from "jss";
import { RobicLogo } from "../RobicLogo";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      height: "80vh",
      flexFlow: "column",
      justifyContent: "center"
    }
  });

type Props = {
  classes: Classes;
};
const LoadingSplash = ({ classes }: Props) => (
  <div className={classes.root}>
    <RobicLogo size="large" />
    <CircularProgress color="secondary" size={60} />
  </div>
);

const styled = withStyles(styles)(LoadingSplash);
export { styled as LoadingSplash };
