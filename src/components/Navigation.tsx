import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import MuiLink from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import routes from "../constants/routes";
import {
  withWidth,
  BottomNavigation,
  BottomNavigationAction,
  Typography
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { withRouter, RouteComponentProps } from "react-router";

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
    console.log("this.props", this.props);

    const history = this.props.history;
    history && this.props.history.push(route);
  }

  renderLink(link: MenuLink) {
    const { text, url } = link;
    return (
      <Link key={url} to={url} className={this.props.classes.link}>
        <MuiLink color="inherit" component="span" variant="body1">
          {text}
        </MuiLink>
      </Link>
    );
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
              {this.renderLink({
                url: routes.HOME.route,
                text: routes.HOME.label
              })}
              {this.renderLink({
                url: routes.EXERCISES.route,
                text: routes.EXERCISES.label
              })}
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
