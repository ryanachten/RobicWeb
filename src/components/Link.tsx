import React from "react";
import MuiLink from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import classnames from "../utils";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none"
    }
  });

type Props = {
  className?: string;
  classes: Classes;
  label: string;
  url: string;
};

const Link = ({ className, classes, label, url }: Props) => (
  <RouterLink
    className={classnames(className, classes.link)}
    key={url}
    to={url}
  >
    <MuiLink color="inherit" component="span" variant="body1">
      {label}
    </MuiLink>
  </RouterLink>
);

const styled = withStyles(styles)(Link);
export { styled as Link };
