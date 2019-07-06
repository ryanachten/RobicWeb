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
import { Unit, ExerciseDefinition, MuscleGroup } from "../../constants/types";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 2
    },
    muscleSelect: {
      marginRight: theme.spacing.unit * 2,
      minWidth: "200px"
    },
    submitWrapper: {
      marginTop: theme.spacing.unit * 2,
      width: "100%"
    },
    titleInput: {
      marginRight: theme.spacing.unit * 2
    },
    unitSelect: {
      marginRight: theme.spacing.unit * 2
    }
  });

export type State = {
  title: string;
  unit: string;
  error: string;
  primaryMuscle: MuscleGroup | "";
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
      unit: exercise ? exercise.unit : "",
      primaryMuscle: ""
    };
    this.renderMuscleOptions = this.renderMuscleOptions.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "primaryMuscle" | "title" | "unit", value: string) {
    const state: any = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  renderMuscleOptions() {
    const { primaryMuscle } = this.state;
    const { classes } = this.props;
    const muscles = Object.keys(MuscleGroup).map((key: any) => ({
      id: MuscleGroup[key],
      value: MuscleGroup[key],
      label: MuscleGroup[key]
    }));
    return (
      <Select
        className={classes.muscleSelect}
        label="Primary Muscle Group"
        onChange={event =>
          this.onFieldUpdate("primaryMuscle", event.target.value)
        }
        options={muscles.map(muscle => ({
          id: muscle.value,
          label: muscle.label,
          value: muscle.value
        }))}
        value={primaryMuscle}
      />
    );
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
          className={classes.unitSelect}
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
        {this.renderMuscleOptions()}
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
