import * as React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";
import { Typography } from "@material-ui/core";
import PageTitle, { TextPositiion } from "../components/PageTitle";

const styles = (theme: Theme) => createStyles({});

type State = {};

type Props = {
  classes: Classes;
  data: any;
};

class Exercises extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    console.log("props", this.props);
    const exercises = this.props.data.exerciseDefinitions;
    return (
      <div>
        <PageTitle label="Exercises" position={TextPositiion.left} />
        {exercises &&
          exercises.map((exercise: ExerciseDefinition) => {
            return (
              <div key={exercise.id}>
                <Typography>{exercise.title}</Typography>
              </div>
            );
          })}
      </div>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Exercises));
