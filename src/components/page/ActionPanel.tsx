import React from "react";
import { Card, Typography, Theme, Divider } from "@material-ui/core";
import { RobicLogo } from "../RobicLogo";
import { withStyles, createStyles } from "@material-ui/styles";
import { HEADER_FONT } from "../../constants/fonts";
import { Classes } from "jss";

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      display: "flex",
      height: "39px",
      margin: "0 auto",
      marginBottom: theme.spacing(2),
      width: "80px"
    },
    root: {
      padding: theme.spacing(2)
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
    <Divider />
    {children}
  </Card>
);

const styled = withStyles(styles)(ActionPanel);

export { styled as ActionPanel };
