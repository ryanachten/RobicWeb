import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import { Typography } from "@material-ui/core";
import { Exercise, Set, ExerciseDefinition } from "../constants/types";
import { formatDate, formatTime } from "../utils";
import { compareDesc } from "date-fns";
import routes from "../constants/routes";
import { PageRoot, PageTitle, LoadingSplash } from "../components";

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
    header: {
      marginBottom: theme.spacing.unit * 2
    },
    historyList: {
      margin: 0,
      padding: 0,
      paddingLeft: theme.spacing.unit * 2
    },
    reps: {
      marginRight: theme.spacing.unit * 2
    },
    sessionHeader: {
      display: "flex",
      justifyContent: "space-between",
      maxWidth: 400
    },
    sessionItem: {
      marginBottom: theme.spacing.unit * 2
    },
    setItem: {
      display: "flex"
    },
    title: {
      marginBottom: theme.spacing.unit * 3
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
        <PageTitle
          label="Exercise"
          breadcrumb={{
            label: `Back to ${routes.EXERCISES.label}`,
            url: routes.EXERCISES.route
          }}
        />
        <Typography className={classes.title} component="h1" variant="h2">
          {title}
        </Typography>
        <div className={classes.header}>
          <Typography variant="h6">History</Typography>
          <Typography>{`Sessions: ${history.length}`}</Typography>
        </div>
        {history.length > 0 ? (
          history
            .sort((a, b) => compareDesc(a.date, b.date))
            .map(({ date, sets, timeTaken }: Exercise) => {
              return (
                <div className={classes.sessionItem} key={date}>
                  <div className={classes.sessionHeader}>
                    <Typography>{formatDate(date, true)}</Typography>
                    <Typography>{`Time: ${formatTime(timeTaken)}`}</Typography>
                  </div>
                  <ul className={classes.historyList}>
                    {sets.map(({ reps, value }: Set, index: number) => (
                      <li className={classes.setItem} key={index}>
                        <Typography className={classes.reps}>{`${index +
                          1}. Reps: ${reps}`}</Typography>
                        <Typography>{`Value: ${value}${unit}`}</Typography>
                      </li>
                    ))}
                  </ul>
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
    const { data } = this.props;
    const { exerciseDefinition, loading } = data;

    return (
      <PageRoot>
        {loading ? (
          <LoadingSplash />
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
      </PageRoot>
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
