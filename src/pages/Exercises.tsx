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
import { formatDate } from "../utils";
import { parse, isAfter } from "date-fns";

const styles = (theme: Theme) =>
  createStyles({
    exerciseList: {
      padding: 0
    },
    exerciseTitle: {
      cursor: "pointer",
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
  compareDates: (a: ExerciseDefinition, b: ExerciseDefinition) => number;
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedExercise: null
    };
    this.navigateToExercise = this.navigateToExercise.bind(this);

    this.compareDates = (a: ExerciseDefinition, b: ExerciseDefinition) => {
      const a_latestSession =
        a.history.length > 0
          ? a.history[a.history.length - 1].session.date
          : new Date();
      const b_latestSession =
        b.history.length > 0
          ? b.history[b.history.length - 1].session.date
          : new Date();
      return isAfter(parse(a_latestSession), parse(b_latestSession)) ? 1 : -1;
    };
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
                exercises
                  .sort(this.compareDates)
                  .map((exercise: ExerciseDefinition) => {
                    return (
                      <li className={classes.exerciseTitle} key={exercise.id}>
                        <Typography
                          onClick={() => this.navigateToExercise(exercise)}
                          variant="h2"
                        >
                          {exercise.title}
                        </Typography>
                        {exercise.history.length > 0 && (
                          <Typography>
                            {formatDate(
                              exercise.history[exercise.history.length - 1]
                                .session.date,
                              true
                            )}
                          </Typography>
                        )}
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
