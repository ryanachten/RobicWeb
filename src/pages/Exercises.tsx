import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";
import { CircularProgress, Typography } from "@material-ui/core";
import PageTitle from "../components/PageTitle";
import routes from "../constants/routes";

const styles = (theme: Theme) =>
  createStyles({
    exerciseList: {
      padding: 0
    },
    exerciseTitle: {
      listStyle: "none",
      marginBottom: theme.spacing.unit
    },
    root: {
      padding: theme.spacing.unit * 4
    }
  });

type State = {};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
};

class Exercises extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedExercise: null
    };
    this.navigateToExercise = this.navigateToExercise.bind(this);
  }

  navigateToExercise(exercise: ExerciseDefinition) {
    this.props.history.push(routes.EXERCISE(exercise.id, exercise.title).route);
  }

  render() {
    const { classes, data } = this.props;
    const { exerciseDefinitions: exercises, loading } = data;
    return (
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Fragment>
            <PageTitle label="Exercises" />
            <ul className={classes.exerciseList}>
              {exercises &&
                exercises.map((exercise: ExerciseDefinition) => {
                  return (
                    <li className={classes.exerciseTitle} key={exercise.id}>
                      <Typography
                        onClick={() => this.navigateToExercise(exercise)}
                        variant="h2"
                      >
                        {exercise.title}
                      </Typography>
                    </li>
                  );
                })}
            </ul>
          </Fragment>
        )}
      </div>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Exercises));
