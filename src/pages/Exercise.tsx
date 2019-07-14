import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import EditIcon from "@material-ui/icons/Edit";
import CircuitIcon from "@material-ui/icons/FilterTiltShift";
import SupersetIcon from "@material-ui/icons/FlashOn";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import {
  Typography,
  IconButton,
  withWidth,
  Tabs,
  Tab
} from "@material-ui/core";
import {
  Exercise,
  Set,
  ExerciseDefinition,
  ExerciseType,
  MuscleGroup
} from "../constants/types";
import {
  formatDate,
  formatTime,
  getUnitLabel,
  transparentize,
  showChildExercises
} from "../utils";
import { compareDesc, compareAsc } from "date-fns";
import routes from "../constants/routes";
import { PageRoot, PageTitle, LoadingSplash, Link } from "../components";
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryTooltip
} from "victory";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";
import { FullBody } from "../components/muscles/FullBody";

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
    childExList: {
      margin: 0,
      paddingLeft: theme.spacing.unit * 2
    },
    childExListWrapper: {
      margin: theme.spacing.unit
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
      marginBottom: theme.spacing.unit * 3,
      textTransform: "capitalize"
    },
    typeIcon: {
      marginRight: theme.spacing.unit
    },
    typeWrapper: {
      alignItems: "center",
      display: "flex"
    }
  });

enum TabMode {
  NET = "net",
  REPS = "reps",
  SETS = "sets",
  TIME = "time",
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
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={
            <VictoryVoronoiContainer
              labels={d => formatDate(d.date)}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{
                    fill: theme.palette.common.white,
                    stroke: transparentize(theme.palette.common.black, 0.1)
                  }}
                  style={{ fill: theme.palette.text.primary }}
                />
              }
            />
          }
        >
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
        (data: any, exercise: Exercise, index: number) => {
          const { sets, timeTaken } = exercise;
          // Get average reps
          const reps =
            sets.reduce((total, set) => total + set.reps, 0) / sets.length;
          // Get average value
          const value =
            sets.reduce((total, set) => total + set.value, 0) / sets.length;
          // Get net value (sets * (reps * value))
          const total = sets.reduce(
            (total, set) => total + set.value * set.reps,
            0
          );
          // Convert time into millis, then mins, then divide by set count

          const minPerSet = () => {
            // Avoid plotting times which weren't taken
            if (!timeTaken || timeTaken === "1970-01-01T00:00:00.000Z") {
              return null;
            }
            const date = new Date(timeTaken);
            const millis =
              date.getMinutes() * 60000 +
              date.getSeconds() * 1000 +
              date.getMilliseconds();
            const minutes = millis / 60000;
            return (minutes / sets.length).toFixed(2);
          };

          return {
            reps: [...data.reps, { ...exercise, unit, x: index, y: reps }],
            sets: [
              ...data.sets,
              { ...exercise, unit, x: index, y: sets.length }
            ],
            timeTaken: [
              ...data.timeTaken,
              { ...exercise, unit, x: index, y: minPerSet() }
            ],
            total: [...data.total, { ...exercise, unit, x: index, y: total }],
            values: [...data.values, { ...exercise, unit, x: index, y: value }]
          };
        },
        { reps: [], sets: [], timeTaken: [], total: [], values: [] }
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
          <Tab label="Min / Set" value={TabMode.TIME} />
        </Tabs>
        {tabMode === TabMode.REPS && this.renderChart("Reps", graphData.reps)}
        {tabMode === TabMode.NET && this.renderChart("Net", graphData.total)}
        {tabMode === TabMode.VALUE &&
          this.renderChart("Values", graphData.values)}
        {tabMode === TabMode.SETS && this.renderChart("Sets", graphData.sets)}
        {tabMode === TabMode.TIME &&
          this.renderChart("Min / Set", graphData.timeTaken)}
      </div>
    ) : (
      <div className={classes.chartWrapper}>
        {this.renderChart(`${getUnitLabel(unit)} (Avg)`, graphData.values)}
        {this.renderChart(`${getUnitLabel(unit)} (Net)`, graphData.total)}
        {this.renderChart("Reps", graphData.reps)}
        {this.renderChart("Sets", graphData.sets)}
        {this.renderChart("Min / Set", graphData.timeTaken)}
      </div>
    );
  }

  renderExerciseDefinition(exerciseDefinition: ExerciseDefinition) {
    const classes = this.props.classes;
    const {
      childExercises,
      history,
      primaryMuscleGroup,
      title,
      type = ExerciseType.STANDARD,
      unit
    } = exerciseDefinition;

    // Get muscles based on child exercises if applicable
    const muscles: MuscleGroup[] = showChildExercises(type)
      ? childExercises
        ? childExercises.reduce(
            (total: MuscleGroup[], ex: ExerciseDefinition) => {
              return ex.primaryMuscleGroup
                ? [...total, ...ex.primaryMuscleGroup]
                : total;
            },
            []
          )
        : []
      : primaryMuscleGroup;
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
        <section>
          <div>
            {type === ExerciseType.CIRCUIT && (
              <div className={classes.typeWrapper}>
                <CircuitIcon className={classes.typeIcon} color="primary" />
                <Typography color="textSecondary" variant="h6">
                  {`${ExerciseType.CIRCUIT} exercise`}
                </Typography>
              </div>
            )}
            {type === ExerciseType.SUPERSET && (
              <div className={classes.typeWrapper}>
                <SupersetIcon className={classes.typeIcon} color="primary" />
                <Typography color="textSecondary" variant="h6">
                  {`${ExerciseType.SUPERSET} exercise`}
                </Typography>
              </div>
            )}
          </div>
          {showChildExercises(type) && childExercises && (
            <section className={classes.childExListWrapper}>
              <Typography variant="subtitle1">Comprised of</Typography>
              <ul className={classes.childExList}>
                {childExercises.map(exercise => (
                  <li key={exercise.id}>
                    <Link
                      label={exercise.title}
                      url={routes.EXERCISE(exercise.id).route}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
        {primaryMuscleGroup && <FullBody selected={muscles} />}
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
