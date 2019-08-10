import React from "react";
import classnames from "../../utils";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme, createStyles } from "@material-ui/core";
import { Link } from "../Link";

type Props = {
  breadcrumb?: {
    label: string;
    onClick?: () => void;
    url?: string;
  };
  className?: string;
  classes: any;
  label: string;
};

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(4),
      marginLeft: 0
    },
    text: {
      marginLeft: 0,
      textTransform: "lowercase"
    }
  });

const PageTitle = ({ className, classes, label, breadcrumb }: Props) => {
  return (
    <div className={classes.wrapper}>
      <Typography
        className={classnames(classes.text, className)}
        variant="h5"
        component="h1"
      >
        {label}
      </Typography>
      {breadcrumb && (
        <Link
          label={breadcrumb.label}
          url={breadcrumb.url}
          onClick={breadcrumb.onClick}
        />
      )}
    </div>
  );
};

const styled = withStyles(styles)(PageTitle);
export { styled as PageTitle };
