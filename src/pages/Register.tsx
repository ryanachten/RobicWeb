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
import { LoginUser, RegisterUser } from "../constants/mutations";
import routes from "../constants/routes";
import { Link, ErrorMessage, RobicLogo, PageTitle } from "../components";
import { LIGHT_GRADIENT } from "../constants/colors";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main
    },
    error: {
      marginTop: theme.spacing(1)
    },
    form: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-around",
      maxWidth: "500px"
    },
    input: {
      margin: theme.spacing(1),
      flexGrow: 1
    },
    link: {
      "&:hover": {
        borderColor: theme.palette.primary.main
      }
    },
    root: {
      alignItems: "center",
      background: LIGHT_GRADIENT,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      justifyContent: "center",
      padding: theme.spacing(4)
    },
    submitWrapper: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
      textAlign: "center",
      width: "100%"
    }
  });

type State = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error?: Error;
};

type Props = RouteChildrenProps & {
  classes: Classes;
  register: any;
  login: any;
};

class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    };
    this.submitForm = this.submitForm.bind(this);
  }

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
    try {
      await this.props.register({
        variables: {
          email,
          password,
          firstName,
          lastName
        }
      });
      const loginResponse = await this.props.login({
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
        window.location.reload();
      }
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
        <RobicLogo size="large" />
        <PageTitle>Sign up to get going!</PageTitle>
        <form className={classes.form} onSubmit={this.submitForm}>
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
          <div className={classes.submitWrapper}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
            >
              Sign Up
            </Button>
          </div>
          <ErrorMessage error={error} className={classes.error} />
        </form>
        <Typography>Already have an account?</Typography>
        <Link
          innerLinkClasses={classes.link}
          label={routes.LOGIN.label}
          url={routes.LOGIN.route}
        />
      </div>
    );
  }
}

export default compose(
  graphql(RegisterUser, { name: "register" }),
  graphql(LoginUser, { name: "login" })
)(withStyles(styles)(Register));
