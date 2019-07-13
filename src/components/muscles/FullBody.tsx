import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { MuscleGroup } from "../../constants/types";
import { Classes } from "jss";
import { transparentize } from "../../utils";
import FrontBody from "./FrontBody";
import BackBody from "./BackBody";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    }
  });

type Props = {
  classes: Classes;
  selected: MuscleGroup[];
};

const FullBody = ({ classes, selected }: Props) => {
  return (
    <div className={classes.root}>
      <FrontBody selected={selected} />
      <BackBody selected={selected} />
    </div>
  );
};

const styled = withStyles(styles)(FullBody);
export { styled as FullBody };
