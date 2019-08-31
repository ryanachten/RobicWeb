import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { Classes } from "jss";
import { ErrorMessage } from "./ErrorMessage";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginTop: theme.spacing(4)
    },
    root: {
      padding: theme.spacing(4),
      [theme.breakpoints.only("xs")]: {
        paddingBottom: theme.spacing(4) + 40
      }
    }
  });

type Props = {
  children: any;
  classes: Classes;
  error?: Error; // hook up via GraphQL result.error prop
};

const PageRoot = ({ children, classes, error }: Props) => {
  return (
    <main className={classes.root}>
      {children}
      <ErrorMessage className={classes.error} error={error} />
    </main>
  );
};

const styled = withStyles(styles)(PageRoot);
export { styled as PageRoot };
