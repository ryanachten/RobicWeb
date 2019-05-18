import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import gql from "graphql-tag";
import {
  compose,
  graphql,
  ChildProps,
  Mutation,
  ChildDataProps
} from "react-apollo";

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
  error: Error | null;
};

type Props = {
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
      //  TODO: provide proper validation and feedback
      return null;
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
      console.log("token", token);
      if (token) {
        await window.localStorage.setItemAsync("token", token);
        console.log("token", token);
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
          {error && <Typography color="error">{error.message}</Typography>}
        </form>
      </div>
    );
  }
}

const mutation = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

const query = gql`
  {
    currentUser {
      id
      email
      firstName
      lastName
    }
  }
`;

export default compose(
  graphql(mutation),
  graphql(query)
)(withStyles(styles)(Login));
