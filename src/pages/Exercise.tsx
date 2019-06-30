import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import EditIcon from "@material-ui/icons/Edit";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import { Typography, IconButton } from "@material-ui/core";
import { Exercise, Set, ExerciseDefinition } from "../constants/types";
import { formatDate, formatTime } from "../utils";
import { compareDesc } from "date-fns";
import routes from "../constants/routes";
import { PageRoot, PageTitle, LoadingSplash } from "../components";
import { VictoryChart, VictoryTheme, VictoryLine, VictoryStack } from "victory";

const styles = (theme: Theme) =>
  createStyles({
    chart: {
      maxHeight: "500px",
      maxWidth: "500px"
    },
    chartLabel: {
      textAlign: "center"
    },
    chartWrapper: {
      display: "flex",
      flexFlow: "row wrap"
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
    titleWrapper: {
      alignItems: "center",
      display: "flex",
      flexFlow: "row",
      marginBottom: theme.spacing.unit * 3,
      textTransform: "capitalize"
    }
  });

type State = {};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
  match: any;
  theme: Theme;
};

class ExercisePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.editExercise = this.editExercise.bind(this);
    this.renderExerciseDefinition = this.renderExerciseDefinition.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }

  editExercise() {
    const { history, match } = this.props;
    history.push(`${routes.EDIT_EXERCISE(match.params.id).route}`);
  }

  renderChart() {
    const { classes, theme } = this.props;
    const history = this.props.data.exerciseDefinition.history;
    const graphData = history.reduce(
      (data: any, { date, sets }: Exercise, index: number) => {
        // Get average reps
        const reps =
          sets.reduce((total, set) => total + set.reps, 0) / sets.length;
        // Get average value
        const value =
          sets.reduce((total, set) => total + set.value, 0) / sets.length;

        return {
          reps: [...data.reps, { x: index, y: reps }],
          values: [...data.values, { x: index, y: value }]
        };
      },
      { reps: [], values: [] }
    );
    return (
      <div className={classes.chartWrapper}>
        <div className={classes.chart}>
          <Typography className={classes.chartLabel} variant="subtitle1">
            Reps
          </Typography>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={graphData.reps}
              style={{
                data: { stroke: theme.palette.primary.main }
              }}
            />
          </VictoryChart>
        </div>
        <div className={classes.chart}>
          <Typography className={classes.chartLabel} variant="subtitle1">
            Values
          </Typography>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={graphData.values}
              style={{
                data: { stroke: theme.palette.primary.main }
              }}
            />
          </VictoryChart>
        </div>
      </div>
    );
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
        <div className={classes.titleWrapper}>
          <Typography component="h1" variant="h2">
            {title}
          </Typography>
          <IconButton onClick={this.editExercise}>
            <EditIcon />
          </IconButton>
        </div>
        {this.renderChart()}
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
)(withStyles(styles, { withTheme: true })(ExercisePage));
