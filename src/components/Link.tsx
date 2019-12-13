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
    },
    innerLink: {
      "&:hover": {
        borderBottom: `1px solid ${theme.palette.common.white}`,
        paddingBottom: theme.spacing(0.5),
        textDecoration: "none"
      }
    }
  });

type Props = {
  className?: string;
  classes: Classes;
  innerLinkClasses?: string;
  label: string;
  onClick?: () => void;
  style?: any;
  url?: string;
};

const Link = ({
  className,
  classes,
  innerLinkClasses,
  label,
  onClick,
  style,
  url
}: Props) => (
  <RouterLink
    className={classnames(className, classes.link)}
    key={url}
    onClick={onClick}
    to={url || "#"}
    style={style}
  >
    <MuiLink
      className={classnames(classes.innerLink, innerLinkClasses)}
      color="inherit"
      component="span"
      variant="body1"
    >
      {label}
    </MuiLink>
  </RouterLink>
);

const styled = withStyles(styles)(Link);
export { styled as Link };
