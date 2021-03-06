import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { AddExerciseDefinition } from "../constants/mutations";
import routes from "../constants/routes";
import { GetExercises } from "../constants/queries";
import { PageRoot } from "../components";
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
  result: any;
};

class NewExercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm(fields: FormFields) {
    const { title, unit, primaryMuscleGroup, type, childExerciseIds } = fields;
    try {
      await this.props.mutate({
        variables: {
          title,
          unit,
          primaryMuscleGroup,
          type,
          childExercises: childExerciseIds
        },
        refetchQueries: [{ query: GetExercises }]
      });
      this.props.history.push(routes.EXERCISES.route);
    } catch (error) {
      // TODO: pass error state to ExerciseForm
    }
  }

  render() {
    const { error, loading } = this.props.result;
    return (
      <PageRoot
        error={error}
        loading={loading}
        actionPanel={{
          title: routes.NEW_EXERCISE.label,
          tagline: "Add exercise details below",
          children: (
            <ExerciseForm onSubmit={(fields: any) => this.submitForm(fields)} />
          )
        }}
      />
    );
  }
}

export default compose(graphql(AddExerciseDefinition))(
  withStyles(styles)(NewExercise)
);
