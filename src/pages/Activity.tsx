import React, { ReactElement, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot, BackgroundMode } from "../components";
import { FullBody } from "../components/muscles/FullBody";
import { ExerciseDefinition, MuscleGroup } from "../constants/types";
import { isAfter, subDays, getDaysInMonth, getDaysInYear } from "date-fns";
import { Typography, Tabs, Tab, withWidth } from "@material-ui/core";
import { lerpColor } from "../utils";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis
} from "victory";
import { CHERRY_RED, PINK, PURPLE } from "../constants/colors";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";

const styles = (theme: Theme) =>
  createStyles({
    exerciseGrid: {
      display: "flex",
      flexFlow: "row wrap"
    },
    exerciseChart: {
      margin: "0 auto",
      width: "100%"
    },
    exerciseList: {
      margin: theme.spacing(2),
      width: "200px"
    },
    tabs: {
      justifyContent: "center"
    }
  });

enum TabMode {
  WEEK = "Week",
  MONTH = "Month",
  YEAR = "Year"
}

type State = {
  dateLimit: number;
  selectedExercises: ExerciseDefinition[];
  tab: TabMode;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
  mutate: any;
  result: any;
  theme: Theme;
  width: Breakpoint;
};

class Activity extends React.Component<Props, State> {
  sortExercisesAlphabetically: (
    a: ExerciseDefinition,
    b: ExerciseDefinition
  ) => number;
  sortByY: (a: { x: any; y: number }, b: { x: any; y: number }) => number;
  chartSettings: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      dateLimit: 7,
      selectedExercises: [],
      tab: TabMode.WEEK
    };
    this.getCurrentExercises = this.getCurrentExercises.bind(this);
    this.getExerciseCounts = this.getExerciseCounts.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.renderExerciseCountChart = this.renderExerciseCountChart.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.sortExercisesAlphabetically = (
      a: ExerciseDefinition,
      b: ExerciseDefinition
    ) => (a.title > b.title ? 1 : -1);
    this.sortByY = (a: { x: string; y: number }, b: { x: any; y: number }) => {
      if (a.y === b.y) {
        return a.x > b.x ? 1 : -1;
      }
      return a.y < b.y ? 1 : -1;
    };

    // Shared chart configuration
    this.chartSettings = {
      chart: {
        padding: { left: 70, right: 50, bottom: 50, top: 50 },
        height: 250,
        theme: VictoryTheme.material,
        domainPadding: 10,
        animate: { duration: 1000 }
      },
      clipLabel: (label: string) =>
        label.length > 9 ? `${label.slice(0, 6)}...` : label,
      label: {
        style: {
          color: this.props.theme.palette.text.disabled,
          fontSize: "7px"
        }
      },
      labelVertical: {
        angle: 90,
        textAnchor: "start",
        verticalAnchor: "middle"
      },
      maxColumnCount: () => (isMobile(this.props.width) ? 10 : 15)
    };
  }

  componentDidMount() {
    // If exercises have already been loaded, filter them
    if (this.props.data.exerciseDefinitions) {
      this.getCurrentExercises();
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Done loading, update filtered exercises
    if (prevProps.data.loading && !this.props.data.loading) {
      this.getCurrentExercises();
    }
  }

  updateDate(tab: TabMode) {
    let daysAmount: number;
    switch (tab) {
      case TabMode.MONTH:
        daysAmount = getDaysInMonth(Date.now());
        break;
      case TabMode.YEAR:
        daysAmount = getDaysInYear(Date.now());
        break;
      default:
        daysAmount = 7;
    }
    this.getCurrentExercises();
    this.setState({
      tab,
      dateLimit: daysAmount
    });
  }

  getCurrentExercises() {
    // Selected exercises filtered to those that are within the date range
    const exercises = this.props.data.exerciseDefinitions;
    const selectedExercises = exercises
      ? exercises.filter(({ history }: ExerciseDefinition) => {
          return (
            history.length > 0 &&
            isAfter(
              history[history.length - 1].date,
              subDays(Date.now(), this.state.dateLimit)
            )
          );
        })
      : [];
    this.setState({
      selectedExercises
    });
  }

  getExerciseCounts(exercises: ExerciseDefinition[]) {
    const dateLimit = this.state.dateLimit;
    const exerciseCountData: {
      x: string;
      y: number;
      muscleGroups: MuscleGroup[];
    }[] = exercises
      // .sort(this.sortExercisesAlphabetically)
      .reverse()
      .map((def: ExerciseDefinition) => {
        const validSessions = def.history.filter(e =>
          isAfter(e.date, subDays(Date.now(), dateLimit))
        );
        return {
          x: this.chartSettings.clipLabel(def.title),
          y: validSessions.length,
          muscleGroups: def.primaryMuscleGroup
        };
      })
      .sort(this.sortByY);
    const exerciseCountMax =
      (exerciseCountData && Math.max(...exerciseCountData.map(e => e.y))) || 1;
    return {
      exerciseCountData,
      exerciseCountMax
    };
  }

  renderMuscleList(muscle: MuscleGroup): ReactElement | null {
    const { selectedExercises: exercises } = this.state;
    if (!muscle) {
      return null;
    }
    // Find exercises associated with selected muscle
    // return null instead of component if no results
    const filtered = exercises.filter(e =>
      e.primaryMuscleGroup.includes(muscle)
    );
    return filtered.length > 0 ? (
      <div>
        {filtered.sort(this.sortExercisesAlphabetically).map(e => (
          <Typography key={e.id}>{e.title}</Typography>
        ))}
      </div>
    ) : null;
  }

  renderExerciseCountChart(exerciseCountData: any, exerciseCountMax: number) {
    const { classes } = this.props;

    // Don't show the exercise count chart if y values are the same
    const yAllTheSame = !exerciseCountData
      .map((d: any) => d.y === exerciseCountData[0].y || d.y === 0)
      .includes(false);
    if (yAllTheSame) {
      return null;
    }
    return (
      <section className={classes.exerciseChart}>
        <VictoryChart {...this.chartSettings.chart}>
          <VictoryAxis
            tickLabelComponent={
              <VictoryLabel
                {...this.chartSettings.label}
                {...this.chartSettings.labelVertical}
              />
            }
          />
          <VictoryAxis
            dependentAxis
            tickLabelComponent={<VictoryLabel {...this.chartSettings.label} />}
          />
          <VictoryBar
            style={{
              data: {
                fill: d => lerpColor(PURPLE, PINK, d.y / exerciseCountMax)
              }
            }}
            data={exerciseCountData}
          />
        </VictoryChart>
      </section>
    );
  }

  renderMuscleCountChart(muscles: MuscleGroup[]) {
    const { classes, theme } = this.props;

    const muscleCounts = muscles.reverse().reduce((total: any, muscle) => {
      total[muscle] ? total[muscle]++ : (total[muscle] = 1);
      return { ...total };
    }, {});
    const muscleData: { x: string; y: number }[] = Object.keys(muscleCounts)
      .map(muscle => ({
        x: this.chartSettings.clipLabel(muscle),
        y: muscleCounts[muscle]
      }))
      .sort(this.sortByY)
      .slice(0, this.chartSettings.maxColumnCount());
    const maxMuscleCount = Math.max(
      ...Object.keys(muscleCounts).map((muscle: any) => muscleCounts[muscle])
    );
    return (
      <section className={classes.exerciseChart}>
        <VictoryChart {...this.chartSettings.chart}>
          <VictoryAxis
            tickLabelComponent={
              <VictoryLabel
                {...this.chartSettings.label}
                {...this.chartSettings.labelVertical}
              />
            }
          />
          <VictoryAxis
            dependentAxis
            tickLabelComponent={<VictoryLabel {...this.chartSettings.label} />}
          />
          <VictoryBar
            style={{
              data: {
                fill: d =>
                  lerpColor(
                    theme.palette.secondary.light,
                    CHERRY_RED,
                    d.y / maxMuscleCount
                  )
              }
            }}
            data={muscleData}
          />
        </VictoryChart>
      </section>
    );
  }

  renderCharts() {
    const { dateLimit, selectedExercises } = this.state;

    // Get number of sessions per exercise within the active date range
    const { exerciseCountData, exerciseCountMax } = this.getExerciseCounts(
      selectedExercises
    );

    // Get total muscle groups based on exercise count
    const muscles: MuscleGroup[] = exerciseCountData
      ? Object.keys(exerciseCountData).reduce(
          (total: MuscleGroup[], key: any) => {
            const exercise = exerciseCountData[key];
            const newMuscles: MuscleGroup[] = [];
            // For the number of counts per exercise
            for (let index = 0; index < exercise.y; index++) {
              // ...each of the exercise's muscle groups are added to the total
              exercise.muscleGroups.map(muscle => newMuscles.push(muscle));
            }
            return [...total, ...newMuscles];
          },
          []
        )
      : [];

    return (
      <Fragment>
        <FullBody
          muscleGroupLevels={dateLimit}
          menuComponent={muscle => this.renderMuscleList(muscle)}
          selected={muscles}
        />
        {this.renderMuscleCountChart(muscles)}
        {this.renderExerciseCountChart(
          exerciseCountData.slice(0, this.chartSettings.maxColumnCount()),
          exerciseCountMax
        )}
      </Fragment>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { tab } = this.state;
    const loading = data.loading;
    return (
      <PageRoot
        backgroundMode={BackgroundMode.purple}
        containerWidth="md"
        loading={loading}
        error={data.error}
        actionPanel={{
          title: routes.ACTIVITY.label,
          children: (
            <Tabs
              classes={{
                flexContainer: classes.tabs
              }}
              indicatorColor="primary"
              onChange={(e, tab: TabMode) => this.updateDate(tab)}
              value={tab}
            >
              <Tab label="Weekly" value={TabMode.WEEK} />
              <Tab label="Monthly" value={TabMode.MONTH} />
              <Tab label="Yearly" value={TabMode.YEAR} />
            </Tabs>
          )
        }}
      >
        {this.renderCharts()}
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(
  withStyles(styles, { withTheme: true })(withWidth()(Activity))
);
