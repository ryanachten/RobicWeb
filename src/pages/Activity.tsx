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
import { Typography, Tabs, Tab } from "@material-ui/core";
import { compareExerciseDates } from "../utils";
import { number } from "prop-types";

const styles = (theme: Theme) => createStyles({});

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

    const exercises = this.getCurrentExercises();
    const muscles = exercises ? this.getTotalMuscles(exercises) : [];

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
        {exercises &&
          exercises.map((e: ExerciseDefinition) => {
            return <Typography key={e.id}>{e.title}</Typography>;
          })}
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Activity));
