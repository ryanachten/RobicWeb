import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import PageTitle from "../components/PageTitle";
import { GetExercises } from "../constants/queries";
import { Classes } from "jss";
import { ExerciseDefinition } from "../constants/types";
import { Typography } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
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
    submitWrapper: {
      width: "100%"
    }
  });

type State = {
  selectedExercise: ExerciseDefinition | "";
  reps: string;
  sets: string;
  weight: string;
};

type Props = {
  classes: Classes;
  data: any;
};

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedExercise: "",
      reps: "",
      sets: "",
      weight: ""
    };
    this.submitForm = this.submitForm.bind(this);
  }

  onFieldUpdate(field: "sets" | "reps" | "weight", value: string) {
    const state: State = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { reps, sets, weight } = this.state;
    console.log("reps, sets, weight", reps, sets, weight);
  }

  onSelectExercise = (e: any) => {
    this.setState({
      selectedExercise: e.target.value
    });
  };

  renderExerciseForm() {
    const { classes } = this.props;
    const { reps, sets, weight } = this.state;
    return (
      <form onSubmit={this.submitForm}>
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
        <div className="submitWrapper">
          <Button type="submit">Submit</Button>
        </div>
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
            <PageTitle label="Robic" />
            <div className={classes.selectWrapper}>
              <Typography className={classes.selectTitle}>
                Select an exercise
              </Typography>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="exercise">Exercise</InputLabel>
                <Select
                  onChange={this.onSelectExercise}
                  value={selectedExercise}
                  inputProps={{
                    name: "exercise",
                    id: "exercise"
                  }}
                >
                  {exercises &&
                    exercises.map((exercise: ExerciseDefinition) => (
                      <MenuItem key={exercise.id} value={exercise.id}>
                        {exercise.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            {selectedExercise && this.renderExerciseForm()}
          </Fragment>
        )}
      </div>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Index));
