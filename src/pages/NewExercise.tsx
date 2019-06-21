import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { AddExerciseDefinition } from "../constants/mutations";
import { Unit } from "../constants/types";
import { Button, TextField, Typography } from "@material-ui/core";
import PageTitle from "../components/PageTitle";
import routes from "../constants/routes";
import Select from "../components/inputs/Select";
import { GetExercises } from "../constants/queries";
import PageRoot from "../components/PageRoot";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 2
    },
    submitWrapper: {
      width: "100%"
    }
  });

type State = {
  title: string;
  unit: string;
  error: string;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
  mutate: any;
};

class NewExercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: "",
      unit: "",
      error: ""
    };
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "title" | "unit", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { title, unit } = this.state;
    if (!title || !unit) {
      return this.setState({
        error: "Please complete title and unit fields"
      });
    }
    try {
      await this.props.mutate({
        variables: {
          title,
          unit
        },
        refetchQueries: [{ query: GetExercises }]
      });
      this.props.history.push(routes.EXERCISES.route);
    } catch (error) {
      return this.setState({
        error
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { error, title, unit } = this.state;
    return (
      <PageRoot>
        <PageTitle label={routes.NEW_EXERCISE.label} />
        <form onSubmit={this.submitForm}>
          <TextField
            label="Title"
            placeholder="Exercise title"
            className={classes.input}
            onChange={event => this.onFieldUpdate("title", event.target.value)}
            value={title}
          />
          <Select
            label="Unit"
            className={classes.formControl}
            onChange={event => this.onFieldUpdate("unit", event.target.value)}
            options={[
              {
                id: Unit.kg,
                value: Unit.kg,
                label: Unit.kg
              }
            ]}
            value={unit}
          />
          {error && (
            <Typography className={classes.error} color="error">
              {error}
            </Typography>
          )}
          <div className="submitWrapper">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PageRoot>
    );
  }
}

export default compose(graphql(AddExerciseDefinition))(
  withStyles(styles)(NewExercise)
);
