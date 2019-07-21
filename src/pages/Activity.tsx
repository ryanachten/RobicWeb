import React from "react";
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
import {
  isAfter,
  subDays,
  getDaysInMonth,
  getDaysInYear,
  getMonth,
  format
} from "date-fns";
import { Slide, TextField, Typography, Tabs, Tab } from "@material-ui/core";

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
  constructor(props: Props) {
    super(props);
    this.state = {
      dateLimit: 7,
      tab: TabMode.WEEK
    };
    this.updateDate = this.updateDate.bind(this);
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
    console.log("daysAmount", daysAmount);
  }

  render() {
    const { classes, data } = this.props;
    const { dateLimit, tab } = this.state;
    const exercises =
      data.exerciseDefinitions &&
      data.exerciseDefinitions.filter(({ history }: ExerciseDefinition) => {
        return (
          history.length > 0 &&
          isAfter(
            history[history.length - 1].date,
            subDays(Date.now(), dateLimit)
          )
        );
      });
    const muscles = exercises
      ? exercises.reduce(
          (
            total: MuscleGroup[],
            { primaryMuscleGroup }: ExerciseDefinition
          ) => {
            return primaryMuscleGroup
              ? [...total, ...primaryMuscleGroup]
              : [...total];
          },
          []
        )
      : [];
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
          <Tab label={format(Date.now(), "MMMM")} value={TabMode.MONTH} />
          <Tab label="This year" value={TabMode.YEAR} />
        </Tabs>
        <FullBody selected={muscles} />
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Activity));
