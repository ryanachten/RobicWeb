import React, { ReactElement, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot, PageTitle, LoadingSplash } from "../components";
import { FullBody } from "../components/muscles/FullBody";
import { ExerciseDefinition, MuscleGroup } from "../constants/types";
import { isAfter, subDays, getDaysInMonth, getDaysInYear } from "date-fns";
import { Typography, Tabs, Tab } from "@material-ui/core";
import { lerpColor, getNetTotalFromSets, isCompositeExercise } from "../utils";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryContainer,
  VictoryLine,
  VictoryVoronoiContainer
} from "victory";

const styles = (theme: Theme) =>
  createStyles({
    exerciseGrid: {
      display: "flex",
      flexFlow: "row wrap"
    },
    exerciseChart: {
      margin: "0 auto"
    },
    exerciseList: {
      margin: theme.spacing.unit * 2,
      width: "200px"
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
  theme: Theme;
};

const MAX_GRAPH_WIDTH = 1000;
const MAX_GRAPH_HEIGHT = 500;
const ANIMATION_DURATION = 1000;

class Activity extends React.Component<Props, State> {
  sortExercisesAlphabetically: (
    a: ExerciseDefinition,
    b: ExerciseDefinition
  ) => number;
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
    const exerciseCountData: { x: string; y: number }[] = exercises
      .sort(this.sortExercisesAlphabetically)
      .reverse()
      .map((def: ExerciseDefinition) => {
        const validSessions = def.history.filter(e =>
          isAfter(e.date, subDays(Date.now(), dateLimit))
        );
        return {
          x:
            // Clip exercise graph labels to 9 characters
            def.title.length > 9 ? `${def.title.slice(0, 6)}...` : def.title,
          y: validSessions.length
        };
      });
    const exerciseCountMax =
      (exerciseCountData && Math.max(...exerciseCountData.map(e => e.y))) || 1;
    return {
      exerciseCountData,
      exerciseCountMax
    };
  }

  getTotalMuscles(exercises: ExerciseDefinition[]) {
    // Total muscle groups reduced from selected exercises
    return exercises.reduce(
      (total: MuscleGroup[], { primaryMuscleGroup }: ExerciseDefinition) => {
        return primaryMuscleGroup
          ? [...total, ...primaryMuscleGroup]
          : [...total];
      },
      []
    );
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

  renderExerciseCountChart() {
    const { classes, theme } = this.props;
    const { selectedExercises: exercises } = this.state;
    // Get number of sessions per exercise within the active date range
    const { exerciseCountData, exerciseCountMax } = this.getExerciseCounts(
      exercises
    );

    return (
      <section className={classes.exerciseChart}>
        <VictoryChart
          padding={{ left: 70, right: 50, bottom: 50, top: 50 }}
          height={MAX_GRAPH_HEIGHT}
          width={
            window.screen.width > MAX_GRAPH_WIDTH
              ? MAX_GRAPH_WIDTH
              : window.screen.width
          }
          theme={VictoryTheme.material}
          domainPadding={10}
          containerComponent={<VictoryContainer responsive={false} />}
          animate={{ duration: ANIMATION_DURATION }}
        >
          <VictoryAxis tickLabelComponent={<VictoryLabel />} />
          <VictoryAxis dependentAxis tickLabelComponent={<VictoryLabel />} />
          <VictoryBar
            horizontal={true}
            style={{
              data: {
                fill: d =>
                  lerpColor(
                    theme.palette.primary.light,
                    theme.palette.secondary.light,
                    d.y / exerciseCountMax
                  )
              }
            }}
            data={exerciseCountData}
          />
        </VictoryChart>
      </section>
    );
  }

  renderPersonalBestChart() {
    const { theme } = this.props;
    const { dateLimit, selectedExercises: exercises } = this.state;
    const exerciseBests = exercises.map(
      (
        def: ExerciseDefinition
      ): { label: string; fill: string; data: { x: Date; y: number }[] } => {
        const composite = isCompositeExercise(def.type);
        const data = def.history.map(h => ({
          x: new Date(h.date),
          y: getNetTotalFromSets(h.sets, composite)
        }));
        const max = Math.max(...data.map(d => d.y));
        const normalisedData = data.map(d => {
          return {
            title: def.title,
            x: d.x,
            y: (d.y / max) * 100 || 0 //Fallback to 0 to handle NaN
          };
        });
        // Line color is dictated by the last exercise session
        const fillValue = normalisedData[normalisedData.length - 1].y / 100;
        return {
          label: def.title,
          data: normalisedData,
          fill: lerpColor(
            theme.palette.primary.light,
            theme.palette.secondary.light,
            fillValue
          )
        };
      }
    );
    return (
      <VictoryChart
        height={MAX_GRAPH_HEIGHT}
        width={
          window.screen.width > MAX_GRAPH_WIDTH
            ? MAX_GRAPH_WIDTH
            : window.screen.width
        }
        containerComponent={
          <VictoryVoronoiContainer responsive={false} labels={d => d.title} />
        }
        theme={VictoryTheme.material}
      >
        {exerciseBests.map((best: any) => (
          <VictoryLine
            animate={{ duration: ANIMATION_DURATION }}
            domain={{
              x: [
                new Date(subDays(Date.now(), dateLimit)),
                new Date(Date.now())
              ]
            }}
            key={best.label}
            data={best.data}
            style={{
              data: { stroke: best.fill }
            }}
          />
        ))}
      </VictoryChart>
    );
  }

  renderCharts() {
    const { dateLimit, selectedExercises, tab } = this.state;
    const muscles = selectedExercises
      ? this.getTotalMuscles(selectedExercises)
      : [];
    return (
      <Fragment>
        <PageTitle label={routes.ACTIVITY.label} />
        <Typography />
        <Tabs
          indicatorColor="primary"
          onChange={(e, tab: TabMode) => this.updateDate(tab)}
          value={tab}
        >
          <Tab label="Weekly" value={TabMode.WEEK} />
          <Tab label="Monthly" value={TabMode.MONTH} />
          <Tab label="Yearly" value={TabMode.YEAR} />
        </Tabs>
        <FullBody
          muscleGroupLevels={dateLimit}
          menuComponent={muscle => this.renderMuscleList(muscle)}
          selected={muscles}
        />
        {this.renderExerciseCountChart()}
        {this.renderPersonalBestChart()}
      </Fragment>
    );
  }

  render() {
    const { data } = this.props;
    const loading = data.loading;
    return (
      <PageRoot>{loading ? <LoadingSplash /> : this.renderCharts()}</PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(
  withStyles(styles, { withTheme: true })(Activity)
);
