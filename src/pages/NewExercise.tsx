import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExerciseById } from "../constants/queries";
import { Unit } from "../constants/types";
import {
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@material-ui/core";
import PageTitle from "../components/PageTitle";
import routes from "../constants/routes";
import Select from "../components/inputs/Select";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 4
    },
    submitWrapper: {
      width: "100%"
    }
  });

type State = {
  title: string;
  unit: string;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
};

class NewExercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: "",
      unit: ""
    };
  }

  onFieldUpdate(field: "title" | "unit", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { title, unit } = this.state;
    console.log("title, unit", title, unit);
  }

  render() {
    const { classes, data } = this.props;
    const { title, unit } = this.state;
    console.log("this.props", this.props);
    const { exercise, loading } = data;
    console.log("exercise", exercise);
    return (
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Fragment>
            <PageTitle label={routes.NEW_EXERCISE.label} />
            <form onSubmit={this.submitForm}>
              <TextField
                label="Title"
                placeholder="Exercise title"
                className={classes.input}
                onChange={event =>
                  this.onFieldUpdate("title", event.target.value)
                }
                value={title}
              />
              <Select
                label="Unit"
                className={classes.formControl}
                onChange={event =>
                  this.onFieldUpdate("unit", event.target.value)
                }
                options={[
                  {
                    id: Unit.kg,
                    value: Unit.kg,
                    label: Unit.kg
                  }
                ]}
                value={unit}
              />
              <div className="submitWrapper">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Fragment>
        )}
      </div>
    );
  }
}

export default compose(
  graphql(GetExerciseById, {
    options: (props: any) => ({
      variables: { exerciseId: props.match.params.id }
    })
  })
)(withStyles(styles)(NewExercise));
