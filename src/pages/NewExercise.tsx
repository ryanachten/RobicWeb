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

class NewExercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm(fields: FormFields) {
    const { title, unit, primaryMuscleGroup } = fields;
    if (!title || !unit || !primaryMuscleGroup) {
      return this.setState({
        error: "Please complete title, unit and primary muscle group fields"
      });
    }
    try {
      await this.props.mutate({
        variables: {
          title,
          unit,
          primaryMuscleGroup
        },
        refetchQueries: [{ query: GetExercises }]
      });
      this.props.history.push(routes.EXERCISES.route);
    } catch (error) {
      return this.setState({
        error
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <PageRoot>
        <PageTitle
          label={routes.NEW_EXERCISE.label}
          breadcrumb={{
            label: "Back",
            onClick: () => this.props.history.goBack()
          }}
        />
        <ExerciseForm onSubmit={fields => this.submitForm(fields)} />
      </PageRoot>
    );
  }
}

export default compose(graphql(AddExerciseDefinition))(
  withStyles(styles)(NewExercise)
);
