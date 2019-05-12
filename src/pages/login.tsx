import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";

const styles = (theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexFlow: "row wrap"
    },
    input: {
      margin: 10
    },
    root: {
      padding: 20
    },
    submitWrapper: {
      width: "100%"
    }
  });

type State = {
  email: string;
  password: string;
};

type Props = {
  classes: Classes;
};

class Index extends React.Component<WithStyles<typeof styles>, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "email" | "password", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = this.state;
    console.log("email, password", email, password);
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <div className={classes.root}>
        <form onSubmit={this.submitForm}>
          <TextField
            label="Email"
            className={classes.input}
            onChange={event => this.onFieldUpdate("email", event.target.value)}
            value={email}
          />
          <TextField
            label="Password"
            className={classes.input}
            onChange={event =>
              this.onFieldUpdate("password", event.target.value)
            }
            value={password}
          />
          <div className="submitWrapper">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Index);
