import React, { Fragment, ReactElement } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  withWidth,
  Tabs,
  Tab,
  Popover
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
      padding: theme.spacing.unit * 2
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
    return (
      <div className={classes.root}>
        {isMobile(width) ? (
          <Fragment>
            <Tabs
              className={classes.tabs}
              indicatorColor="primary"
              onChange={this.onTabChange}
              value={tab}
            >
              <Tab label="Front" value={TabMode.FRONT} />
              <Tab label="Back" value={TabMode.BACK} />
            </Tabs>
            {tab === TabMode.FRONT ? (
              <FrontBody
                className={classes.side}
                menuComponent={menuComponent}
                muscleGroupLevels={muscleGroupLevels}
                selected={selected}
              />
            ) : (
              <BackBody
                className={classes.side}
                selected={selected}
                muscleGroupLevels={muscleGroupLevels}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <FrontBody
              className={classes.side}
              menuComponent={menuComponent}
              muscleGroupLevels={muscleGroupLevels}
              selected={selected}
            />
            <BackBody
              className={classes.side}
              selected={selected}
              muscleGroupLevels={muscleGroupLevels}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

const styled = withStyles(styles)(withWidth()(FullBody));
export { styled as FullBody };

type BodyProps = PopoverProps & {
  classes: Classes;
};

export const BodyMenu = withStyles(styles)((props: BodyProps) =>
  // Don't render if there are no children to render
  props.children ? (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      {...props}
      classes={{
        paper: props.classes.popover
      }}
    />
  ) : null
);
