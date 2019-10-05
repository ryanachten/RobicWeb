import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { Classes } from "jss";
import { GetExercises } from "../constants/queries";
import { ExerciseDefinition } from "../constants/types";
import { Typography, TextField, withWidth, Card } from "@material-ui/core";
import routes from "../constants/routes";
import { formatDate, compareExerciseDates } from "../utils";
import {
  Link,
  PageRoot,
  ExerciseTypeIcon,
  BackgroundMode
} from "../components";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";

const styles = (theme: Theme) =>
  createStyles({
    createLink: {
      marginRight: theme.spacing(4)
    },
    createLinkWrapper: {
      display: "flex",
      flexFlow: "row wrap"
    },
    exerciseList: {
      padding: 0
    },
    exerciseCard: {
      padding: theme.spacing(2)
    },
    exerciseItem: {
      cursor: "pointer",
      listStyle: "none",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      maxWidth: theme.breakpoints.values.sm,

      [theme.breakpoints.up("sm")]: {
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    exerciseTitleText: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      textTransform: "capitalize"
    },
    exerciseTitleWrapper: {
      display: "flex"
    },
    exerciseDate: {
      marginRight: theme.spacing(1)
    },
    exerciseDateWrapper: {
      display: "flex",
      flexFlow: "row wrap",
      marginTop: theme.spacing(1)
    },
    header: {
      alignItems: "flex-end",
      display: "flex",
      flexFlow: "row wrap",
      marginBottom: theme.spacing(4)
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
  width: Breakpoint;
};

class Exercises extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      exercises: [],
      search: ""
    };
    this.navigateToExercise = this.navigateToExercise.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
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
    const {
      loading: prevLoading,
      exerciseDefinitions: prevExercises
    } = prevProps.data;
    const {
      loading: curLoading,
      exerciseDefinitions: curExercises
    } = this.props.data;

    const wasLoading = prevLoading && !curLoading;
    const exercisesHaveUpdated =
      curExercises &&
      prevExercises &&
      curExercises.length !== prevExercises.length;

    if (wasLoading || exercisesHaveUpdated) {
      this.setState({
        exercises: curExercises,
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
    const { classes, width } = this.props;
    const formattedDate: string | null =
      exercise.history.length > 0
        ? formatDate(exercise.history[exercise.history.length - 1].date, true)
        : null;
    return (
      <li className={classes.exerciseItem} key={exercise.id}>
        <Card className={classes.exerciseCard}>
          <div className={classes.exerciseTitleWrapper}>
            <ExerciseTypeIcon type={exercise.type} showLabel={false} />
            <Typography
              className={classes.exerciseTitleText}
              onClick={() => this.navigateToExercise(exercise)}
              variant={isMobile(width) ? "h4" : "h3"}
            >
              {exercise.title}
            </Typography>
          </div>
          {formattedDate && (
            <div className={classes.exerciseDateWrapper}>
              <Typography className={classes.exerciseDate}>
                {"Last completed "}
              </Typography>
              <Typography color="primary">{formattedDate}</Typography>
            </div>
          )}
        </Card>
      </li>
    );
  }

  render() {
    const { classes, data } = this.props;
    const { exercises, search } = this.state;
    const { loading, error } = data;

    return (
      <PageRoot
        actionPanel={{
          title: "Exercises",
          children: (
            <Fragment>
              <div className={classes.createLinkWrapper}>
                <AddIcon color="primary" />
                <Link
                  className={classes.createLink}
                  label={routes.NEW_EXERCISE.label}
                  url={routes.NEW_EXERCISE.route}
                />
              </div>
              <div className={classes.search}>
                <TextField
                  label="Search"
                  onChange={this.onUpdateSearch}
                  value={search}
                />
                <SearchIcon />
              </div>
            </Fragment>
          )
        }}
        backgroundMode={BackgroundMode.purple}
        error={error}
        loading={loading}
      >
        <ul className={classes.exerciseList}>
          {exercises.length > 0 ? (
            exercises
              .sort(compareExerciseDates)
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
      </PageRoot>
    );
  }
}

export default compose(graphql(GetExercises))(
  withStyles(styles)(withWidth()(Exercises))
);
