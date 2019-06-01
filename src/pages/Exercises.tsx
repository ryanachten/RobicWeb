import * as React from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";

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
        {exercises &&
          exercises.map((exercise: ExerciseDefinition) => {
            return (
              <div key={exercise.id}>
                <div>{exercise.title}</div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Exercises));
