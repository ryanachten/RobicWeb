import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import SearchIcon from "@material-ui/icons/Search";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";
import { Typography, TextField } from "@material-ui/core";
import routes from "../constants/routes";
import { formatDate } from "../utils";
import { compareDesc } from "date-fns";
import { Link, PageRoot, PageTitle, LoadingSplash } from "../components";

const styles = (theme: Theme) =>
  createStyles({
    createLink: {
      marginRight: theme.spacing.unit * 4
    },
    exerciseList: {
      padding: 0
    },
    exerciseTitle: {
      cursor: "pointer",
      listStyle: "none",
      marginBottom: theme.spacing.unit,
      [theme.breakpoints.only("xs")]: {
        wordBreak: "break-all"
      }
    },
    exerciseDate: {
      marginLeft: theme.spacing.unit / 2
    },
    header: {
      alignItems: "baseline",
      display: "flex",
      flexFlow: "row wrap",
      marginBottom: theme.spacing.unit * 4
    },
    search: {
      alignItems: "baseline",
      display: "flex"
    }
  });

type State = {
  exercises: ExerciseDefinition[];
  search: string;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
};

class Exercises extends React.Component<Props, State> {
  compareDates: (a: ExerciseDefinition, b: ExerciseDefinition) => number;
  constructor(props: Props) {
    super(props);
    this.state = {
      exercises: [],
      search: ""
    };
    this.navigateToExercise = this.navigateToExercise.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);

    this.compareDates = (a: ExerciseDefinition, b: ExerciseDefinition) => {
      const a_latestSession =
        a.history.length > 0
          ? a.history[a.history.length - 1].date
          : new Date(0);
      const b_latestSession =
        b.history.length > 0
          ? b.history[b.history.length - 1].date
          : new Date(0);
      return compareDesc(a_latestSession, b_latestSession);
    };
  }

  componentDidMount() {
    if (!this.props.data.loading) {
      this.setState({
        exercises: this.props.data.exerciseDefinitions,
        search: ""
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.setState({
        exercises: this.props.data.exerciseDefinitions,
        search: ""
      });
    }
  }

  onUpdateSearch(e: any) {
    const search = e.target.value;
    const exercises = this.props.data.exerciseDefinitions;
    const results = exercises.filter((exercise: ExerciseDefinition) =>
      exercise.title.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({
      search,
      exercises: results
    });
  }

  navigateToExercise(exercise: ExerciseDefinition) {
    this.props.history.push(routes.EXERCISE(exercise.id, exercise.title).route);
  }

  renderExercise(exercise: ExerciseDefinition) {
    const classes = this.props.classes;
    const formattedDate: string | null =
      exercise.history.length > 0
        ? formatDate(exercise.history[exercise.history.length - 1].date, true)
        : null;
    return (
      <li className={classes.exerciseTitle} key={exercise.id}>
        <Typography
          onClick={() => this.navigateToExercise(exercise)}
          variant="h2"
        >
          {exercise.title}
        </Typography>
        {formattedDate && (
          <Typography
            className={classes.exerciseDate}
          >{`Last completed ${formattedDate}`}</Typography>
        )}
      </li>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { exercises, search } = this.state;
    const { loading } = data;
    return (
      <PageRoot>
        {loading ? (
          <LoadingSplash />
        ) : (
          <Fragment>
            <PageTitle label="Exercises" />
            <div className={classes.header}>
              <Link
                className={classes.createLink}
                label={routes.NEW_EXERCISE.label}
                url={routes.NEW_EXERCISE.route}
              />
              <div className={classes.search}>
                <TextField
                  label="Search"
                  onChange={this.onUpdateSearch}
                  value={search}
                />
                <SearchIcon />
              </div>
            </div>
            <ul className={classes.exerciseList}>
              {exercises.length > 0 ? (
                exercises
                  .sort(this.compareDates)
                  .map((exercise: ExerciseDefinition) =>
                    this.renderExercise(exercise)
                  )
              ) : (
                <div>
                  <Typography>
                    {search
                      ? `Oops! No exercises match '${search}'`
                      : "Looks like you don't have any exercises yet"}
                  </Typography>
                </div>
              )}
            </ul>
          </Fragment>
        )}
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(withStyles(styles)(Exercises));
