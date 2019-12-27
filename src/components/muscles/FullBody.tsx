import React, { Fragment, ReactElement } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  Popover,
  Typography
} from "@material-ui/core";
import { MuscleGroup } from "../../constants/types";
import { Classes } from "jss";
import FrontBody from "./FrontBody";
import BackBody from "./BackBody";
import { PopoverProps } from "@material-ui/core/Popover";
import { lerpColor, transparentize } from "../../utils";
import { CHERRY_RED } from "../../constants/colors";

const styles = (theme: Theme) =>
  createStyles({
    popover: {
      padding: theme.spacing(2)
    },
    root: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center"
    },
    side: {
      flexGrow: 1,
      maxWidth: "500px"
    },
    tabs: {
      width: "100%"
    },
    tabContainer: {
      justifyContent: "center"
    }
  });

type Props = {
  classes: Classes;
  menuComponent?: (muscle: MuscleGroup) => ReactElement | null;
  muscleGroupLevels?: number;
  selected: MuscleGroup[];
};

type State = {};

const hasFrontMuscles = (muscles: MuscleGroup[]): boolean => {
  const frontMuscles = [
    MuscleGroup.NECK,
    MuscleGroup.FOREARMS,
    MuscleGroup.BICEPS,
    MuscleGroup.SHOULDERS,
    MuscleGroup.OBLIQUES,
    MuscleGroup.CALVES,
    MuscleGroup.QUADS,
    MuscleGroup.ABS,
    MuscleGroup.CHEST
  ];
  return muscles.some(m => frontMuscles.includes(m));
};

const hasBackMuscles = (muscles: MuscleGroup[]): boolean => {
  const backMuscles = [
    MuscleGroup.TRAPS,
    MuscleGroup.GLUTES,
    MuscleGroup.CALVES,
    MuscleGroup.HAMS,
    MuscleGroup.LOWER_BACK,
    MuscleGroup.LATS,
    MuscleGroup.SHOULDERS,
    MuscleGroup.TRICEPS,
    MuscleGroup.FOREARMS
  ];
  return muscles.some(m => backMuscles.includes(m));
};

class FullBody extends React.Component<Props, State> {
  render() {
    const {
      classes,
      menuComponent,
      muscleGroupLevels = 7,
      selected
    } = this.props;

    const hasFront = hasFrontMuscles(selected);
    const hasBack = hasBackMuscles(selected);

    return (
      <div className={classes.root}>
        <Fragment>
          {hasFront && (
            <FrontBody
              className={classes.side}
              menuComponent={menuComponent}
              muscleGroupLevels={muscleGroupLevels}
              selected={selected}
            />
          )}
          {hasBack && (
            <BackBody
              className={classes.side}
              menuComponent={menuComponent}
              selected={selected}
              muscleGroupLevels={muscleGroupLevels}
            />
          )}
        </Fragment>
      </div>
    );
  }
}

const styled = withStyles(styles)(FullBody);
export { styled as FullBody };

type BodyProps = PopoverProps & {
  muscleGroup: MuscleGroup | null;
  classes: Classes;
};

export const getFillColour = (
  selectedMuscles: MuscleGroup[],
  muscleGroupLevels: number,
  theme: Theme,
  muscle?: MuscleGroup
): string => {
  const results =
    muscle && selectedMuscles.filter((m: MuscleGroup) => m === muscle);
  if (results && results.length > 0) {
    return lerpColor(
      theme.palette.secondary.light,
      CHERRY_RED,
      results.length / muscleGroupLevels
    );
  }
  return transparentize(theme.palette.text.disabled, 0.1);
};

export const BodyMenu = withStyles(styles)(
  ({
    children,
    classes,
    id,
    muscleGroup,
    anchorEl,
    onClose,
    open
  }: BodyProps) => (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      id={id}
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      classes={{
        paper: classes.popover
      }}
    >
      <Fragment>
        {muscleGroup && (
          <Typography color="primary" variant="subtitle1">
            {muscleGroup}
          </Typography>
        )}
        {children}
      </Fragment>
    </Popover>
  )
);
