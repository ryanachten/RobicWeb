import React, { ReactElement, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot } from "../components";
import { FullBody } from "../components/muscles/FullBody";
import { ExerciseDefinition, MuscleGroup } from "../constants/types";
import { isAfter, subDays, getDaysInMonth, getDaysInYear } from "date-fns";
import { Typography, Tabs, Tab, withWidth, Divider } from "@material-ui/core";
import { lerpColor, sortAlphabetically } from "../utils";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryTooltip
} from "victory";
import { CHERRY_RED, PINK, PURPLE } from "../constants/colors";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";
import { HEADER_FONT } from "../constants/fonts";

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
    divider: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4)
    },
    exerciseList: {
      margin: theme.spacing(2),
      width: "200px"
    },
    exerciseTotal: {
      fontFamily: HEADER_FONT,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    exerciseTotalVal: {
      color: theme.palette.primary.light
    },
    exerciseTotalWrapper: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
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
    this.sortByY = (a: { x: string; y: number }, b: { x: any; y: number }) => {
      if (a.y === b.y) {
        return a.x > b.x ? 1 : -1;
      }
      return a.y < b.y ? 1 : -1;
    };

    // Shared chart configuration
    this.chartSettings = {
      axis: {
        style: {
          axis: { display: "none" },
          grid: { display: "none" },
          ticks: { display: "none" }
        }
      },
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
    const width = this.props.width;
    const exerciseCountData: {
      x: string;
      y: number;
      muscleGroups: MuscleGroup[];
    }[] = exercises
      .reverse()
      .map((def: ExerciseDefinition) => {
        const validSessions = def.history.filter(e =>
          isAfter(e.date, subDays(Date.now(), dateLimit))
        );
        return {
          x: this.chartSettings.clipLabel(def.title),
          y: validSessions.length,
          label: isMobile(width) ? def.title : null,
          muscleGroups: def.primaryMuscleGroup
        };
      })
      .sort(this.sortByY);

    // Highest number for manual chart calibration
    const exerciseCountMax =
      (exerciseCountData && Math.max(...exerciseCountData.map(e => e.y))) || 1;

    // Total number of exercises in date period
    const totalExerciseCount =
      exerciseCountData &&
      exerciseCountData.reduce((total, count) => total + count.y, 0);

    return {
      exerciseCountData,
      exerciseCountMax,
      totalExerciseCount
    };
  }

  getMuscleCounts(
    exerciseCountData: {
      x: string;
      y: number;
      muscleGroups: MuscleGroup[];
    }[]
  ) {
    // Get total muscle groups based on exercise count
    const muscles: MuscleGroup[] = exerciseCountData
      ? Object.keys(exerciseCountData).reduce(
          (total: MuscleGroup[], key: any) => {
            const exercise = exerciseCountData[key];
            const newMuscles: MuscleGroup[] = [];
            // For the number of counts per exercise
            for (let index = 0; index < exercise.y; index++) {
              // ...each of the exercise's muscle groups are added to the total
              exercise.muscleGroups.map((muscle: MuscleGroup) =>
                newMuscles.push(muscle)
              );
            }
            return [...total, ...newMuscles];
          },
          []
        )
      : [];

    const muscleCounts = muscles.reverse().reduce((total: any, muscle) => {
      total[muscle] ? total[muscle]++ : (total[muscle] = 1);
      return { ...total };
    }, {});
    const maxMuscleCount = Math.max(
      ...Object.keys(muscleCounts).map((muscle: any) => muscleCounts[muscle])
    );
    return {
      muscles,
      muscleCounts,
      maxMuscleCount
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
        {filtered.sort(sortAlphabetically).map(e => (
          <Typography key={e.id}>{e.title}</Typography>
        ))}
      </div>
    ) : null;
  }

  renderExerciseCountChart(exerciseCountData: any, exerciseCountMax: number) {
    const { classes } = this.props;
    return (
      <section className={classes.exerciseChart}>
        <BaseChart config={this.chartSettings}>
          <VictoryBar
            labelComponent={<VictoryTooltip />}
            style={{
              data: {
                fill: d => lerpColor(PURPLE, PINK, d.y / exerciseCountMax)
              }
            }}
            data={exerciseCountData}
          />
        </BaseChart>
      </section>
    );
  }

  renderMuscleCountChart(muscleCounts: any, maxMuscleCount: number) {
    const { classes, theme, width } = this.props;

    const muscleData: { x: string; y: number }[] = Object.keys(muscleCounts)
      .map(muscle => ({
        x: this.chartSettings.clipLabel(muscle),
        y: muscleCounts[muscle],
        label: isMobile(width) ? muscle : null
      }))
      .sort(this.sortByY)
      .slice(0, this.chartSettings.maxColumnCount());
    return (
      <section className={classes.exerciseChart}>
        <BaseChart config={this.chartSettings}>
          <VictoryBar
            labelComponent={<VictoryTooltip />}
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
        </BaseChart>
      </section>
    );
  }

  renderCharts() {
    const { classes, width } = this.props;
    const { dateLimit, selectedExercises } = this.state;

    // Get number of sessions per exercise within the active date range
    const {
      exerciseCountData,
      exerciseCountMax,
      totalExerciseCount
    } = this.getExerciseCounts(selectedExercises);

    const { muscles, muscleCounts, maxMuscleCount } = this.getMuscleCounts(
      exerciseCountData
    );

    const titleAlignment = isMobile(width) ? "left" : "center";

    return (
      <Fragment>
        <div className={classes.exerciseTotalWrapper}>
          <Typography
            align="center"
            className={classes.exerciseTotal}
            variant="h3"
          >
            <span
              className={classes.exerciseTotalVal}
            >{`${totalExerciseCount} `}</span>
            exercises
          </Typography>
          <Typography align="center">{`completed between today and ${dateLimit} days ago`}</Typography>
        </div>
        <Divider className={classes.divider} />
        <Typography align={titleAlignment} variant="h6">
          Muscle Groups
        </Typography>
        <FullBody
          muscleGroupLevels={maxMuscleCount}
          menuComponent={muscle => this.renderMuscleList(muscle)}
          selected={muscles}
        />
        {this.renderMuscleCountChart(muscleCounts, maxMuscleCount)}
        <Typography align="center" variant="subtitle1">
          Top Muscle Groups
        </Typography>
        <Divider className={classes.divider} />
        <Typography align={titleAlignment} variant="h6">
          Exercises
        </Typography>
        {this.renderExerciseCountChart(
          exerciseCountData.slice(0, this.chartSettings.maxColumnCount()),
          exerciseCountMax
        )}
        <Typography align="center" variant="subtitle1">
          Top Exercises
        </Typography>
        <div className={classes.divider} />
      </Fragment>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { tab } = this.state;
    const loading = data.loading;
    return (
      <PageRoot
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

const BaseChart = ({ config, children }: any) => {
  return (
    <VictoryChart {...config.chart}>
      <VictoryAxis
        {...config.axis}
        tickLabelComponent={
          <VictoryLabel {...config.label} {...config.labelVertical} />
        }
      />
      <VictoryAxis
        {...config.axis}
        dependentAxis
        tickLabelComponent={<VictoryLabel {...config.label} />}
      />
      {children}
    </VictoryChart>
  );
};

export default compose(graphql(GetExercises))(
  withStyles(styles, { withTheme: true })(withWidth()(Activity))
);
