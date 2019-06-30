import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { AddExercise } from "../constants/mutations";
import { GetExercises } from "../constants/queries";
import { Classes } from "jss";
import { ExerciseDefinition, Set, Exercise, Unit } from "../constants/types";
import { Typography, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import routes from "../constants/routes";
import Stopwatch from "../components/Stopwatch";
import { formatDate, formatTime, getUnitLabel } from "../utils";
import {
  LoadingSplash,
  PageRoot,
  PageTitle,
  Select,
  Link
} from "../components";

const styles = (theme: Theme) =>
  createStyles({
    buttonWrapper: {
      alignItems: "center",
      display: "flex",
      marginLeft: theme.spacing.unit,
      marginTop: theme.spacing.unit * 2
    },
    createExerciseLink: {
      display: "block",
      marginBottom: theme.spacing.unit * 2
    },
    iconButton: {
      height: "48px",
      minWidth: "48px"
    },
    exerciseTitle: {
      marginBottom: theme.spacing.unit * 3,
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
    selectMessage: {
      marginTop: theme.spacing.unit * 4
    },
    selectWrapper: {
      alignItems: "baseline",
      display: "flex"
    },
    setItem: {
      marginRight: theme.spacing.unit * 2
    },
    setWrapper: {
      alignItems: "center",
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
  sortExericises: (a: ExerciseDefinition, b: ExerciseDefinition) => number;

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
    this.removeSet = this.removeSet.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.sortExericises = (a: ExerciseDefinition, b: ExerciseDefinition) => {
      return a.title >= b.title ? 1 : -1;
    };
  }

  toggleTimer() {
    const timerRunning = this.state.timerRunning;
    timerRunning ? this.stopwatch.stop() : this.stopwatch.start();
    this.setState(prevState => ({
      timerRunning: !prevState.timerRunning
    }));
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
    const state: any = { ...this.state };
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
    await this.props.mutate({
      variables: {
        definitionId: selectedExercise.id,
        sets,
        timeTaken
      },
      refetchQueries: [{ query: GetExercises }]
    });
    this.stopwatch.stop();
    this.setState({
      selectedExercise: null,
      sets: [
        {
          reps: 0,
          value: 0
        }
      ],
      timerRunning: false
    });
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
        {history && history.length > 0 && this.renderHistory(history, unit)}
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
              label={`${getUnitLabel(unit)} (${unit})`}
              type="number"
              placeholder="5"
              className={classes.input}
              onChange={event =>
                this.onFieldUpdate(index, "value", event.target.value)
              }
              value={value}
            />
            {index !== 0 ? (
              <IconButton
                className={classes.iconButton}
                onClick={() => this.removeSet(index)}
              >
                <RemoveIcon />
              </IconButton>
            ) : (
              <div className={classes.iconButton} />
            )}
            {index === sets.length - 1 ? (
              <IconButton className={classes.iconButton} onClick={this.addSet}>
                <AddIcon />
              </IconButton>
            ) : (
              <div className={classes.iconButton} />
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
        <Button color="primary" type="submit">
          Done
        </Button>
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
          <LoadingSplash />
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
                  options={exercises
                    .sort(this.sortExericises)
                    .map(({ id, title }: ExerciseDefinition) => ({
                      id,
                      value: id,
                      label: title
                    }))}
                  value={selectedExercise ? selectedExercise.id : ""}
                />
              </div>
            ) : (
              <div>
                <Link
                  className={classes.createExerciseLink}
                  label="Create Exercise"
                  url={routes.NEW_EXERCISE.route}
                />
                <Typography>
                  Looks like you don't have any exercises yet
                </Typography>
              </div>
            )}
            {selectedExercise ? (
              this.renderExerciseForm()
            ) : (
              <Typography
                className={classes.selectMessage}
                color="textSecondary"
                variant="h5"
              >
                select an exercise to get started...
              </Typography>
            )}
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
