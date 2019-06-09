import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import {
  withWidth,
  BottomNavigation,
  BottomNavigationAction,
  Typography
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import routes from "../constants/routes";
import Link from "../components/Link";

const styles = (theme: Theme) =>
  createStyles({
    bottomNav: {
      bottom: 0,
      position: "fixed",
      width: "100%"
    },
    link: {
      color: theme.palette.text.primary,
      margin: theme.spacing.unit * 2,
      textDecoration: "none"
    },
    spacer: {
      flexGrow: 1
    }
  });

type MenuLink = {
  url: string;
  text: string;
};

type Props = RouteComponentProps & {
  children: any;
  classes: Classes;
  width: Breakpoint;
};

type State = {};

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.navigateToRoute = this.navigateToRoute.bind(this);
  }

  navigateToRoute(route: string) {
    this.props.history.push(route);
  }

  render() {
    const { children, classes, width } = this.props;
    const isMobile = width === "xs";

    return (
      <div>
        {!isMobile && (
          <AppBar color="inherit" position="static">
            <Toolbar>
              <Typography variant="h5">robic</Typography>
              <div className={classes.spacer} />
              <Link url={routes.HOME.route} label={routes.HOME.label} />
              <Link
                url={routes.EXERCISES.route}
                label={routes.EXERCISES.label}
              />
            </Toolbar>
          </AppBar>
        )}

        {children}

        {isMobile && (
          <BottomNavigation
            className={classes.bottomNav}
            showLabels
            onChange={(e, val) => this.navigateToRoute(val)}
          >
            <BottomNavigationAction
              label={routes.HOME.label}
              value={routes.HOME.route}
            />
            <BottomNavigationAction
              label={routes.EXERCISES.label}
              value={routes.EXERCISES.route}
            />
          </BottomNavigation>
        )}
      </div>
    );
  }
}

const styled = withStyles(styles)(withWidth()(Navigation));
export default withRouter(styled);
