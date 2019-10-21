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
  IconButton
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import routes from "../../constants/routes";
import { Link } from "../../components/Link";
import { isMobile } from "../../constants/sizes";
import { LOGO_FONT } from "../../constants/fonts";
import { PURPLE_GRADIENT } from "../../constants/colors";
import classnames from "../../utils";
import { ActionPanel, ActionPanelProps } from "../page/ActionPanel";
import { ErrorMessage } from "../page/ErrorMessage";
import { LoadingSplash } from "../page/LoadingSplash";

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
    contentWrapper: {
      padding: theme.spacing(2)
    },
    error: {
      marginTop: theme.spacing(4)
    },
    link: {
      color: theme.palette.common.white,
      margin: theme.spacing(2)
    },
    linkWrapper: {
      display: "flex",
      flexGrow: 1,
      justifyContent: "center"
    },
    linkWrapperSidebar: {
      flexFlow: "column"
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
    purpleBackground: {
      backgroundImage: PURPLE_GRADIENT,
      height: "100%",
      minHeight: "100vh"
    },
    robicLogo: {
      fontFamily: LOGO_FONT
    },
    sidebar: {
      minWidth: "320px",
      padding: theme.spacing(4),
      height: "unset"
    },
    sidebarContent: {
      maxWidth: "255px",
      position: "fixed"
    },
    sidebarMain: {
      padding: theme.spacing(4)
    },
    sidebarWrapper: {
      display: "flex"
    },
    toolbar: {
      background: "transparent"
    }
  });

export enum BackgroundMode {
  purple,
  light
}

type Props = RouteComponentProps & {
  actionPanel?: ActionPanelProps;
  backgroundMode?: BackgroundMode;
  children?: any;
  classes: Classes;
  error?: Error; // hook up via GraphQL result.error prop
  loading: boolean;
  theme: Theme;
  width: Breakpoint;
};

type State = {
  anchorEl: any;
};

class PageRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.navigateToRoute = this.navigateToRoute.bind(this);
    this.renderActionPanel = this.renderActionPanel.bind(this);
    this.renderColumnDesktop = this.renderColumnDesktop.bind(this);
    this.renderSidebarDesktop = this.renderSidebarDesktop.bind(this);
    this.renderLightMobile = this.renderLightMobile.bind(this);
    this.renderDarkMobile = this.renderDarkMobile.bind(this);
    this.renderDesktop = this.renderDesktop.bind(this);
    this.renderNavLinks = this.renderNavLinks.bind(this);
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

  renderActionPanel() {
    const { actionPanel } = this.props;
    return <ActionPanel {...actionPanel} />;
  }

  renderNavLinks(additionalClasses?: { root: string }) {
    const classes = this.props.classes;
    return (
      <div
        className={classnames(
          classes.linkWrapper,
          additionalClasses && additionalClasses.root
        )}
      >
        <Link
          className={classes.link}
          label={routes.HOME.label}
          url={routes.HOME.route}
        />
        <Link
          className={classes.link}
          label={routes.EXERCISES.label}
          url={routes.EXERCISES.route}
        />
        <Link
          className={classes.link}
          label={routes.ACTIVITY.label}
          url={routes.ACTIVITY.route}
        />
      </div>
    );
  }

  renderSidebarDesktop() {
    const { children, classes } = this.props;
    return (
      <div className={classes.sidebarWrapper}>
        <PurpleBackground rootStyles={classes.sidebar}>
          <aside className={classes.sidebarContent}>
            {this.renderActionPanel()}
            {this.renderNavLinks({ root: classes.linkWrapperSidebar })}
          </aside>
        </PurpleBackground>
        <main className={classes.sidebarMain}>{children}</main>
      </div>
    );
  }

  renderColumnDesktop() {
    const { children, classes } = this.props;
    return (
      <PurpleBackground>
        <AppBar className={classes.appBar} color="inherit" position="static">
          <Toolbar className={classes.toolbar}>
            {this.renderNavLinks()}
            {this.renderProfileMenu()}
          </Toolbar>
        </AppBar>
        {this.renderActionPanel()}
        {children}
      </PurpleBackground>
    );
  }

  renderLightMobile() {
    const { children, classes } = this.props;
    return (
      <Fragment>
        <div className={classes.contentWrapper}>
          <div className={classes.mobileProfileWrapper}>
            {this.renderProfileMenu()}
          </div>
          {children}
        </div>
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
      </Fragment>
    );
  }

  renderDarkMobile() {
    const { children, classes } = this.props;
    return (
      <PurpleBackground>
        <div className={classes.contentWrapper}>
          <div className={classes.mobileProfileWrapper}>
            {this.renderProfileMenu()}
          </div>
          {this.renderActionPanel()}
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
      </PurpleBackground>
    );
  }

  renderDesktop() {
    const { backgroundMode } = this.props;
    const columnMode = backgroundMode === BackgroundMode.purple;
    return columnMode
      ? this.renderColumnDesktop()
      : this.renderSidebarDesktop();
  }

  renderMobile() {
    const { backgroundMode } = this.props;
    return backgroundMode === BackgroundMode.purple
      ? this.renderDarkMobile()
      : this.renderLightMobile();
  }

  render() {
    const { classes, error, loading, width } = this.props;
    return (
      <div>
        {loading ? (
          <LoadingSplash />
        ) : isMobile(width) ? (
          this.renderMobile()
        ) : (
          this.renderDesktop()
        )}
        <ErrorMessage className={classes.error} error={error} />
      </div>
    );
  }
}

type PurpleBackgroundProps = {
  children: any;
  classes: Classes;
  rootStyles?: string;
};

const PurpleBackground = withStyles(styles)(
  ({ classes, children, rootStyles }: PurpleBackgroundProps) => {
    return (
      <div className={classnames(classes.purpleBackground, rootStyles)}>
        {children}
      </div>
    );
  }
);

const styled = withStyles(styles, { withTheme: true })(withWidth()(PageRoot));
const routered = withRouter(styled);
export { routered as PageRoot };
