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
  Tab,
  Button
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import StartIcon from "@material-ui/icons/PlayArrow";
import {
  Exercise,
  Set,
  ExerciseDefinition,
  MuscleGroup,
  Unit
} from "../constants/types";
import {
  formatDate,
  formatTime,
  getUnitLabel,
  isCompositeExercise,
  getChildExerciseMuscles,
  getChildExercisDef,
  getNetTotalFromSets,
  transparentize
} from "../utils";
import { compareDesc, compareAsc } from "date-fns";
import routes from "../constants/routes";
import {
  Chart,
  ExerciseTypeIcon,
  PageRoot,
  Link,
  ActionPanelProps,
  InsightCard
} from "../components";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";
import { FullBody } from "../components/muscles/FullBody";
import { RemoveHistorySession } from "../constants/mutations";
import { isNull } from "util";
import {
  VictoryLine,
  VictoryTheme,
  VictoryArea,
  VictoryContainer,
  VictoryChart,
  VictoryAxis
} from "victory";

const styles = (theme: Theme) =>
  createStyles({
    chartWrapper: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-around"
    },
    childExList: {
      margin: 0,
      paddingLeft: theme.spacing(2)
    },
    childExListWrapper: {
      margin: theme.spacing(1)
    },
    editIcon: {
      marginRight: theme.spacing(1)
    },
    editWrapper: {
      display: "flex",
      justifyContent: "flex-end"
    },
    header: {
      marginBottom: theme.spacing(2)
    },
    historyList: {
      margin: 0,
      padding: 0
    },
    historyWrapper: {
      boxShadow: `-5px 0 5px -5px ${theme.palette.grey[400]} inset`,
      display: "flex",
      marginBottom: theme.spacing(4),
      overflowX: "auto"
    },
    insightIcon: {
      marginBottom: theme.spacing(4)
    },
    legendIcon: {
      borderRadius: "50%",
      marginRight: theme.spacing(1),
      minHeight: "10px",
      minWidth: "10px"
    },
    legendItem: {
      alignItems: "baseline",
      display: "flex",
      marginRight: theme.spacing(1)
    },
    legendList: {
      display: "flex",
      flexFlow: "row wrap",
      padding: 0
    },
    overviewChart: {
      maxHeight: "500px",
      maxWidth: "1000px",
      width: "100%"
    },
    overviewChartWrapper: {
      alignItems: "center",
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center"
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
      marginRight: theme.spacing(4),
      margin: `${theme.spacing(2)}px 0`,
      minWidth: "300px"
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

const chartSettings = (unit: Unit, theme: Theme) => ({
  NET: {
    label: `${getUnitLabel(unit)} (Net)`,
    stroke: theme.palette.primary.main
  },
  VALUE: {
    label: `${getUnitLabel(unit)} (Avg)`,
    stroke: transparentize(theme.palette.text.primary, 0.6)
  },
  REPS: {
    label: "Reps",
    stroke: transparentize(theme.palette.text.primary, 0.4)
  },
  SETS: {
    label: "Sets",
    stroke: transparentize(theme.palette.text.primary, 0.3)
  },
  TIME: {
    label: "Min / Set",
    stroke: transparentize(theme.palette.secondary.main, 0.5)
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
    this.renderActionPanel = this.renderActionPanel.bind(this);
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
    const { classes, theme, width } = this.props;
    const tabMode = this.state.tabMode;
    const { history, type, unit } = this.props.data.exerciseDefinition;
    const settings: any = chartSettings(unit, theme);
    const graphData = history
      .sort((a: Exercise, b: Exercise) => compareAsc(a.date, b.date))
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
            return parseFloat((minutes / sets.length).toFixed(2));
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

    // Get maxes for relative values
    const repsMax = Math.max(...graphData.reps.map((d: any) => d.y));
    const setsMax = Math.max(...graphData.sets.map((d: any) => d.y));
    const timeTakenMax = Math.max(...graphData.timeTaken.map((d: any) => d.y));
    const totalMax = Math.max(...graphData.total.map((d: any) => d.y));
    const valuesMax = Math.max(...graphData.values.map((d: any) => d.y));

    return (
      <div>
        <div className={classes.overviewChartWrapper}>
          <div>
            <Typography variant="subtitle1">Overview</Typography>
            <ul className={classes.legendList}>
              {Object.keys(settings).map(key => (
                <li key={key} className={classes.legendItem}>
                  <span
                    className={classes.legendIcon}
                    style={{ backgroundColor: settings[key].stroke }}
                  />
                  {settings[key].label}
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.overviewChart}>
            <VictoryChart
              animate={{ duration: 1000 }}
              containerComponent={<VictoryContainer />}
              theme={VictoryTheme.material}
              height={500}
              width={1000}
            >
              <VictoryAxis />
              <VictoryAxis
                dependentAxis
                tickFormat={tick => `${tick * 100}%`}
              />
              <VictoryArea
                data={graphData.total.map((d: any) => d.y / totalMax)}
                style={{
                  data: {
                    stroke: settings.NET.stroke,
                    fill: transparentize(settings.NET.stroke, 0.2)
                  }
                }}
              />
              <VictoryLine
                data={graphData.values.map((d: any) => d.y / valuesMax)}
                style={{
                  data: {
                    stroke: settings.VALUE.stroke
                  }
                }}
              />
              <VictoryLine
                data={graphData.reps.map((d: any) => d.y / repsMax)}
                style={{
                  data: {
                    stroke: settings.REPS.stroke
                  }
                }}
              />
              <VictoryLine
                data={graphData.sets.map((d: any) => d.y / setsMax)}
                style={{
                  data: {
                    stroke: settings.SETS.stroke
                  }
                }}
              />
              <VictoryLine
                data={graphData.timeTaken.map((d: any) => d.y / timeTakenMax)}
                style={{
                  data: {
                    stroke: settings.TIME.stroke,
                    strokeDasharray: "5, 7"
                  }
                }}
              />
            </VictoryChart>
          </div>
        </div>
        {isMobile(width) ? (
          <div>
            <Tabs
              indicatorColor="primary"
              onChange={this.onTabChange}
              scrollButtons="on"
              value={tabMode}
              variant="scrollable"
            >
              <Tab label={settings.VALUE.label} value={TabMode.VALUE} />
              <Tab label={settings.NET.label} value={TabMode.NET} />
              <Tab label={settings.REPS.label} value={TabMode.REPS} />
              <Tab label={settings.SETS.label} value={TabMode.SETS} />
              <Tab label={settings.TIME.label} value={TabMode.TIME} />
            </Tabs>
            {tabMode === TabMode.REPS && (
              <Chart label={settings.REPS.label} mobile data={graphData.reps} />
            )}
            {tabMode === TabMode.NET && (
              <Chart label={settings.NET.label} mobile data={graphData.total} />
            )}
            {tabMode === TabMode.VALUE && (
              <Chart
                label={settings.VALUE.label}
                mobile
                data={graphData.values}
              />
            )}
            {tabMode === TabMode.SETS && (
              <Chart label={settings.SETS.label} mobile data={graphData.sets} />
            )}
            {tabMode === TabMode.TIME && (
              <Chart
                label={settings.TIME.label}
                mobile
                data={graphData.timeTaken}
              />
            )}
          </div>
        ) : (
          <div className={classes.chartWrapper}>
            <Chart
              color={settings.NET.stroke}
              label={settings.NET.label}
              data={graphData.total}
            />
            <Chart
              color={settings.VALUE.stroke}
              label={settings.VALUE.label}
              data={graphData.values}
            />
            <Chart
              color={settings.REPS.stroke}
              label={settings.REPS.label}
              data={graphData.reps}
            />
            <Chart
              color={settings.SETS.stroke}
              label={settings.SETS.label}
              data={graphData.sets}
            />
            <Chart
              color={settings.TIME.stroke}
              label={settings.TIME.label}
              data={graphData.timeTaken}
            />
          </div>
        )}
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
                                  <Typography>{`Value: ${e.value}${e.unit}`}</Typography>
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

  renderActionPanel(exerciseDefinition: ExerciseDefinition): ActionPanelProps {
    const classes = this.props.classes;
    const {
      title,
      childExercises,
      primaryMuscleGroup,
      type
    } = exerciseDefinition;
    // Get muscles based on child exercises if applicable
    const muscles: MuscleGroup[] = isCompositeExercise(type)
      ? childExercises
        ? getChildExerciseMuscles(childExercises)
        : []
      : primaryMuscleGroup;
    return {
      title,
      children: (
        <div>
          <div className={classes.editWrapper}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => this.editExercise()}
            >
              <StartIcon className={classes.editIcon} />
              Start
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => this.editExercise()}
            >
              <EditIcon className={classes.editIcon} />
              Edit
            </Button>
          </div>
          <FullBody selected={muscles} />
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
        </div>
      )
    };
  }

  renderExerciseDefinition(exerciseDefinition: ExerciseDefinition) {
    const classes = this.props.classes;
    const { history } = exerciseDefinition;
    return (
      <div>
        <InsightCard
          className={classes.insightIcon}
          exerciseDefinition={exerciseDefinition}
          showToggles={false}
        />
        {history.length > 1 && this.renderCharts()}
        <div className={classes.header}>
          <Typography variant="h6">History</Typography>
          <Typography>{`Sessions: ${history.length}`}</Typography>
        </div>
        <div className={classes.historyWrapper}>
          {history.length > 0 ? (
            this.renderHistory()
          ) : (
            <Typography>Exercise has not been attempted</Typography>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const { exerciseDefinition, loading, error } = data;
    return (
      <PageRoot
        actionPanel={
          exerciseDefinition && this.renderActionPanel(exerciseDefinition)
        }
        containerWidth="md"
        error={error}
        loading={loading}
      >
        {exerciseDefinition &&
          this.renderExerciseDefinition(exerciseDefinition)}
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
