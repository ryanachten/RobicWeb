import React from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import CircuitIcon from "@material-ui/icons/FilterTiltShift";
import SupersetIcon from "@material-ui/icons/FlashOn";
import { Classes } from "jss";
import { Typography, withStyles } from "@material-ui/core";
import { ExerciseType } from "../constants/types";

const styles = (theme: Theme) =>
  createStyles({
    typeIcon: {
      marginRight: theme.spacing.unit
    },
    typeWrapper: {
      alignItems: "center",
      display: "flex"
    }
  });

type Props = {
  classes: Classes;
  className?: string;
  type: ExerciseType;
};

const ExerciseTypeIcon = ({ classes, type }: Props) => {
  if (!type || type === ExerciseType.STANDARD) {
    return null;
  }
  return (
    <div className={classes.typeWrapper}>
      {type === ExerciseType.CIRCUIT && (
        <CircuitIcon className={classes.typeIcon} color="primary" />
      )}
      {type === ExerciseType.SUPERSET && (
        <SupersetIcon className={classes.typeIcon} color="primary" />
      )}
      <Typography color="textSecondary" variant="h6">
        {`${type} exercise`}
      </Typography>
    </div>
  );
};

const styled = withStyles(styles)(ExerciseTypeIcon);
export { styled as ExerciseTypeIcon };
