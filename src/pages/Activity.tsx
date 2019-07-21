import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { AddExerciseDefinition } from "../constants/mutations";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot, PageTitle } from "../components";
import ExerciseForm, {
  State as FormFields
} from "../components/inputs/ExerciseForm";

const styles = (theme: Theme) => createStyles({});

type State = {};

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
  }

  render() {
    const { classes } = this.props;
    return (
      <PageRoot>
        <PageTitle label={routes.ACTIVITY.label} />
      </PageRoot>
    );
  }
}

export default compose(graphql(AddExerciseDefinition))(
  withStyles(styles)(Activity)
);
