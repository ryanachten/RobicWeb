import React from "react";
import { Card, Typography, Theme, Divider, withWidth } from "@material-ui/core";
import { RobicLogo } from "../RobicLogo";
import { withStyles, createStyles } from "@material-ui/styles";
import { HEADER_FONT } from "../../constants/fonts";
import { Classes } from "jss";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../../constants/sizes";

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      marginBottom: theme.spacing(2)
    },
    logo: {
      margin: "0 auto",
      marginBottom: theme.spacing(2)
    },
    root: {
      margin: "0 auto",
      maxWidth: theme.breakpoints.values.sm,
      padding: theme.spacing(4)
    },
    subtitle: {
      marginBottom: theme.spacing(2),
      textAlign: "center"
    },
    title: {
      color: theme.palette.primary.light,
      fontFamily: HEADER_FONT,
      marginBottom: theme.spacing(2),
      textAlign: "center",
      textTransform: "lowercase"
    }
  });

export type ActionPanelProps = {
  children?: any;
  title?: string;
  tagline?: string;
  width?: Breakpoint;
};

type Props = ActionPanelProps & {
  classes: Classes;
};

const ActionPanel = ({
  classes,
  children,
  title = "",
  tagline = "",
  width
}: Props) => (
  <Card className={classes.root}>
    <RobicLogo className={classes.logo} />
    <Typography
      variant={width && isMobile(width) ? "h5" : "h4"}
      className={classes.title}
    >
      {title}
    </Typography>
    <Typography variant="subtitle1" className={classes.subtitle}>
      {tagline}
    </Typography>
    {width && isMobile(width) && <Divider className={classes.divider} />}
    {children}
  </Card>
);

const styled = withStyles(styles)(withWidth()(ActionPanel));

export { styled as ActionPanel };
