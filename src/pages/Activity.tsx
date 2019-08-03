import React, { ReactElement } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot, PageTitle } from "../components";
import { FullBody } from "../components/muscles/FullBody";
import { ExerciseDefinition, MuscleGroup } from "../constants/types";
import { isAfter, subDays, getDaysInMonth, getDaysInYear } from "date-fns";
import { Typography, Tabs, Tab, withTheme } from "@material-ui/core";
import { compareExerciseDates } from "../utils";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryContainer
} from "victory";

const styles = (theme: Theme) =>
  createStyles({
    exerciseGrid: {
      display: "flex",
      flexFlow: "row wrap"
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

class Activity extends React.Component<Props, State> {
  sortExercisesAlphabetically: (
    a: ExerciseDefinition,
    b: ExerciseDefinition
  ) => number;
  constructor(props: Props) {
    super(props);
    this.state = {
      dateLimit: 7,
      tab: TabMode.WEEK
    };
    this.getCurrentExercises = this.getCurrentExercises.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.sortExercisesAlphabetically = (
      a: ExerciseDefinition,
      b: ExerciseDefinition
    ) => (a.title > b.title ? 1 : -1);
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
    this.setState({
      tab,
      dateLimit: daysAmount
    });
  }

  getCurrentExercises() {
    // Selected exercises filtered to those that are within the date range
    const exercises = this.props.data.exerciseDefinitions;
    return (
      exercises &&
      exercises.filter(({ history }: ExerciseDefinition) => {
        return (
          history.length > 0 &&
          isAfter(
            history[history.length - 1].date,
            subDays(Date.now(), this.state.dateLimit)
          )
        );
      })
      // .sort(compareExerciseDates)
    );
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

  renderMuscleList(
    exercises: ExerciseDefinition[],
    muscle: MuscleGroup
  ): ReactElement | null {
    if (!exercises || !muscle) {
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

  render() {
    const { dateLimit, tab } = this.state;
    const { classes, theme } = this.props;
    const exercises = this.getCurrentExercises();
    const muscles = exercises ? this.getTotalMuscles(exercises) : [];

    // Get number of sessions per exercise within the active date range
    const exerciseCountData =
      exercises &&
      exercises
        .sort(this.sortExercisesAlphabetically)
        .map((def: ExerciseDefinition) => {
          const validSessions = def.history.filter(e =>
            isAfter(e.date, subDays(Date.now(), dateLimit))
          );
          return {
            x:
              // Clip exercise graph labels to 10 characters
              def.title.length > 10 ? `${def.title.slice(0, 7)}...` : def.title,
            y: validSessions.length
          };
        });
    console.log("exerciseCountData", exerciseCountData);

    return (
      <PageRoot>
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
          menuComponent={muscle => this.renderMuscleList(exercises, muscle)}
          selected={muscles}
        />
        <VictoryChart
          padding={{ left: 70, right: 50, bottom: 50, top: 50 }}
          height={500}
          // TODO: make width a responsive value
          width={800}
          theme={VictoryTheme.material}
          domainPadding={10}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          <VictoryAxis tickLabelComponent={<VictoryLabel />} />
          <VictoryAxis dependentAxis tickLabelComponent={<VictoryLabel />} />
          <VictoryBar
            horizontal={true}
            style={{ data: { fill: theme.palette.primary.main } }}
            data={exerciseCountData}
          />
        </VictoryChart>
        <section className={classes.exerciseGrid}>
          {exercises &&
            Object.keys(MuscleGroup)
              .sort()
              .map((key: any) => {
                const muscle = MuscleGroup[key] as MuscleGroup;
                const filtered = exercises.filter((e: ExerciseDefinition) =>
                  e.primaryMuscleGroup.includes(muscle)
                );
                return (
                  <div className={classes.exerciseList} key={muscle}>
                    <Typography color="primary" variant="subtitle1">
                      {muscle}
                    </Typography>
                    {filtered.length > 0 ? (
                      filtered.map((e: ExerciseDefinition) => (
                        <Typography key={e.id}>{e.title}</Typography>
                      ))
                    ) : (
                      <Typography color="textSecondary">
                        <em>No exercises</em>
                      </Typography>
                    )}
                  </div>
                );
              })}
        </section>
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(
  withStyles(styles, { withTheme: true })(Activity)
);
