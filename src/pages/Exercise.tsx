import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { GetExerciseDefinitionById } from "../constants/queries";
import {
  Typography,
  IconButton,
  withWidth,
  Tabs,
  Tab
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Exercise,
  Set,
  ExerciseDefinition,
  ExerciseType,
  MuscleGroup
} from "../constants/types";
import {
  formatDate,
  formatTime,
  getUnitLabel,
  isCompositeExercise,
  getChildExerciseMuscles,
  getChildExercisDef,
  getNetTotalFromSets
} from "../utils";
import { compareDesc, compareAsc } from "date-fns";
import routes from "../constants/routes";
import {
  Chart,
  ExerciseTypeIcon,
  PageRoot,
  PageTitle,
  LoadingSplash,
  Link
} from "../components";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";
import { FullBody } from "../components/muscles/FullBody";
import { RemoveHistorySession } from "../constants/mutations";
import { isNull } from "util";

const styles = (theme: Theme) =>
  createStyles({
    chartWrapper: {
      display: "flex",
      flexFlow: "row wrap"
    },
    childExList: {
      margin: 0,
      paddingLeft: theme.spacing(2)
    },
    childExListWrapper: {
      margin: theme.spacing(1)
    },
    header: {
      marginBottom: theme.spacing(2)
    },
    historyList: {
      margin: 0,
      padding: 0
    },
    reps: {
      marginRight: theme.spacing(2)
    },
    sessionHeader: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      maxWidth: 400
    },
    sessionItem: {
      marginBottom: theme.spacing(2)
    },
    setItem: {
      display: "flex"
    },
    titleWrapper: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
      textTransform: "capitalize"
    }
  });

enum TabMode {
  NET = "net",
  REPS = "reps",
  SETS = "sets",
  TIME = "time",
  VALUE = "value"
}

type State = {
  tabMode: TabMode;
};

type Props = {
  classes: Classes;
  data: any;
  loading: boolean;
  history: any;
  match: any;
  mutate: any;
  theme: Theme;
  width: Breakpoint;
};

class ExercisePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabMode: TabMode.VALUE
    };
    this.editExercise = this.editExercise.bind(this);
    this.renderExerciseDefinition = this.renderExerciseDefinition.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.renderHistory = this.renderHistory.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  editExercise() {
    const { history, match } = this.props;
    history.push(`${routes.EDIT_EXERCISE(match.params.id).route}`);
  }

  onTabChange(e: any, tabMode: TabMode) {
    this.setState({
      tabMode
    });
  }

  async deleteSession(selectedSessionIndex: number) {
    const confirmation = window.confirm(
      `Are you sure you want to delete session ${selectedSessionIndex}?`
    );
    if (!confirmation || isNull(selectedSessionIndex)) {
      return null;
    }
    const exerciseDefinition = this.props.data.exerciseDefinition;
    const removeSessionId = exerciseDefinition.history[selectedSessionIndex].id;
    try {
      await this.props.mutate({
        variables: {
          definitionId: exerciseDefinition.id,
          exerciseId: removeSessionId
        },
        refetchQueries: [
          {
            query: GetExerciseDefinitionById,
            variables: { exerciseId: exerciseDefinition.id }
          }
        ]
      });
    } catch (error) {
      console.log("Error deleting session", error);
    }
  }

  renderCharts() {
    const { classes, width } = this.props;
    const tabMode = this.state.tabMode;
    const { history, type, unit } = this.props.data.exerciseDefinition;

    const graphData = history
      .sort((a: any, b: any) => compareAsc(a.date, b.date))
      .reduce(
        (data: any, exercise: Exercise, index: number) => {
          const { sets, timeTaken } = exercise;
          // Get average reps
          const reps =
            sets.reduce((total, set) => total + set.reps, 0) / sets.length;
          // Get average value
          const value =
            sets.reduce((total, set) => total + set.value, 0) / sets.length;
          // Get net value (sets * (reps * value))
          const total = getNetTotalFromSets(sets, isCompositeExercise(type));

          // Convert time into millis, then mins, then divide by set count
          const minPerRep = () => {
            // Avoid plotting times which weren't taken
            if (!timeTaken || timeTaken === "1970-01-01T00:00:00.000Z") {
              return null;
            }
            const date = new Date(timeTaken);
            const millis =
              date.getMinutes() * 60000 +
              date.getSeconds() * 1000 +
              date.getMilliseconds();
            const minutes = millis / 60000;
            return (minutes / sets.length).toFixed(2);
          };

          return {
            reps: [...data.reps, { ...exercise, unit, x: index, y: reps }],
            sets: [
              ...data.sets,
              { ...exercise, unit, x: index, y: sets.length }
            ],
            timeTaken: [
              ...data.timeTaken,
              { ...exercise, unit, x: index, y: minPerRep() }
            ],
            total: [...data.total, { ...exercise, unit, x: index, y: total }],
            values: [...data.values, { ...exercise, unit, x: index, y: value }]
          };
        },
        { reps: [], sets: [], timeTaken: [], total: [], values: [] }
      );
    return isMobile(width) ? (
      <div>
        <Tabs
          indicatorColor="primary"
          onChange={this.onTabChange}
          scrollButtons="on"
          value={tabMode}
          variant="scrollable"
        >
          <Tab label={`${unit} (Avg)`} value={TabMode.VALUE} />
          <Tab label={`${unit} (Net)`} value={TabMode.NET} />
          <Tab label="Reps" value={TabMode.REPS} />
          <Tab label="Sets" value={TabMode.SETS} />
          <Tab label="Min / Set" value={TabMode.TIME} />
        </Tabs>
        {tabMode === TabMode.REPS && (
          <Chart label="Reps" mobile data={graphData.reps} />
        )}
        {tabMode === TabMode.NET && (
          <Chart label="Net" mobile data={graphData.total} />
        )}
        {tabMode === TabMode.VALUE && (
          <Chart label="Values" mobile data={graphData.values} />
        )}
        {tabMode === TabMode.SETS && (
          <Chart label="Sets" mobile data={graphData.sets} />
        )}
        {tabMode === TabMode.TIME && (
          <Chart label="Min / Set" mobile data={graphData.timeTaken} />
        )}
      </div>
    ) : (
      <div className={classes.chartWrapper}>
        <Chart label={`${getUnitLabel(unit)} (Avg)`} data={graphData.values} />
        <Chart label={`${getUnitLabel(unit)} (Net)`} data={graphData.total} />
        <Chart label="Sets" data={graphData.sets} />
        <Chart label="Min / Set" data={graphData.timeTaken} />
      </div>
    );
  }

  renderHistory() {
    const classes = this.props.classes;
    const {
      childExercises,
      history,
      type,
      unit
    } = this.props.data.exerciseDefinition;
    return (
      <Fragment>
        {history
          .sort((a: Exercise, b: Exercise) => compareDesc(a.date, b.date))
          .map(({ date, sets, timeTaken }: Exercise, index: number) => {
            return (
              <div className={classes.sessionItem} key={date}>
                <div className={classes.sessionHeader}>
                  <Typography color="textSecondary">
                    {formatDate(date, true)}
                  </Typography>
                  <Typography color="textSecondary">{`Time: ${formatTime(
                    timeTaken
                  )}`}</Typography>
                  {/* e => this.openSessionMenu(e, index) */}
                  <IconButton onClick={e => this.deleteSession(index)}>
                    <DeleteIcon color="disabled" />
                  </IconButton>
                </div>
                <ul className={classes.historyList}>
                  {sets.map(
                    ({ reps, value, exercises }: Set, index: number) => (
                      <li className={classes.setItem} key={index}>
                        <Typography className={classes.reps} color="primary">
                          {`Set ${index + 1}.`}
                        </Typography>
                        {isCompositeExercise(type) && exercises ? (
                          <div>
                            {exercises.map(e => {
                              const childDef = getChildExercisDef(
                                e,
                                childExercises
                              );
                              return (
                                <div className={classes.setItem} key={e.id}>
                                  <Typography className={classes.reps}>
                                    {childDef.title}
                                  </Typography>
                                  <Typography
                                    className={classes.reps}
                                  >{`Reps: ${e.reps}`}</Typography>
                                  <Typography>{`Value: ${e.value}${
                                    e.unit
                                  }`}</Typography>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={classes.setItem}>
                            <Typography
                              className={classes.reps}
                            >{`Reps: ${reps}`}</Typography>
                            <Typography>{`Value: ${value}${unit}`}</Typography>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            );
          })}
      </Fragment>
    );
  }

  renderExerciseDefinition(exerciseDefinition: ExerciseDefinition) {
    const classes = this.props.classes;
    const {
      childExercises,
      history,
      primaryMuscleGroup,
      title,
      type = ExerciseType.STANDARD
    } = exerciseDefinition;

    // Get muscles based on child exercises if applicable
    const muscles: MuscleGroup[] = isCompositeExercise(type)
      ? childExercises
        ? getChildExerciseMuscles(childExercises)
        : []
      : primaryMuscleGroup;
    return (
      <div>
        <PageTitle
          label="Exercise"
          breadcrumb={{
            label: `Back to ${routes.EXERCISES.label}`,
            url: routes.EXERCISES.route
          }}
        />
        <div className={classes.titleWrapper}>
          <Typography component="h1" variant="h2">
            {title}
          </Typography>
          <IconButton onClick={this.editExercise}>
            <EditIcon />
          </IconButton>
        </div>
        <section>
          <ExerciseTypeIcon type={type} />
          {isCompositeExercise(type) && childExercises && (
            <section className={classes.childExListWrapper}>
              <Typography variant="subtitle1">Comprised of</Typography>
              <ul className={classes.childExList}>
                {childExercises.map(exercise => (
                  <li key={exercise.id}>
                    <Link
                      label={exercise.title}
                      url={routes.EXERCISE(exercise.id).route}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
        {primaryMuscleGroup && <FullBody selected={muscles} />}
        {history.length > 1 && this.renderCharts()}
        <div className={classes.header}>
          <Typography variant="h6">History</Typography>
          <Typography>{`Sessions: ${history.length}`}</Typography>
        </div>
        {history.length > 0 ? (
          this.renderHistory()
        ) : (
          <Typography>Exercise has not been attempted</Typography>
        )}
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const { exerciseDefinition, loading } = data;

    return (
      <PageRoot>
        {loading ? (
          <LoadingSplash />
        ) : exerciseDefinition ? (
          this.renderExerciseDefinition(exerciseDefinition)
        ) : (
          <div>
            <PageTitle label="Oops!" />
            <Typography color="error">
              Sorry, this exercise cannot be found. It may have been deleted or
              created by a different user.
            </Typography>
          </div>
        )}
      </PageRoot>
    );
  }
}

export default compose(
  graphql(RemoveHistorySession),
  graphql(GetExerciseDefinitionById, {
    options: (props: any) => ({
      variables: { exerciseId: props.match.params.id }
    })
  })
)(withWidth()(withStyles(styles, { withTheme: true })(ExercisePage)));
