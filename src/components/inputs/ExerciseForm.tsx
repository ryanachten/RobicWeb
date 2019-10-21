import React, { Fragment } from "react";
import {
  Button,
  TextField,
  Typography,
  withStyles,
  createStyles,
  Theme,
  CircularProgress,
  Switch
} from "@material-ui/core";
import { Classes } from "jss";
import { Select } from "./Select";
import {
  Unit,
  ExerciseDefinition,
  MuscleGroup,
  ExerciseType
} from "../../constants/types";
import { FullBody } from "../muscles/FullBody";
import { compose, graphql } from "react-apollo";
import { GetExercises } from "../../constants/queries";
import { MultiSelect } from "./MultiSelect";
import { isCompositeExercise, getChildExerciseMuscles } from "../../utils";

const styles = (theme: Theme) =>
  createStyles({
    error: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    form: {
      display: "flex",
      flexFlow: "column"
    },
    input: {
      margin: theme.spacing(1)
    },
    loadingWrappper: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      margin: theme.spacing(2)
    },
    muscleSelectWrapper: {
      margin: theme.spacing(1)
    },
    submitButton: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main
    },
    submitWrapper: {
      marginTop: theme.spacing(2),
      textAlign: "center",
      width: "100%"
    },
    switchWrapper: {
      display: "flex",
      flexFlow: "row wrap",
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1)
    }
  });

export type State = {
  childExerciseIds: string[];
  error: string;
  primaryMuscleGroup: MuscleGroup[];
  title: string;
  type: ExerciseType;
  unit?: string;
};

type Props = {
  classes: Classes;
  data: any;
  exerciseDefinition?: ExerciseDefinition;
  onSubmit: (state: State) => void;
};

class ExerciseForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const exercise = props.exerciseDefinition;
    this.state = {
      childExerciseIds:
        exercise && exercise.childExercises
          ? exercise.childExercises.map(exercise => exercise.id)
          : [],
      error: "",
      title: exercise ? exercise.title : "",
      type: exercise
        ? exercise.type || ExerciseType.STANDARD
        : ExerciseType.STANDARD,
      unit: exercise ? exercise.unit : "",
      primaryMuscleGroup: exercise ? exercise.primaryMuscleGroup : []
    };
    this.onToggleMuscleGroup = this.onToggleMuscleGroup.bind(this);
    this.renderMuscleOptions = this.renderMuscleOptions.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "title" | "type" | "unit", value: string) {
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

  onToggleExercise(exerciseId: string, active: boolean) {
    const exercises = active
      ? [...this.state.childExerciseIds, exerciseId]
      : this.state.childExerciseIds.filter(id => id !== exerciseId);
    this.setState({ childExerciseIds: exercises });
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    const {
      title,
      unit,
      primaryMuscleGroup,
      type,
      childExerciseIds
    } = this.state;
    if (
      !title ||
      // Prevent creating standard exercise w/o unit or PMG
      (!isCompositeExercise(type) && (!unit || !primaryMuscleGroup))
    ) {
      return this.setState({
        error: "Please complete title, unit and primary muscle group fields"
      });
    }
    // Prevent creating composite exercise w/o child exercises
    if (isCompositeExercise(type) && childExerciseIds.length < 2) {
      return this.setState({
        error: "Please add at least 2 exercises"
      });
    }

    this.props.onSubmit(this.state);
  }

  renderExerciseOptions() {
    const { classes, data } = this.props;
    const { exerciseDefinitions } = data;
    const childExerciseIds = this.state.childExerciseIds;

    // Don't allow nesting of composite exercises
    const exercises = exerciseDefinitions.reduce(
      (total: any[], exercise: ExerciseDefinition) => {
        return isCompositeExercise(exercise.type)
          ? [...total]
          : [
              ...total,
              {
                checked: childExerciseIds.includes(exercise.id),
                value: exercise.id,
                label: exercise.title
              }
            ];
      },
      []
    );
    return (
      <MultiSelect
        className={classes.muscleSelectWrapper}
        label="Exercises"
        options={exercises}
        onChange={(value: any, checked: boolean) =>
          this.onToggleExercise(value, checked)
        }
      />
    );
  }

  renderMuscleOptions() {
    const { primaryMuscleGroup } = this.state;
    const { classes } = this.props;
    const muscles = Object.keys(MuscleGroup)
      .sort()
      .map((key: any) => ({
        checked: primaryMuscleGroup.includes(MuscleGroup[key] as any),
        value: MuscleGroup[key],
        label: MuscleGroup[key]
      }));
    return (
      <MultiSelect
        className={classes.muscleSelectWrapper}
        label="Primary Muscle Groups"
        options={muscles}
        onChange={(value: any, checked: boolean) =>
          this.onToggleMuscleGroup(value, checked)
        }
      />
    );
  }

  render() {
    const { classes, data } = this.props;
    const {
      childExerciseIds,
      error,
      primaryMuscleGroup,
      title,
      type,
      unit
    } = this.state;
    const { exerciseDefinitions, loading } = data;
    // Get muscles based on child exercises if applicable
    const childExercises =
      exerciseDefinitions &&
      exerciseDefinitions.filter((e: ExerciseDefinition) =>
        childExerciseIds.includes(e.id)
      );
    const muscles: MuscleGroup[] = isCompositeExercise(type)
      ? childExercises
        ? getChildExerciseMuscles(childExercises)
        : []
      : primaryMuscleGroup;
    return (
      <form className={classes.form} onSubmit={this.submitForm}>
        <TextField
          label="Title"
          placeholder="Exercise title"
          className={classes.input}
          onChange={event => this.onFieldUpdate("title", event.target.value)}
          value={title}
        />
        <div className={classes.switchWrapper}>
          {Object.keys(ExerciseType).map((key: any) => {
            const _type = ExerciseType[key];
            if (_type === ExerciseType.STANDARD) {
              return;
            }
            return (
              <div key={_type}>
                <label>{_type}</label>
                <Switch
                  checked={type === _type}
                  onChange={event =>
                    this.onFieldUpdate("type", event.target.value)
                  }
                  value={type === _type ? ExerciseType.STANDARD : _type}
                />
              </div>
            );
          })}
        </div>
        {/* Don't show unit and PMG fields for types where these are
            made up of other exercises  */}
        {!isCompositeExercise(type) && (
          <Fragment>
            <Select
              label="Unit"
              className={classes.input}
              onChange={event => this.onFieldUpdate("unit", event.target.value)}
              options={Object.keys(Unit)
                .sort()
                .map((key: any) => ({
                  id: Unit[key],
                  label: Unit[key],
                  value: Unit[key]
                }))}
              value={unit}
            />
            {loading ? (
              <div className={classes.loadingWrappper}>
                <CircularProgress />
              </div>
            ) : (
              this.renderMuscleOptions()
            )}
          </Fragment>
        )}
        {isCompositeExercise(type) &&
          exerciseDefinitions &&
          this.renderExerciseOptions()}
        {error && (
          <Typography className={classes.error} color="error">
            {error}
          </Typography>
        )}
        <div className={classes.submitWrapper}>
          <Button
            className={classes.submitButton}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </div>
        {muscles && <FullBody selected={muscles} />}
      </form>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(ExerciseForm));
