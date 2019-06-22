import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";
import { Typography } from "@material-ui/core";
import routes from "../constants/routes";
import { formatDate } from "../utils";
import { compareDesc } from "date-fns";
import { Link, PageRoot, PageTitle, LoadingSplash } from "../components";

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
    exerciseDate: {
      marginLeft: theme.spacing.unit / 2
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
    this.navigateToExercise = this.navigateToExercise.bind(this);

    this.compareDates = (a: ExerciseDefinition, b: ExerciseDefinition) => {
      const a_latestSession =
        a.history.length > 0
          ? a.history[a.history.length - 1].date
          : new Date(0);
      const b_latestSession =
        b.history.length > 0
          ? b.history[b.history.length - 1].date
          : new Date(0);
      return compareDesc(a_latestSession, b_latestSession);
    };
  }

  navigateToExercise(exercise: ExerciseDefinition) {
    this.props.history.push(routes.EXERCISE(exercise.id, exercise.title).route);
  }

  renderExercise(exercise: ExerciseDefinition) {
    const classes = this.props.classes;
    const formattedDate: string | null =
      exercise.history.length > 0
        ? formatDate(exercise.history[exercise.history.length - 1].date, true)
        : null;
    return (
      <li className={classes.exerciseTitle} key={exercise.id}>
        <Typography
          onClick={() => this.navigateToExercise(exercise)}
          variant="h2"
        >
          {exercise.title}
        </Typography>
        {formattedDate && (
          <Typography
            className={classes.exerciseDate}
          >{`Last completed ${formattedDate}`}</Typography>
        )}
      </li>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { exerciseDefinitions: exercises, loading } = data;
    return (
      <PageRoot>
        {loading ? (
          <LoadingSplash />
        ) : (
          <Fragment>
            <PageTitle label="Exercises" />
            <Link
              label={routes.NEW_EXERCISE.label}
              url={routes.NEW_EXERCISE.route}
            />
            <ul className={classes.exerciseList}>
              {exercises.length > 0 ? (
                exercises
                  .sort(this.compareDates)
                  .map((exercise: ExerciseDefinition) =>
                    this.renderExercise(exercise)
                  )
              ) : (
                <div>
                  <Typography>
                    Looks like you don't have any exercises yet
                  </Typography>
                </div>
              )}
            </ul>
          </Fragment>
        )}
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Exercises));
