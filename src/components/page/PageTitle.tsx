import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme, createStyles, withWidth } from "@material-ui/core";
import { isMobile } from "../../constants/sizes";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { HEADER_FONT } from "../../constants/fonts";
import { Classes } from "jss";

type Props = {
  classes: Classes;
  children: string;
  width: Breakpoint;
};

const styles = (theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.light,
      fontFamily: HEADER_FONT,
      marginBottom: theme.spacing(2),
      textAlign: "center",
      textTransform: "lowercase",

      [theme.breakpoints.up("sm")]: {
        marginBottom: theme.spacing(4)
      }
    }
  });

const PageTitle = ({ classes, children, width }: Props) => {
  return (
    <Typography
      variant={width && isMobile(width) ? "h5" : "h4"}
      className={classes.title}
    >
      {children}
    </Typography>
  );
};

const styled = withStyles(styles)(withWidth()(PageTitle));
export { styled as PageTitle };
