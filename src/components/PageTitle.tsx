import React from "react";
import classnames from "../utils";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme, createStyles } from "@material-ui/core";

export enum TextPositiion {
  left = "left"
}

type Props = {
  className?: string;
  classes: any;
  label: string;
  position?: TextPositiion;
};

const styles = (theme: Theme) =>
  createStyles({
    text: {
      textTransform: "lowercase"
    },
    leftCorner: {
      margin: theme.spacing.unit * 4
    }
  });

const PageTitle = ({ className, classes, label, position }: Props) => {
  const titleStyles: string[] = [classes.text, className];

  if (position === TextPositiion.left) {
    titleStyles.push(classes.leftCorner);
  }

  return (
    <Typography className={classnames(titleStyles)} variant="h2" component="h1">
      {label}
    </Typography>
  );
};

export default withStyles(styles)(PageTitle);
