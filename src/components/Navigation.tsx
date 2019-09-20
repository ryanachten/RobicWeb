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
import { LOGO_FONT } from "../constants/fonts";
import { BackgroundMode } from "./page/PageRoot";

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "transparent",
      boxShadow: "none"
    },
    bottomNav: {
      bottom: 0,
      position: "fixed",
      width: "100%"
    },
    link: {
      margin: theme.spacing(2)
    },
    linkWrapper: {
      display: "flex",
      flexGrow: 1
    },
    mobileProfileWrapper: {
      padding: theme.spacing(2),
      position: "fixed",
      right: 0,
      top: 0
    },
    profileButton: {
      position: "absolute",
      right: theme.spacing(2)
    },
    robicLogo: {
      fontFamily: LOGO_FONT
    },
    toolbar: {
      background: "transparent"
    }
  });

type MenuLink = {
  url: string;
  text: string;
};

type Props = RouteComponentProps & {
  backgroundMode?: BackgroundMode;
  children: any;
  classes: Classes;
  theme: Theme;
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
    this.renderDesktop = this.renderDesktop.bind(this);
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
    const { classes } = this.props;
    return (
      <Fragment>
        <IconButton
          aria-controls="profile-menu"
          className={classes.profileButton}
          aria-haspopup="true"
          onClick={this.onMenuClick}
        >
          <PersonIcon color="disabled" />
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

  renderDesktop() {
    const { backgroundMode, children, classes, theme } = this.props;
    const purpleBg = backgroundMode === BackgroundMode.purple;
    const marginRight = purpleBg ? 0 : "48px";
    const justifyContent = purpleBg ? "center" : "flex-end";
    const color = purpleBg
      ? theme.palette.common.white
      : theme.palette.primary.main;
    return (
      <div>
        <AppBar className={classes.appBar} color="inherit" position="static">
          <Toolbar className={classes.toolbar}>
            <div
              className={classes.linkWrapper}
              style={{ justifyContent, marginRight }}
            >
              <Link
                className={classes.link}
                label={routes.HOME.label}
                style={{ color }}
                url={routes.HOME.route}
              />
              <Link
                className={classes.link}
                label={routes.EXERCISES.label}
                style={{ color }}
                url={routes.EXERCISES.route}
              />
              <Link
                className={classes.link}
                label={routes.ACTIVITY.label}
                style={{ color }}
                url={routes.ACTIVITY.route}
              />
            </div>
            {this.renderProfileMenu()}
          </Toolbar>
        </AppBar>
        {children}
      </div>
    );
  }

  renderMobile() {
    const { children, classes } = this.props;
    return (
      <div>
        <div className={classes.mobileProfileWrapper}>
          {this.renderProfileMenu()}
        </div>
        {children}
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
      </div>
    );
  }

  render() {
    const { width } = this.props;
    return (
      <div>{isMobile(width) ? this.renderMobile() : this.renderDesktop()}</div>
    );
  }
}

export const styled = withStyles(styles, { withTheme: true })(
  withWidth()(Navigation)
);
export default withRouter(styled);
