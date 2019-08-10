import React, { SyntheticEvent, Fragment } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import PersonIcon from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import {
  withWidth,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  IconButton
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import routes from "../constants/routes";
import { Link } from "../components/Link";
import { isMobile } from "../constants/sizes";

const styles = (theme: Theme) =>
  createStyles({
    bottomNav: {
      bottom: 0,
      position: "fixed",
      width: "100%"
    },
    link: {
      margin: theme.spacing(2)
    },
    mobileProfileWrapper: {
      padding: theme.spacing(2),
      position: "fixed",
      right: 0,
      top: 0
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

type State = {
  anchorEl: any;
};

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.navigateToRoute = this.navigateToRoute.bind(this);
    this.renderProfileMenu = this.renderProfileMenu.bind(this);
  }

  onMenuClick(event: SyntheticEvent) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  onLogout() {
    window.localStorage.removeItem("token");
    window.location.reload();
    this.setState({
      anchorEl: null
    });
  }

  navigateToRoute(route: string) {
    this.props.history.push(route);
  }

  renderProfileMenu() {
    const anchorEl = this.state.anchorEl;
    return (
      <Fragment>
        <IconButton
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={this.onMenuClick}
        >
          <PersonIcon />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.onLogout}
        >
          <MenuItem onClick={this.onLogout}>Logout</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  render() {
    const { children, classes, width } = this.props;
    return (
      <div>
        {isMobile(width) ? (
          <div className={classes.mobileProfileWrapper}>
            {this.renderProfileMenu()}
          </div>
        ) : (
          <AppBar color="inherit" position="static">
            <Toolbar>
              <Typography variant="h5">robic</Typography>
              <div className={classes.spacer} />
              <Link
                className={classes.link}
                url={routes.HOME.route}
                label={routes.HOME.label}
              />
              <Link
                className={classes.link}
                url={routes.EXERCISES.route}
                label={routes.EXERCISES.label}
              />
              <Link
                className={classes.link}
                url={routes.ACTIVITY.route}
                label={routes.ACTIVITY.label}
              />
              {this.renderProfileMenu()}
            </Toolbar>
          </AppBar>
        )}

        {children}

        {isMobile(width) && (
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
            <BottomNavigationAction
              label={routes.ACTIVITY.label}
              value={routes.ACTIVITY.route}
            />
          </BottomNavigation>
        )}
      </div>
    );
  }
}

export const styled = withStyles(styles)(withWidth()(Navigation));
export default withRouter(styled);
