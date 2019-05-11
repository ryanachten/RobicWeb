import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import Toolbar from "@material-ui/core/Toolbar";
import { Classes } from "jss";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const styles = (theme: Theme) => createStyles({});

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

  render() {
    const { drawerOpen } = this.state;
    return (
      <div>
        <AppBar>
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
          <List>
            <MenuLink url="/" text="Home" onClick={this.toggleMenu} />
            <MenuLink url="/test/" text="Test" onClick={this.toggleMenu} />
          </List>
        </Drawer>
      </div>
    );
  }
}

type MenuProps = {
  url: string;
  text: string;
  onClick: () => void;
};

const MenuLink = (props: MenuProps) => {
  const { url, text, onClick } = props;
  return (
    <Link to={url} onClick={onClick}>
      <ListItem button>
        <ListItemIcon>
          <MailIcon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </Link>
  );
};

export default withStyles(styles)(Header);
