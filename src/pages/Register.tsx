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
import { RegisterUser } from "../constants/mutations";
import { Divider } from "@material-ui/core";
import routes from "../constants/routes";

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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: Error | null;
};

type Props = RouteChildrenProps & {
  classes: Classes;
  mutate: any;
};

class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      error: null
    };
    this.submitForm = this.submitForm.bind(this);
  }

  navigateToLogin = () => {
    this.props.history.push(routes.LOGIN.route);
  };

  onFieldUpdate(
    field: "firstName" | "lastName" | "email" | "password",
    value: string
  ) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { firstName, lastName, email, password } = this.state;
    if (!email || !password || !firstName || !lastName) {
      return this.setState({
        error: new Error("All fields must be completed")
      });
    }
    // Executes the login mutation with the following query parameters
    try {
      const registrationResponse = await this.props.mutate({
        variables: {
          email,
          password,
          firstName,
          lastName
        }
      });
      console.log("registrationResponse", registrationResponse);
      // const token = loginResponse.data.loginUser;
      // if (token) {
      //   window.localStorage.setItem("token", token);
      //   /* Workaround: Not sure how to set the auth token on the Apollo client
      //     after it has been instantiated */
      //   location.reload();
      // }
    } catch (error) {
      this.setState({
        error
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { firstName, lastName, email, error, password } = this.state;
    return (
      <div className={classes.root}>
        <form onSubmit={this.submitForm}>
          <Typography className={classes.header} variant="h1">
            Register
          </Typography>
          <TextField
            label="First Name"
            className={classes.input}
            onChange={event =>
              this.onFieldUpdate("firstName", event.target.value)
            }
            value={firstName}
          />
          <TextField
            label="Last Name"
            className={classes.input}
            onChange={event =>
              this.onFieldUpdate("lastName", event.target.value)
            }
            value={lastName}
          />
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
        <Typography>Already have an account?</Typography>
        <Typography variant="body1" onClick={this.navigateToLogin}>
          Login
        </Typography>
      </div>
    );
  }
}

export default compose(graphql(RegisterUser))(withStyles(styles)(Register));
