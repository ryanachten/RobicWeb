import * as React from "react";
import { compose, graphql } from "react-apollo";
import { RouteChildrenProps } from "react-router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { LoginUser } from "../constants/mutations";
import { Divider } from "@material-ui/core";
import routes from "../constants/routes";
import Link from "../components/Link";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginTop: theme.spacing.unit
    },
    form: {
      display: "flex",
      flexFlow: "row wrap"
    },
    header: {
      marginBottom: theme.spacing.unit * 2
    },
    input: {
      margin: theme.spacing.unit
    },
    root: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "center"
    },
    submitWrapper: {
      width: "100%"
    }
  });

type State = {
  email: string;
  password: string;
  error: Error | null;
};

type Props = RouteChildrenProps & {
  classes: Classes;
  mutate: any;
};

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null
    };
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "email" | "password", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      return this.setState({
        error: new Error("Email and password must be provided")
      });
    }
    // Executes the login mutation with the following query parameters
    try {
      const loginResponse = await this.props.mutate({
        variables: {
          email,
          password
        }
      });
      const token = loginResponse.data.loginUser;
      if (token) {
        window.localStorage.setItem("token", token);
        /* Workaround: Not sure how to set the auth token on the Apollo client
          after it has been instantiated */
        location.reload();
      }
    } catch (error) {
      this.setState({
        error
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { email, error, password } = this.state;
    return (
      <div className={classes.root}>
        <form onSubmit={this.submitForm}>
          <Typography className={classes.header} variant="h1">
            Login
          </Typography>
          <TextField
            label="Email"
            className={classes.input}
            onChange={event => this.onFieldUpdate("email", event.target.value)}
            value={email}
          />
          <TextField
            label="Password"
            type="password"
            className={classes.input}
            onChange={event =>
              this.onFieldUpdate("password", event.target.value)
            }
            value={password}
          />
          <div className="submitWrapper">
            <Button type="submit">Submit</Button>
          </div>
          {error && (
            <Typography className={classes.error} color="error">
              {error.message}
            </Typography>
          )}
        </form>
        <Divider />
        <Typography>Don't have an account?</Typography>
        <Link label={routes.REGISTER.label} url={routes.REGISTER.route} />
      </div>
    );
  }
}

export default compose(graphql(LoginUser))(withStyles(styles)(Login));
