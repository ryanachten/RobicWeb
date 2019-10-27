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
import { Link, ErrorMessage, PageTitle, RobicLogo } from "../components";
import { LIGHT_GRADIENT } from "../constants/colors";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main
    },
    divider: {
      marginBottom: theme.spacing(2),
      width: "100%"
    },
    error: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1)
    },
    form: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center"
    },
    header: {
      marginBottom: theme.spacing(2),
      [theme.breakpoints.only("xs")]: {
        wordBreak: "break-all"
      }
    },
    input: {
      margin: theme.spacing(1),
      flexGrow: 1
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
  email: string;
  password: string;
  error?: Error;
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
      password: ""
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
    const { email, error, password } = this.state;
    return (
      <div className={classes.root}>
        <RobicLogo size="large" />
        <PageTitle>Login and get going!</PageTitle>
        <form className={classes.form} onSubmit={this.submitForm}>
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
              Sign In
            </Button>
          </div>
          <ErrorMessage error={error} className={classes.error} />
          <Divider className={classes.divider} />
        </form>
        <Typography>Don't have an account?</Typography>
        <Link label={routes.REGISTER.label} url={routes.REGISTER.route} />
      </div>
    );
  }
}

export default compose(graphql(LoginUser))(withStyles(styles)(Login));
