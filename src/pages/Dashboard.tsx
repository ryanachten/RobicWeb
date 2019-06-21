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
import { AddExercise } from "../constants/mutations";
import { GetExercises } from "../constants/queries";
import { Classes } from "jss";
import { ExerciseDefinition, Set, Exercise, Unit } from "../constants/types";
import { Typography } from "@material-ui/core";
import routes from "../constants/routes";
import Stopwatch from "../components/Stopwatch";
import { formatDate, formatTime } from "../utils";
import PageRoot from "../components/PageRoot";

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
    historyHeader: {
      alignItems: "center",
      display: "flex"
    },
    historyTitle: {
      marginRight: theme.spacing.unit * 2
    },
    historyWrapper: {
      marginBottom: theme.spacing.unit * 4
    },
    input: {
      padding: theme.spacing.unit * 2
    },
    selectTitle: {
      marginRight: theme.spacing.unit
    },
    selectWrapper: {
      alignItems: "baseline",
      display: "flex"
    },
    setItem: {
      marginRight: theme.spacing.unit * 2
    },
    setWrapper: {
      display: "flex"
    },
    timerButton: {
      marginLeft: theme.spacing.unit * 2
    }
  });

type State = {
  selectedExercise: ExerciseDefinition | null;
  sets: Set[];
  timerRunning: boolean;
};

type Props = {
  classes: Classes;
  data: any;
  history: any;
  mutate: any;
};

class Index extends React.Component<Props, State> {
  stopwatch: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedExercise: null,
      sets: [
        {
          reps: 0,
          value: 0
        }
      ],
      timerRunning: false
    };
    this.addSet = this.addSet.bind(this);
    this.navigateToCreateExercise = this.navigateToCreateExercise.bind(this);
    this.removeSet = this.removeSet.bind(this);
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

  addSet() {
    const sets = [...this.state.sets];
    const prevSet = sets[sets.length - 1];
    sets.push({ ...prevSet });
    this.setState({ sets });
  }

  removeSet(index: number) {
    const sets = [...this.state.sets];
    sets.splice(index, 1);
    this.setState({ sets });
  }

  onFieldUpdate(set: number, field: "reps" | "value", value: string) {
    const state: State = { ...this.state };
    // @ts-ignore
    state.sets[set][field] = value;
    this.setState(state);
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { selectedExercise, sets } = this.state;
    // Prevent empty exercises being added
    if (!selectedExercise || (sets.length === 1 && sets[0].reps === 0)) {
      return null;
    }
    const timeTaken = this.stopwatch.getTime();
    const res = await this.props.mutate({
      variables: {
        definitionId: selectedExercise.id,
        sets,
        timeTaken
      },
      refetchQueries: [{ query: GetExercises }]
    });
    console.log("res", res);
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

  renderHistory(history: Exercise[], unit: Unit) {
    const { date, sets, timeTaken } = history[history.length - 1];
    const classes = this.props.classes;
    return (
      <div className={classes.historyWrapper}>
        <div className={classes.historyHeader}>
          <Typography className={classes.historyTitle} variant="subtitle1">
            Last session
          </Typography>
          <Typography color="textSecondary">{`${formatDate(
            date,
            true
          )}`}</Typography>
        </div>
        <div className={classes.setWrapper}>
          {sets.map(({ reps, value }, index) => (
            <div key={index}>
              <Typography
                className={classes.setItem}
                color="textSecondary"
              >{`${reps} reps x ${value} ${unit}`}</Typography>
            </div>
          ))}
          <Typography className={classes.setItem} color="textSecondary">
            {formatTime(timeTaken)}
          </Typography>
        </div>
      </div>
    );
  }

  renderExerciseForm() {
    const { classes } = this.props;
    const { selectedExercise, sets, timerRunning } = this.state;
    if (!selectedExercise) {
      return null;
    }
    const { history, title, unit } = selectedExercise;
    return (
      <form onSubmit={this.submitForm}>
        <Typography className={classes.exerciseTitle} variant="h3">
          {title}
        </Typography>
        {history && this.renderHistory(history, unit)}
        {sets.map(({ reps, value }: Set, index: number) => (
          <div className={classes.setWrapper} key={index}>
            <TextField
              label="Reps"
              type="number"
              placeholder="5"
              className={classes.input}
              onChange={event =>
                this.onFieldUpdate(index, "reps", event.target.value)
              }
              value={reps}
            />
            <TextField
              label={`Weight (${unit})`}
              type="number"
              placeholder="5"
              className={classes.input}
              onChange={event =>
                this.onFieldUpdate(index, "value", event.target.value)
              }
              value={value}
            />
            {index !== 0 && (
              <Button onClick={() => this.removeSet(index)}>Remove</Button>
            )}
            {index === sets.length - 1 && (
              <Button onClick={this.addSet}>Add</Button>
            )}
          </div>
        ))}
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
      <PageRoot>
        {loading ? (
          <CircularProgress />
        ) : (
          <Fragment>
            <PageTitle label="Get started" />
            {exercises && exercises.length > 0 ? (
              <div className={classes.selectWrapper}>
                <Typography className={classes.selectTitle}>
                  Select an exercise
                </Typography>
                <Select
                  label="Exercise"
                  className={classes.formControl}
                  onChange={this.onSelectExercise}
                  options={exercises.map(
                    ({ id, title }: ExerciseDefinition) => ({
                      id,
                      value: id,
                      label: title
                    })
                  )}
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
      </PageRoot>
    );
  }
}

export default compose(
  graphql(GetExercises),
  graphql(AddExercise)
)(withStyles(styles)(Index));
