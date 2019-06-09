import React from "react";
import MuiLink from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.text.primary,
      margin: theme.spacing.unit * 2,
      textDecoration: "none"
    }
  });

type Props = {
  label: string;
  url: string;
  classes: Classes;
};

const Link = ({ classes, label, url }: Props) => (
  <RouterLink key={url} to={url} className={classes.link}>
    <MuiLink color="inherit" component="span" variant="body1">
      {label}
    </MuiLink>
  </RouterLink>
);

export default withStyles(styles)(Link);
