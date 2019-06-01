import React from "react";
import classnames from "../utils";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme, createStyles } from "@material-ui/core";

type Props = {
  className?: string;
  classes: any;
  label: string;
};

const styles = (theme: Theme) =>
  createStyles({
    text: {
      margin: theme.spacing.unit * 4,
      marginLeft: 0,
      textTransform: "lowercase"
    }
  });

const PageTitle = ({ className, classes, label }: Props) => {
  return (
    <Typography
      className={classnames(classes.text, className)}
      variant="h5"
      component="h1"
    >
      {label}
    </Typography>
  );
};

export default withStyles(styles)(PageTitle);
