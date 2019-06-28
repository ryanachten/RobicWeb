import React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { AddExerciseDefinition } from "../constants/mutations";
import routes from "../constants/routes";
import { GetExercises, GetExerciseDefinitionById } from "../constants/queries";
import { PageRoot, PageTitle, LoadingSplash } from "../components";
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

class EditExercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm(fields: FormFields) {
    const { title, unit } = fields;
    if (!title || !unit) {
      return this.setState({
        error: "Please complete title and unit fields"
      });
    }
    try {
      await this.props.mutate({
        variables: {
          title,
          unit
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
    const { data } = this.props;
    const { exerciseDefinition, loading } = data;
    return (
      <PageRoot>
        <PageTitle
          label={routes.EDIT_EXERCISE().label}
          breadcrumb={{
            label: "Back",
            onClick: () => this.props.history.goBack()
          }}
        />
        {loading ? (
          <LoadingSplash />
        ) : (
          <ExerciseForm
            exerciseDefinition={exerciseDefinition}
            onSubmit={fields => this.submitForm(fields)}
          />
        )}
      </PageRoot>
    );
  }
}

export default compose(
  graphql(AddExerciseDefinition, { name: "addExercise" }),
  graphql(GetExerciseDefinitionById, {
    options: (props: any) => ({
      variables: { exerciseId: props.match.params.id }
    })
  })
)(withStyles(styles)(EditExercise));
