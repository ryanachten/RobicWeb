import React from "react";
import {
  Button,
  TextField,
  Typography,
  withStyles,
  createStyles,
  Theme,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { Classes } from "jss";
import { Select } from "./Select";
import { Unit, ExerciseDefinition, MuscleGroup } from "../../constants/types";
import { FullBody } from "../muscles/FullBody";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 2
    },
    muscleSelect: {
      maxHeight: "200px",
      overflowY: "auto"
    },
    muscleSelectWrapper: {
      margin: theme.spacing.unit
    },
    submitWrapper: {
      marginTop: theme.spacing.unit * 2,
      width: "100%"
    },
    titleInput: {
      margin: theme.spacing.unit
    },
    unitSelect: {
      margin: theme.spacing.unit
    }
  });

export type State = {
  title: string;
  unit: string;
  error: string;
  primaryMuscleGroup: MuscleGroup[];
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
      primaryMuscleGroup: exercise ? exercise.primaryMuscleGroup : []
    };
    this.onToggleMuscleGroup = this.onToggleMuscleGroup.bind(this);
    this.renderMuscleOptions = this.renderMuscleOptions.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "title" | "unit", value: string) {
    const state: any = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  onToggleMuscleGroup(muscleGroup: MuscleGroup, active: boolean) {
    const muscleGroups = active
      ? [...this.state.primaryMuscleGroup, muscleGroup]
      : this.state.primaryMuscleGroup.filter(mg => mg !== muscleGroup);
    this.setState({ primaryMuscleGroup: muscleGroups });
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  renderMuscleOptions() {
    const { primaryMuscleGroup } = this.state;
    const { classes } = this.props;
    const muscles = Object.keys(MuscleGroup)
      .sort()
      .map((key: any) => ({
        id: MuscleGroup[key],
        value: MuscleGroup[key],
        label: MuscleGroup[key]
      }));
    return (
      <FormControl className={classes.muscleSelectWrapper}>
        <Typography color="textSecondary" variant="caption">
          Primary Muscle Groups
        </Typography>
        <div className={classes.muscleSelect}>
          <FormGroup>
            {muscles.map(muscle => (
              <FormControlLabel
                key={muscle.value}
                control={
                  <Checkbox
                    color="primary"
                    checked={primaryMuscleGroup.includes(muscle.value as any)}
                    onChange={(e: any, checked: boolean) =>
                      this.onToggleMuscleGroup(e.target.value, checked)
                    }
                    value={muscle.value}
                  />
                }
                label={muscle.label}
              />
            ))}
          </FormGroup>
        </div>
      </FormControl>
    );
  }

  render() {
    const { classes } = this.props;
    const { error, primaryMuscleGroup, title, unit } = this.state;
    console.log("primaryMuscleGroup", primaryMuscleGroup);
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
        {primaryMuscleGroup && <FullBody selected={primaryMuscleGroup} />}
      </form>
    );
  }
}

export default withStyles(styles)(ExerciseForm);
