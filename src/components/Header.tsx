import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { transparentize } from "../utils";
import routes from "../constants/routes";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none"
    },
    background: {
      backgroundColor: transparentize(theme.palette.common.white, 0.5)
    }
  });

type MenuLink = {
  url: string;
  text: string;
};

type Props = {
  classes: Classes;
};

type State = {
  drawerOpen: boolean;
};

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  renderLink(link: MenuLink) {
    const { text, url } = link;
    return (
      <Link
        key={url}
        to={url}
        onClick={this.toggleMenu}
        className={this.props.classes.link}
      >
        <ListItem button>
          <ListItemText primary={text} />
        </ListItem>
      </Link>
    );
  }

  render() {
    const { drawerOpen } = this.state;
    const { classes } = this.props;

    const links: MenuLink[] = [
      { url: routes.HOME.route, text: routes.HOME.label },
      {
        url: routes.HISTORY.route,
        text: routes.HISTORY.label
      },
      { url: routes.EXERCISES.route, text: routes.EXERCISES.label },
      {
        url: routes.NEW_EXERCISE.route,
        text: routes.NEW_EXERCISE.label
      }
    ];

    return (
      <div>
        <AppBar color="inherit" position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleMenu}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={this.toggleMenu}
          ModalProps={{
            BackdropProps: {
              classes: {
                root: classes.background
              }
            }
          }}
        >
          <List>{links.map(link => this.renderLink(link))}</List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
