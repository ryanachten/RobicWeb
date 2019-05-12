import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CreateIcon from "@material-ui/icons/Create";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none"
    }
  });

type MenuLink = {
  icon: string;
  url: string;
  text: string;
};

type Props = {
  classes: Classes;
};

type State = {
  drawerOpen: boolean;
};

class Header extends React.Component<WithStyles<typeof styles>, State> {
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

  renderMenuIcon(icon: string) {
    if (icon === "home") {
      return <HomeIcon />;
    }
    if (icon === "create") {
      return <CreateIcon />;
    }
    if (icon === "history") {
      return <HistoryIcon />;
    }
    return <FitnessCenterIcon />;
  }

  renderLink(link: MenuLink) {
    const { icon, text, url } = link;
    return (
      <Link
        key={url}
        to={url}
        onClick={this.toggleMenu}
        className={this.props.classes.link}
      >
        <ListItem button>
          <ListItemIcon>{this.renderMenuIcon(icon)}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </Link>
    );
  }

  render() {
    const { drawerOpen } = this.state;
    const { classes } = this.props;

    const links = [
      { url: "/", text: "Home", icon: "home" },
      { url: "/history/", text: "History", icon: "history" },
      { url: "/exercises/", text: "Exercises", icon: "fitness" },
      { url: "/exercises/new/", text: "Create Exercise", icon: "create" }
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
        <Drawer anchor="left" open={drawerOpen} onClose={this.toggleMenu}>
          <List>{links.map(link => this.renderLink(link))}</List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
