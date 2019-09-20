import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { Classes } from "jss";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSplash } from "./LoadingSplash";
import { PURPLE_GRADIENT, LIGHT_GRADIENT } from "../../constants/colors";
import Navigation from "../Navigation";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginTop: theme.spacing(4)
    },
    root: {
      minHeight: "100vh",
      padding: theme.spacing(4),
      [theme.breakpoints.only("xs")]: {
        paddingBottom: theme.spacing(4) + 40
      }
    }
  });

export enum BackgroundMode {
  purple,
  light
}

type Props = {
  backgroundMode?: BackgroundMode;
  children: any;
  classes: Classes;
  loading: boolean;
  error?: Error; // hook up via GraphQL result.error prop
};

const PageRoot = ({
  backgroundMode,
  children,
  classes,
  error,
  loading
}: Props) => {
  const gradient =
    backgroundMode === BackgroundMode.purple ? PURPLE_GRADIENT : LIGHT_GRADIENT;
  return (
    <main className={classes.root} style={{ backgroundImage: gradient }}>
      <Navigation backgroundMode={backgroundMode}>
        {loading ? <LoadingSplash /> : children}
        <ErrorMessage className={classes.error} error={error} />
      </Navigation>
    </main>
  );
};

const styled = withStyles(styles)(PageRoot);
export { styled as PageRoot };
