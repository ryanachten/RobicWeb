import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { Classes } from "jss";
import classnames from "../../utils";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 4,
      [theme.breakpoints.only("xs")]: {
        paddingBottom: theme.spacing.unit * 4 + 40
      }
    }
  });

type Props = {
  children: any;
  classes: Classes;
};
const PageRoot = ({ children, classes }: Props) => {
  const activeClasses = [classes.root];
  return <div className={classnames(activeClasses)}>{children}</div>;
};

const styled = withStyles(styles)(PageRoot);
export { styled as PageRoot };
