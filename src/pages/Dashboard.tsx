import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import PageTitle from "../components/PageTitle";
import Select from "../components/inputs/Select";
import { GetExercises } from "../constants/queries";
import { Classes } from "jss";
import { ExerciseDefinition } from "../constants/types";
import { Typography } from "@material-ui/core";
import routes from "../constants/routes";
import Stopwatch from "../components/Stopwatch";

const styles = (theme: Theme) =>
  createStyles({
    buttonWrapper: {
      alignItems: "center",
      display: "flex",
      marginLeft: theme.spacing.unit,
      marginTop: theme.spacing.unit * 2
    },
    exerciseTitle: {
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 4
    },
    form: {
      display: "flex",
      flexFlow: "row wrap"
    },
    formControl: {
      width: "150px"
    },
    input: {
      padding: theme.spacing.unit * 2
    },
    root: {
      padding: theme.spacing.unit * 4
    },
    selectTitle: {
      marginRight: theme.spacing.unit
    },
    selectWrapper: {
      alignItems: "baseline",
      display: "flex"
    },
    timerButton: {
      marginLeft: theme.spacing.unit * 2
    }
  });

type State = {
  selectedExercise: ExerciseDefinition | null;
  reps: string;
  sets: string;
  weight: string;
  timerRunning: boolean;
};

type Props = {
  classes: Classes;
  data: any;
  history: any;
};

class Index extends React.Component<Props, State> {
  stopwatch: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedExercise: null,
      reps: "",
      sets: "",
      weight: "",
      timerRunning: false
    };
    this.navigateToCreateExercise = this.navigateToCreateExercise.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  toggleTimer() {
    const timerRunning = this.state.timerRunning;
    timerRunning ? this.stopwatch.stop() : this.stopwatch.start();
    this.setState(prevState => ({
      timerRunning: !prevState.timerRunning
    }));
  }

  navigateToCreateExercise() {
    this.props.history.push(routes.NEW_EXERCISE.route);
  }

  onFieldUpdate(field: "sets" | "reps" | "weight", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { reps, sets, weight } = this.state;
    console.log("submit");
  }

  onSelectExercise = (e: any) => {
    const exerciseId = e.target.value;
    const exercise =
      this.props.data.exerciseDefinitions.find(
        (def: ExerciseDefinition) => def.id === exerciseId
      ) || null;
    this.setState({
      selectedExercise: exercise
    });
  };

  renderExerciseForm() {
    const { classes } = this.props;
    const { reps, selectedExercise, sets, timerRunning, weight } = this.state;
    if (!selectedExercise) {
      return null;
    }
    return (
      <form onSubmit={this.submitForm}>
        <Typography className={classes.exerciseTitle} variant="h3">
          {selectedExercise.title}
        </Typography>
        <TextField
          label="Sets"
          type="number"
          placeholder="5"
          className={classes.input}
          onChange={event => this.onFieldUpdate("sets", event.target.value)}
          value={sets}
        />
        <TextField
          label="Reps"
          type="number"
          placeholder="5"
          className={classes.input}
          onChange={event => this.onFieldUpdate("reps", event.target.value)}
          value={reps}
        />
        <TextField
          label="Weight (kg)"
          type="number"
          placeholder="5"
          className={classes.input}
          onChange={event => this.onFieldUpdate("weight", event.target.value)}
          value={weight}
        />
        <div className={classes.buttonWrapper}>
          <Stopwatch ref={(stopwatch: any) => (this.stopwatch = stopwatch)} />
          <Button className={classes.timerButton} onClick={this.toggleTimer}>
            {timerRunning ? "Pause" : "Start"}
          </Button>
          <Button
            className={classes.timerButton}
            onClick={() => this.stopwatch.reset()}
          >
            Reset
          </Button>
        </div>
        <Button type="submit">Done</Button>
      </form>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { loading } = data;
    const { selectedExercise } = this.state;
    const { exerciseDefinitions: exercises } = data;
    return (
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Fragment>
            <PageTitle label="Get started" />
            {exercises.length > 0 ? (
              <div className={classes.selectWrapper}>
                <Typography className={classes.selectTitle}>
                  Select an exercise
                </Typography>
                <Select
                  label="Exercise"
                  className={classes.formControl}
                  onChange={this.onSelectExercise}
                  options={exercises.map((exercise: ExerciseDefinition) => ({
                    id: exercise.id,
                    value: exercise.id,
                    label: exercise.title
                  }))}
                  value={selectedExercise ? selectedExercise.id : ""}
                />
              </div>
            ) : (
              <div>
                <Typography>
                  Looks like you don't have any exercises yet
                </Typography>
                <Typography
                  onClick={this.navigateToCreateExercise}
                  variant="body1"
                >
                  Create exercise
                </Typography>
              </div>
            )}
            {selectedExercise && this.renderExerciseForm()}
          </Fragment>
        )}
      </div>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Index));
