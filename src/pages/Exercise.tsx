import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import { CircularProgress, Typography } from "@material-ui/core";
import PageTitle from "../components/PageTitle";

const styles = (theme: Theme) =>
  createStyles({
    exerciseList: {
      padding: 0
    },
    exerciseTitle: {
      cursor: "pointer",
      listStyle: "none",
      marginBottom: theme.spacing.unit
    },
    root: {
      padding: theme.spacing.unit * 4
    }
  });

type State = {};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
};

class Exercise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, data } = this.props;
    const { exerciseDefinition: exercise, loading } = data;
    return (
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : exercise ? (
          <div>
            <PageTitle label={exercise.title} />
          </div>
        ) : (
          <div>
            <PageTitle label="Oops!" />
            <Typography color="error">
              Sorry, this exercise cannot be found. It may have been deleted or
              created by a different user.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  graphql(GetExerciseDefinitionById, {
    options: (props: any) => ({
      variables: { exerciseId: props.match.params.id }
    })
  })
)(withStyles(styles)(Exercise));
