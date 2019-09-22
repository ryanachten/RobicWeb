import React from "react";
import { Card, Typography, Theme, Divider } from "@material-ui/core";
import { RobicLogo } from "../RobicLogo";
import { withStyles, createStyles } from "@material-ui/styles";
import { HEADER_FONT } from "../../constants/fonts";
import { Classes } from "jss";

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
      maxWidth: "640px",
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
      textAlign: "center"
    }
  });

type Props = {
  children?: any;
  classes: Classes;
};

const ActionPanel = ({ classes, children }: Props) => (
  <Card className={classes.root}>
    <RobicLogo className={classes.logo} />
    <Typography variant="h5" className={classes.title}>
      Morning Ryan!
    </Typography>
    <Typography variant="subtitle1" className={classes.subtitle}>
      Select an exercise to get started
    </Typography>
    <Divider className={classes.divider} />
    {children}
  </Card>
);

const styled = withStyles(styles)(ActionPanel);

export { styled as ActionPanel };
