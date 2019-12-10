import React, { SyntheticEvent, Fragment } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ProfileIcon from "@material-ui/icons/MoreVert";
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
import { PURPLE_GRADIENT, LIGHT_GRADIENT } from "../../constants/colors";
import classnames from "../../utils";
import { ActionPanel, ActionPanelProps } from "../page/ActionPanel";
import { ErrorMessage } from "../page/ErrorMessage";
import { LoadingSplash } from "../page/LoadingSplash";
import theme from "../../theme";

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
    linkActive: {
      fontWeight: "bold"
    },
    linkWrapper: {
      borderBottom: `1px solid ${theme.palette.common.white}`,
      display: "flex",
      justifyContent: "center",
      margin: `${theme.spacing(4)}px auto`
    },
    mobileProfileWrapper: {
      right: 0,
      top: 0,
      zIndex: 100
    },
    profileButton: {
      position: "absolute",
      right: theme.spacing(1),
      zIndex: 100
    },
    purpleBackground: {
      backgroundImage: PURPLE_GRADIENT,
      height: "100%",
      minHeight: "100vh"
    },
    secondaryContent: {
      background: LIGHT_GRADIENT,
      borderRadius: `0px 0px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
      maxWidth: theme.breakpoints.values.sm,
      margin: "0 auto",
      marginBottom: theme.spacing(4),
      padding: theme.spacing(2),
      position: "relative",
      top: "-4px",

      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4)
      }
    },
    toolbar: {
      background: "transparent"
    }
  });

type Props = RouteComponentProps & {
  actionPanel?: ActionPanelProps;
  children?: any;
  classes: Classes;
  containerWidth?: Breakpoint;
  error?: Error; // hook up via GraphQL result.error prop
  loading: boolean;
  theme: Theme;
  width: Breakpoint;
};

type State = {
  anchorEl: any;
};

class PageRoot extends React.Component<Props, State> {
  activeLinkClasses: (route: string) => string;

  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.navigateToRoute = this.navigateToRoute.bind(this);
    this.renderActionPanel = this.renderActionPanel.bind(this);
    this.renderDesktop = this.renderDesktop.bind(this);
    this.renderNavLinks = this.renderNavLinks.bind(this);
    this.renderProfileMenu = this.renderProfileMenu.bind(this);
    this.activeLinkClasses = (route: string) => {
      return route === props.location.pathname ? props.classes.linkActive : "";
    };
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

  onCloseMenu() {
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
          <ProfileIcon color="primary" fontSize="large" />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.onCloseMenu}
        >
          <MenuItem onClick={this.onLogout}>Logout</MenuItem>
        </Menu>
      </Fragment>
    );
  }

  renderActionPanel() {
    const { actionPanel, containerWidth } = this.props;
    return <ActionPanel {...actionPanel} containerWidth={containerWidth} />;
  }

  renderNavLinks() {
    const { classes } = this.props;
    return (
      <div className={classes.linkWrapper}>
        <Link
          className={classes.link}
          innerLinkClasses={this.activeLinkClasses(routes.HOME.route)}
          label={routes.HOME.label}
          url={routes.HOME.route}
        />
        <Link
          className={classes.link}
          innerLinkClasses={this.activeLinkClasses(routes.EXERCISES.route)}
          label={routes.EXERCISES.label}
          url={routes.EXERCISES.route}
        />
        <Link
          className={classes.link}
          innerLinkClasses={this.activeLinkClasses(routes.ACTIVITY.route)}
          label={routes.ACTIVITY.label}
          url={routes.ACTIVITY.route}
        />
      </div>
    );
  }

  renderDesktop() {
    const { children, classes, containerWidth } = this.props;
    return (
      <PurpleBackground>
        <AppBar className={classes.appBar} color="inherit" position="static">
          <Toolbar className={classes.toolbar}>
            {this.renderNavLinks()}
            {this.renderProfileMenu()}
          </Toolbar>
        </AppBar>
        {this.renderActionPanel()}
        {children && (
          <div
            className={classes.secondaryContent}
            style={{
              maxWidth:
                containerWidth && theme.breakpoints.values[containerWidth]
            }}
          >
            {children}
          </div>
        )}
      </PurpleBackground>
    );
  }

  renderMobile() {
    const { children, classes } = this.props;
    return (
      <PurpleBackground>
        <div className={classes.contentWrapper}>
          <div className={classes.mobileProfileWrapper}>
            {this.renderProfileMenu()}
          </div>
          {this.renderActionPanel()}
        </div>
        {children && <div className={classes.secondaryContent}>{children}</div>}
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
