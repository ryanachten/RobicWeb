import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { MuscleGroup } from "../../constants/types";
import { Classes } from "jss";
import FrontBody from "./FrontBody";
import BackBody from "./BackBody";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexFlow: "row wrap"
    },
    side: {
      flexGrow: 1,
      maxWidth: "500px",
      minWidth: "200px"
    }
  });

type Props = {
  classes: Classes;
  selected: MuscleGroup[];
};

const FullBody = ({ classes, selected }: Props) => {
  return (
    <div className={classes.root}>
      <FrontBody className={classes.side} selected={selected} />
      <BackBody className={classes.side} selected={selected} />
    </div>
  );
};

const styled = withStyles(styles)(FullBody);
export { styled as FullBody };
