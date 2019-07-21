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
import { isAfter, subDays } from "date-fns";
import { Slide, TextField, Typography } from "@material-ui/core";

const styles = (theme: Theme) => createStyles({});

type State = {
  dateLimit: number;
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
      dateLimit: 7
    };
    this.updateField = this.updateField.bind(this);
  }

  updateField(value: number) {
    this.setState({
      dateLimit: value
    });
  }

  render() {
    const { classes, data } = this.props;
    const dateLimit = this.state.dateLimit;
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
        <TextField
          label="Number of days ago"
          onChange={e => this.updateField(parseFloat(e.target.value))}
          type="number"
          value={dateLimit || ""}
        />
        <FullBody selected={muscles} />
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Activity));
