import React from "react";
import {
  Button,
  TextField,
  Typography,
  withStyles,
  createStyles,
  Theme
} from "@material-ui/core";
import { Classes } from "jss";
import { Select } from "./Select";
import { Unit, ExerciseDefinition } from "../../constants/types";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 2
    },
    submitWrapper: {
      marginTop: theme.spacing.unit * 2,
      width: "100%"
    },
    titleInput: {
      marginRight: theme.spacing.unit * 2
    }
  });

export type State = {
  title: string;
  unit: string;
  error: string;
};

type Props = {
  classes: Classes;
  exerciseDefinition?: ExerciseDefinition;
  onSubmit: (state: State) => void;
};

class ExerciseForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const exercise = props.exerciseDefinition;
    this.state = {
      error: "",
      title: exercise ? exercise.title : "",
      unit: exercise ? exercise.unit : ""
    };
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "title" | "unit", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    const { classes } = this.props;
    const { error, title, unit } = this.state;
    return (
      <form onSubmit={this.submitForm}>
        <TextField
          label="Title"
          placeholder="Exercise title"
          className={classes.titleInput}
          onChange={event => this.onFieldUpdate("title", event.target.value)}
          value={title}
        />
        <Select
          label="Unit"
          onChange={event => this.onFieldUpdate("unit", event.target.value)}
          options={[
            {
              id: Unit.kg,
              value: Unit.kg,
              label: Unit.kg
            },
            {
              id: Unit.min,
              value: Unit.min,
              label: Unit.min
            }
          ]}
          value={unit}
        />
        {error && (
          <Typography className={classes.error} color="error">
            {error}
          </Typography>
        )}
        <div className={classes.submitWrapper}>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    );
  }
}

export default withStyles(styles)(ExerciseForm);
