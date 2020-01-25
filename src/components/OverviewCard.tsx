import React from "react";
import { Typography, withStyles, createStyles, Theme } from "@material-ui/core";
import { Classes } from "jss";

type Props = {
  classes: Classes;
  className?: string;
  stats: {
    label: string;
    value: string;
  }[];
};

const styles = (theme: Theme) =>
  createStyles({
    item: {
      marginRight: theme.spacing(3),

      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(3)
      }
    },
    value: {
      marginTop: theme.spacing(1)
    },
    wrapper: {
      display: "flex",
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(2),

      [theme.breakpoints.down("sm")]: {
        flexFlow: "row wrap"
      }
    }
  });

const OverviewCard = ({ className, classes, stats }: Props) => (
  <section className={className}>
    <Typography variant="h6">Overview</Typography>
    <div className={classes.wrapper}>
      {stats.map(
        ({ label, value }, index) =>
          value.length > 0 && (
            <div className={classes.item} key={index}>
              <Typography color="textSecondary" variant="body2">
                {label}
              </Typography>
              <Typography className={classes.value}>{value}</Typography>
            </div>
          )
      )}
    </div>
  </section>
);

const styled = withStyles(styles)(OverviewCard);
export { styled as OverviewCard };
