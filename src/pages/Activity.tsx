import React, { ReactElement, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot, OverviewCard, Select } from "../components";
import { FullBody } from "../components/muscles/FullBody";
import { ExerciseDefinition, MuscleGroup, Exercise } from "../constants/types";
import {
  isAfter,
  subDays,
  getDaysInMonth,
  getDaysInYear,
  format
} from "date-fns";
import { Typography, Tabs, Tab, withWidth, Divider } from "@material-ui/core";
import {
  lerpColor,
  sortAlphabetically,
  getNetTotalFromSets,
  isCompositeExercise,
  transparentize
} from "../utils";
import {
  VictoryArea,
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer
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
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
      width: "100%",

      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(2)
      }
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
      marginRight: theme.spacing(2),

      [theme.breakpoints.up("sm")]: {
        marginBottom: theme.spacing(8)
      }
    },
    overviewCard: {
      margin: "0 auto",
      marginTop: theme.spacing(4),
      maxWidth: theme.breakpoints.values.sm
    },
    sectionItem: {
      flexGrow: 1,
      minWidth: "200px",

      [theme.breakpoints.up("sm")]: {
        maxWidth: "50%"
      }
    },
    sectionWrapper: {
      display: "flex",
      flexFlow: "row wrap"
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
  selectedMuscleGroup: MuscleGroup | "";
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
  getOverviewLabel: (
    data: { x: string; y: number }[],
    parse: (x: string, y: number) => { x: string; y: string | number }
  ) => string;
  sortByY: (a: { x: any; y: number }, b: { x: any; y: number }) => number;
  chartSettings: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      dateLimit: 7,
      selectedExercises: [],
      selectedMuscleGroup: "",
      tab: TabMode.WEEK
    };
    this.getCurrentExercises = this.getCurrentExercises.bind(this);
    this.getExerciseCounts = this.getExerciseCounts.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.renderExerciseCountChart = this.renderExerciseCountChart.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateMuscleGroup = this.updateMuscleGroup.bind(this);
    this.sortByY = (a: { x: string; y: number }, b: { x: any; y: number }) => {
      if (a.y === b.y) {
        return a.x > b.x ? 1 : -1;
      }
      return a.y < b.y ? 1 : -1;
    };
    this.getOverviewLabel = (data, parse) => {
      if (!data[0]) {
        return "";
      }
      const parsed = parse(data[0].x, data[0].y);
      return `${parsed.x}  ${parsed.y}`;
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
        padding: { left: 70, right: 50, bottom: 50, top: 0 },
        height: 250,
        theme: VictoryTheme.material,
        domainPadding: 10,
        animate: { duration: 1000 }
      },
      clipLabel: (label: string) => label,
      label: {
        style: {
          fill: this.props.theme.palette.text.disabled,
          fontSize: "7px"
        }
      },
      labelVertical: {
        angle: 90,
        textAnchor: "start",
        verticalAnchor: "middle"
      },
      maxColumnCount: () => (isMobile(this.props.width) ? 10 : 16),
      toolTip: {
        flyoutStyle: {
          fill: this.props.theme.palette.common.white,
          stroke: this.props.theme.palette.text.disabled
        },
        style: {
          fontFamily: this.props.theme.typography.body1.fontFamily,
          fontSize: "7px",
          fill: this.props.theme.palette.text.primary
        },
        text: (d: { x: string; y: number }) => (d ? `${d.x}: ${d.y}` : "")
      }
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

  updateMuscleGroup(e: MuscleGroup) {
    this.setState({
      selectedMuscleGroup: e
    });
  }

  getCurrentExercises() {
    // Any upfront filtering can go here... (currently not requried)
    const exercises = this.props.data.exerciseDefinitions;
    this.setState({
      selectedExercises: exercises
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
    const exerciseCountMax = Math.max(...exerciseCountData.map(e => e.y)) || 1;

    // Total number of exercises in date period
    const totalExerciseCount = exerciseCountData.reduce(
      (total, count) => total + count.y,
      0
    );

    return {
      exerciseCountData,
      exerciseCountMax,
      totalExerciseCount
    };
  }

  getDateCounts(exercises: ExerciseDefinition[]) {
    const dateLimit = this.state.dateLimit;

    // Get number of exercise session per day during date period
    const dateHash: any = {};
    exercises.forEach((def: ExerciseDefinition) => {
      const validSessions = def.history.filter(e =>
        isAfter(e.date, subDays(Date.now(), dateLimit))
      );
      return validSessions.forEach((e: Exercise) => {
        const formattedDate = format(e.date, "DD/MM/YYYY");
        dateHash[formattedDate] = {
          date: new Date(e.date),
          counts: !Boolean(dateHash[formattedDate])
            ? 1
            : dateHash[formattedDate].counts + 1
        };
      });
    });

    // Convert hash to graph data
    const dateCountData = Object.keys(dateHash)
      .map(key => ({
        x: dateHash[key].date,
        y: dateHash[key].counts
      }))
      // Sort chronologically
      .sort((a, b) => (isAfter(a.x, b.x) ? 1 : -1));

    return {
      dateCountData
    };
  }

  getExerciseProgress(exercises: ExerciseDefinition[]) {
    const dateLimit = this.state.dateLimit;

    const exerciseProgressData: {
      x: string;
      y: number;
      data: any;
      label: string | null;
    }[] = [];

    exercises.reverse().forEach((def: ExerciseDefinition) => {
      // Progess is considered here as:
      // the delta of the average session net total within date range
      // minus the earliest session net total within date range
      const validSessions = def.history.filter(e =>
        isAfter(e.date, subDays(Date.now(), dateLimit))
      );
      if (validSessions.length > 1) {
        const isComposite = isCompositeExercise(def.type);
        const earliestSession: Exercise = validSessions[0];
        const latestSession: Exercise = validSessions[validSessions.length - 1];
        const earliestNetTotal = getNetTotalFromSets(
          earliestSession.sets,
          isComposite
        );
        let averageNetTotal = 0;
        validSessions.map(
          e => (averageNetTotal += getNetTotalFromSets(e.sets, isComposite))
        );
        averageNetTotal = averageNetTotal / validSessions.length;

        const delta = averageNetTotal - earliestNetTotal;
        let percentDifference =
          (delta / Math.min(earliestNetTotal, averageNetTotal)) * 100;

        if (!isFinite(percentDifference) || isNaN(percentDifference)) {
          // Fallback to 0 in edge cases
          percentDifference = 0;
        }
        exerciseProgressData.push({
          x: this.chartSettings.clipLabel(def.title),
          y: percentDifference,
          label: def.title,
          data: {
            earliestSession,
            latestSession
          }
        });
      }
    });
    exerciseProgressData.sort(this.sortByY);
    const exerciseProgressMax = Math.max(...exerciseProgressData.map(d => d.y));

    return {
      exerciseProgressData,
      exerciseProgressMax
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

  renderDateCountChart(dateCountData: any) {
    const theme = this.props.theme;
    return (
      <VictoryChart
        {...this.chartSettings.chart}
        animate={false}
        padding={{ ...this.chartSettings.chart.padding, top: 50 }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => format(d.x, "DD/MM/YYYY")}
            labelComponent={<VictoryTooltip {...this.chartSettings.toolTip} />}
          />
        }
      >
        <VictoryAxis
          {...this.chartSettings.axis}
          tickFormat={tick => format(tick, "DD/MM/YYYY")}
          tickLabelComponent={<VictoryLabel {...this.chartSettings.label} />}
        />
        <VictoryAxis
          {...this.chartSettings.axis}
          dependentAxis
          tickLabelComponent={<VictoryLabel {...this.chartSettings.label} />}
        />
        <VictoryArea
          animate={{
            duration: 1000
          }}
          data={dateCountData}
          style={{
            data: {
              stroke: theme.palette.primary.main,
              fill: transparentize(theme.palette.primary.main, 0.2)
            }
          }}
        />
      </VictoryChart>
    );
  }

  renderMuscleDropdown() {
    const { selectedMuscleGroup } = this.state;
    const options = Object.keys(MuscleGroup).map((key: any) => ({
      id: key,
      value: key,
      label: MuscleGroup[key]
    }));
    return (
      <Select
        label="Filter by Muscle Group"
        options={options}
        onChange={this.updateMuscleGroup}
        value={selectedMuscleGroup}
      />
    );
  }

  renderExerciseCountChart(exerciseCountData: any, exerciseCountMax: number) {
    const { classes, width } = this.props;
    return (
      <section className={classes.exerciseChart}>
        <BaseChart config={this.chartSettings}>
          <VictoryBar
            labelComponent={
              isMobile(width) ? (
                <VictoryTooltip {...this.chartSettings.toolTip} />
              ) : (
                <VictoryLabel />
              )
            }
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

  renderExerciseProgressChart(
    exerciseProgressData: any,
    exerciseProgressMax: number
  ) {
    const classes = this.props.classes;
    return (
      <section className={classes.exerciseChart}>
        <VictoryChart {...this.chartSettings.chart}>
          <VictoryAxis
            {...this.chartSettings.axis}
            dependentAxis
            tickLabelComponent={<VictoryLabel {...this.chartSettings.label} />}
          />
          <VictoryBar
            labelComponent={
              <NegativeAwareTickLabel {...this.chartSettings.label} />
            }
            style={{
              data: {
                fill: d => lerpColor(PURPLE, PINK, d.y / exerciseProgressMax)
              }
            }}
            data={exerciseProgressData}
          />
        </VictoryChart>
      </section>
    );
  }

  renderMuscleCountChart(muscleCountData: any, maxMuscleCount: number) {
    const { classes, theme, width } = this.props;

    return (
      <section className={classes.exerciseChart}>
        <BaseChart config={this.chartSettings}>
          <VictoryBar
            labelComponent={
              isMobile(width) ? (
                <VictoryTooltip {...this.chartSettings.toolTip} />
              ) : (
                <VictoryLabel />
              )
            }
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
            data={muscleCountData}
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

    const { dateCountData } = this.getDateCounts(selectedExercises);

    const {
      exerciseProgressData: rawExerciseProgressData,
      exerciseProgressMax
    } = this.getExerciseProgress(selectedExercises);

    // Clip exercise progress data
    const maxCols = this.chartSettings.maxColumnCount();
    const exerciseProgressData =
      // ...only clip if number of reports exceed max col count
      rawExerciseProgressData.length > maxCols
        ? [
            // ...include half of the best progress reports
            ...rawExerciseProgressData.slice(0, maxCols / 2),
            // ... and half of the worst progress reports
            ...rawExerciseProgressData.slice(
              rawExerciseProgressData.length - maxCols / 2,
              rawExerciseProgressData.length
            )
          ]
        : rawExerciseProgressData;

    const { muscles, muscleCounts, maxMuscleCount } = this.getMuscleCounts(
      exerciseCountData
    );

    const muscleCountData: { x: string; y: number }[] = Object.keys(
      muscleCounts
    )
      .map(muscle => ({
        x: this.chartSettings.clipLabel(muscle),
        y: muscleCounts[muscle],
        label: isMobile(width) ? muscle : null
      }))
      .sort(this.sortByY)
      .slice(0, this.chartSettings.maxColumnCount());

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
          <OverviewCard
            className={classes.overviewCard}
            stats={[
              {
                label: "Most Frequent Muscle Groups",
                value: this.getOverviewLabel(muscleCountData, (x, y) => {
                  return {
                    x,
                    y: `(x${y})`
                  };
                })
              },
              {
                label: "Most Frequent Exercise",
                value: this.getOverviewLabel(exerciseCountData, (x, y) => ({
                  x,
                  y: `(x${y})`
                }))
              },
              {
                label: "Top Exercise Progress",
                value: this.getOverviewLabel(exerciseProgressData, (x, y) => ({
                  x,
                  y: `(${y.toFixed(2)}%)`
                }))
              },
              {
                label: "Top Exercises per Day",
                value: this.getOverviewLabel(dateCountData, (x, y) => ({
                  x: format(x, "DD/MM/YYYY"),
                  y: `(x${y})`
                }))
              }
            ]}
          />
        </div>
        <Divider className={classes.divider} />
        <Typography align={titleAlignment} variant="h6">
          Muscle Groups
        </Typography>
        <div className={classes.sectionWrapper}>
          <div className={classes.sectionItem}>
            <FullBody
              muscleGroupLevels={maxMuscleCount}
              menuComponent={muscle => this.renderMuscleList(muscle)}
              selected={muscles}
            />
          </div>
          <div className={classes.sectionItem}>
            {this.renderMuscleCountChart(muscleCountData, maxMuscleCount)}
            <Typography align="center" variant="subtitle1">
              Muscle Groups by Frequency
            </Typography>
          </div>
        </div>
        <Divider className={classes.divider} />
        <Typography align={titleAlignment} variant="h6">
          Exercises
        </Typography>
        {this.renderMuscleDropdown()}
        <div className={classes.sectionWrapper}>
          <div className={classes.sectionItem}>
            {this.renderDateCountChart(dateCountData)}
          </div>
          <div className={classes.sectionItem}>
            {this.renderExerciseCountChart(
              exerciseCountData.slice(0, this.chartSettings.maxColumnCount()),
              exerciseCountMax
            )}
            <Typography align="center" variant="subtitle1">
              Exercises by Frequency
            </Typography>
          </div>
          {exerciseProgressData.length > 5 && (
            <div className={classes.sectionItem}>
              {this.renderExerciseProgressChart(
                exerciseProgressData,
                exerciseProgressMax
              )}
              <Typography align="center" variant="subtitle1">
                Max and Min Exercise Progress
              </Typography>
            </div>
          )}
        </div>
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

const NegativeAwareTickLabel = (props: any) => {
  const { datum, y, dy, scale, ...rest } = props;

  const flipLabel = datum.y < 0;
  return (
    <VictoryLabel
      {...rest}
      datum={datum}
      y={scale.y(0)} // Set y to the svg-space location of the axis
      dy={flipLabel ? -5 : 3}
      dx={flipLabel ? -10 : 10}
      angle={90}
      textAnchor={flipLabel ? "end" : "start"}
    />
  );
};

export default compose(graphql(GetExercises))(
  withStyles(styles, { withTheme: true })(withWidth()(Activity))
);
