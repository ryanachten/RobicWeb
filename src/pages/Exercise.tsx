import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import { CircularProgress, Typography } from "@material-ui/core";
import PageTitle from "../components/PageTitle";
import { Exercise, Set, ExerciseDefinition } from "../constants/types";
import { formatDate, formatTime } from "../utils";

const styles = (theme: Theme) =>
  createStyles({
    historyItem: {
      display: "flex",
      "& *": {
        margin: theme.spacing.unit
      }
    },
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

class ExercisePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.renderExerciseDefinition = this.renderExerciseDefinition.bind(this);
  }

  renderExerciseDefinition(exerciseDefinition: ExerciseDefinition) {
    const classes = this.props.classes;
    const { history, title, unit } = exerciseDefinition;
    return (
      <div>
        <PageTitle label={title} />

        {history.length > 0 ? (
          history.map(({ date, sets, timeTaken }: Exercise) => {
            const time = formatTime(timeTaken);
            return (
              <div key={date}>
                <Typography variant="h6">History</Typography>
                <div className={classes.historyItem}>
                  <Typography>{formatDate(date, true)}</Typography>
                  {sets.map(({ reps, value }: Set, index: number) => (
                    <Typography
                      key={index}
                    >{`Reps: ${reps} Value: ${value}${unit}`}</Typography>
                  ))}
                  <Typography>{`Time: ${time.hours}:${time.minutes}:${
                    time.seconds
                  }`}</Typography>
                </div>
              </div>
            );
          })
        ) : (
          <Typography>Exercise has not been attempted</Typography>
        )}
      </div>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { exerciseDefinition, loading } = data;

    return (
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : exerciseDefinition ? (
          this.renderExerciseDefinition(exerciseDefinition)
        ) : (
          <div>
            <PageTitle label="Oops!" />
            <Typography color="error">
              Sorry, this exercise cannot be found. It may have been deleted or
              created by a different user.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  graphql(GetExerciseDefinitionById, {
    options: (props: any) => ({
      variables: { exerciseId: props.match.params.id }
    })
  })
)(withStyles(styles)(ExercisePage));
