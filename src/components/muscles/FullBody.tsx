import React, { Fragment, ReactElement } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  withWidth,
  Tabs,
  Tab,
  Popover,
  Typography
} from "@material-ui/core";
import { MuscleGroup } from "../../constants/types";
import { Classes } from "jss";
import FrontBody from "./FrontBody";
import BackBody from "./BackBody";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../../constants/sizes";
import { PopoverProps } from "@material-ui/core/Popover";

const styles = (theme: Theme) =>
  createStyles({
    popover: {
      padding: theme.spacing(2)
    },
    root: {
      display: "flex",
      flexFlow: "row wrap"
    },
    side: {
      flexGrow: 1,
      maxWidth: "500px",
      minWidth: "200px"
    },
    tabs: {
      width: "100%"
    }
  });

enum TabMode {
  FRONT,
  BACK
}

type Props = {
  classes: Classes;
  menuComponent?: (muscle: MuscleGroup) => ReactElement | null;
  muscleGroupLevels?: number;
  selected: MuscleGroup[];
  width: Breakpoint;
};

type State = {
  tab: TabMode;
};

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
  constructor(props: Props) {
    super(props);
    this.state = {
      tab: TabMode.FRONT
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(e: any, tab: TabMode) {
    this.setState({
      tab
    });
  }

  render() {
    const {
      classes,
      menuComponent,
      muscleGroupLevels = 7,
      selected,
      width
    } = this.props;
    const tab = this.state.tab;

    const hasFront = hasFrontMuscles(selected);
    const hasBack = hasBackMuscles(selected);
    const hasBoth = hasFront && hasBack;

    // Only use tabs if both front and back are present
    const showFront: boolean =
      (!hasBoth && hasFront) || (hasBoth && tab === TabMode.FRONT);

    const showBack: boolean =
      (!hasBoth && hasBack) || (hasBoth && tab === TabMode.BACK);

    return (
      <div className={classes.root}>
        {isMobile(width) ? (
          <Fragment>
            {hasBoth && (
              <Tabs
                className={classes.tabs}
                indicatorColor="primary"
                onChange={this.onTabChange}
                value={tab}
              >
                <Tab label="Front" value={TabMode.FRONT} />
                <Tab label="Back" value={TabMode.BACK} />
              </Tabs>
            )}
            {showFront && (
              <FrontBody
                className={classes.side}
                menuComponent={menuComponent}
                muscleGroupLevels={muscleGroupLevels}
                selected={selected}
              />
            )}
            {showBack && (
              <BackBody
                className={classes.side}
                menuComponent={menuComponent}
                selected={selected}
                muscleGroupLevels={muscleGroupLevels}
              />
            )}
          </Fragment>
        ) : (
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
        )}
      </div>
    );
  }
}

const styled = withStyles(styles)(withWidth()(FullBody));
export { styled as FullBody };

type BodyProps = PopoverProps & {
  muscleGroup: MuscleGroup | null;
  classes: Classes;
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
