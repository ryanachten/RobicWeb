import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import EditIcon from "@material-ui/icons/Edit";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import {
  Typography,
  IconButton,
  withWidth,
  Tabs,
  Tab
} from "@material-ui/core";
import { Exercise, Set, ExerciseDefinition } from "../constants/types";
import { formatDate, formatTime, getUnitLabel } from "../utils";
import { compareDesc, compareAsc } from "date-fns";
import routes from "../constants/routes";
import { PageRoot, PageTitle, LoadingSplash } from "../components";
import { VictoryChart, VictoryTheme, VictoryLine, VictoryStack } from "victory";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";

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

enum TabMode {
  NET = "net",
  REPS = "reps",
  SETS = "sets",
  VALUE = "value"
}

type State = {
  tabMode: TabMode;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
  match: any;
  theme: Theme;
  width: Breakpoint;
};

class ExercisePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabMode: TabMode.VALUE
    };
    this.editExercise = this.editExercise.bind(this);
    this.renderExerciseDefinition = this.renderExerciseDefinition.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  editExercise() {
    const { history, match } = this.props;
    history.push(`${routes.EDIT_EXERCISE(match.params.id).route}`);
  }

  onTabChange(e: any, tabMode: TabMode) {
    this.setState({
      tabMode
    });
  }

  renderChart(label: string, data: any) {
    const { classes, theme, width } = this.props;
    return (
      <div className={classes.chart}>
        {!isMobile(width) && (
          <Typography className={classes.chartLabel} variant="subtitle1">
            {label}
          </Typography>
        )}
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLine
            data={data}
            style={{
              data: { stroke: theme.palette.primary.main }
            }}
          />
        </VictoryChart>
      </div>
    );
  }

  renderCharts() {
    const { classes, width } = this.props;
    const tabMode = this.state.tabMode;
    const { history, unit } = this.props.data.exerciseDefinition;
    const graphData = history
      .sort((a: any, b: any) => compareAsc(a.date, b.date))
      .reduce(
        (data: any, { sets }: Exercise, index: number) => {
          // Get average reps
          const reps =
            sets.reduce((total, set) => total + set.reps, 0) / sets.length;
          // Get average value
          const value =
            sets.reduce((total, set) => total + set.value, 0) / sets.length;

          const total = sets.reduce((total, set) => total + set.value, 0);
          return {
            reps: [...data.reps, { x: index, y: reps }],
            sets: [...data.sets, { x: index, y: sets.length }],
            total: [...data.total, { x: index, y: total }],
            values: [...data.values, { x: index, y: value }]
          };
        },
        { reps: [], sets: [], total: [], values: [] }
      );
    return isMobile(width) ? (
      <div>
        <Tabs
          indicatorColor="primary"
          onChange={this.onTabChange}
          scrollButtons="on"
          value={tabMode}
          variant="scrollable"
        >
          <Tab label={`${unit} (Avg)`} value={TabMode.VALUE} />
          <Tab label={`${unit} (Net)`} value={TabMode.NET} />
          <Tab label="Reps" value={TabMode.REPS} />
          <Tab label="Sets" value={TabMode.SETS} />
        </Tabs>
        {tabMode === TabMode.REPS && this.renderChart("Reps", graphData.reps)}
        {tabMode === TabMode.NET && this.renderChart("Net", graphData.total)}
        {tabMode === TabMode.VALUE &&
          this.renderChart("Values", graphData.values)}
        {tabMode === TabMode.SETS && this.renderChart("Sets", graphData.sets)}
      </div>
    ) : (
      <div className={classes.chartWrapper}>
        {this.renderChart(`${getUnitLabel(unit)} (Avg)`, graphData.values)}
        {this.renderChart(`${getUnitLabel(unit)} (Net)`, graphData.total)}
        {this.renderChart("Reps", graphData.reps)}
        {this.renderChart("Sets", graphData.sets)}
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
        {history.length > 1 && this.renderCharts()}
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
)(withWidth()(withStyles(styles, { withTheme: true })(ExercisePage)));
