import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { AddExercise } from "../constants/mutations";
import { GetExercises } from "../constants/queries";
import { Classes } from "jss";
import {
  ExerciseDefinition,
  Set,
  Unit,
  SetExercise,
  MuscleGroup,
  ExerciseType
} from "../constants/types";
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Card,
  withWidth
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FilterIcon from "@material-ui/icons/FilterList";
import RemoveIcon from "@material-ui/icons/Remove";
import StartIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import ResetIcon from "@material-ui/icons/Refresh";
import routes from "../constants/routes";
import Stopwatch from "../components/Stopwatch";
import {
  getUnitLabel,
  isCompositeExercise,
  getChildExercisDef,
  isBodyWeight,
  sortAlphabetically,
  getNetTotalFromSets,
  getPbFromExercise
} from "../utils";
import {
  PageRoot,
  Select,
  Link,
  ExerciseTypeIcon,
  InsightCard
} from "../components";
import { isNull, isUndefined } from "util";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { RouteComponentProps, Prompt } from "react-router";
import { isAfter, setHours, setMinutes } from "date-fns";

const styles = (theme: Theme) =>
  createStyles({
    addButton: {
      alignItems: "center",
      backgroundColor: theme.palette.common.white,
      borderRadius: "50%",
      display: "flex",
      height: "48px",
      justifyContent: "center",
      maxWidth: "48px",
      minWidth: "48px"
    },
    addButtonWrapper: {
      display: "flex",
      justifyContent: "center"
    },
    buttonWrapper: {
      alignItems: "center",
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(2),
      maxWidth: theme.breakpoints.values.sm,
      width: "100%"
    },
    iconButton: {
      height: "48px",
      justifyContent: "center",
      minWidth: "48px"
    },
    createExerciseLink: {
      display: "block",
      marginBottom: theme.spacing(2)
    },
    doneButton: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main,
      marginBottom: theme.spacing(4),
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(2),
      maxWidth: theme.breakpoints.values.sm,
      width: "100%"
    },
    exerciseSelect: {
      display: "flex",
      justifyContent: "center"
    },
    exerciseTitle: {
      marginBottom: theme.spacing(3),
      textTransform: "capitalize"
    },
    filterButton: {
      paddingBottom: 0
    },
    filterButtonWrapper: {
      marginTop: theme.spacing(2)
    },
    filterMenu: {
      padding: theme.spacing(2)
    },
    form: {
      display: "flex",
      flexFlow: "row wrap"
    },
    formControl: {
      marginRight: theme.spacing(2),
      width: "150px"
    },
    formControlSelect: {
      textTransform: "capitalize"
    },
    input: {
      padding: theme.spacing(2)
    },
    pbFeedbackWrapper: {
      padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`
    },
    selectTitle: {
      marginRight: theme.spacing(2),
      textAlign: "center"
    },
    selectMessage: {
      marginTop: theme.spacing(10)
    },
    selectWrapper: {
      alignItems: "baseline",
      display: "flex"
    },
    sessionForm: {
      display: "flex",
      flexFlow: "column",
      maxWidth: "100%",
      width: "100%"
    },
    setCard: {
      flexGrow: 1,
      margin: theme.spacing(2),
      maxWidth: "calc(50% - 32px)",
      padding: theme.spacing(2),
      width: "calc(50% - 32px)",

      [theme.breakpoints.down("sm")]: {
        maxWidth: "100%",
        width: "100%"
      }
    },
    setList: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-between",
      marginBottom: theme.spacing(1)
    },
    setWrapper: {
      alignItems: "center",
      display: "flex"
    },
    setExercisesWrapper: {
      alignItems: "center",
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-between"
    },
    timerButton: {
      marginLeft: theme.spacing(2)
    },
    title: {
      overflowX: "hidden",
      overflowY: "hidden",
      textOverflow: "ellipsis"
    }
  });

type State = {
  filteredExercises: ExerciseDefinition[];
  filterMenuAnchor: Element | null;
  filterExerciseType: string;
  filterMuscleGroup: string;
  // Temp* values used for menu state
  filterTempExerciseType: string;
  filterTempMuscleGroup: string;
  selectedExercise: ExerciseDefinition | null;
  sets: Set[];
  timerRunning: boolean;
};

type Props = RouteComponentProps & {
  classes: Classes;
  data: any;
  history: any;
  mutate: any;
  result: any;
  width: Breakpoint;
};

const FILTER_ALL = "all";

class Index extends React.Component<Props, State> {
  stopwatch: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      filteredExercises: [],
      filterMenuAnchor: null,
      filterExerciseType: FILTER_ALL,
      filterMuscleGroup: FILTER_ALL,
      filterTempExerciseType: FILTER_ALL,
      filterTempMuscleGroup: FILTER_ALL,
      selectedExercise: null,
      sets: [], //this will be set on exercise select
      timerRunning: false
    };
    this.addSet = this.addSet.bind(this);
    this.closeFilterMenu = this.closeFilterMenu.bind(this);
    this.renderExerciseFilter = this.renderExerciseFilter.bind(this);
    this.removeSet = this.removeSet.bind(this);
    this.renderSetInputs = this.renderSetInputs.bind(this);
    this.cancelFilter = this.cancelFilter.bind(this);
    this.renderExerciseSelect = this.renderExerciseSelect.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.submitFilter = this.submitFilter.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.openFilterMenu = this.openFilterMenu.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { data, location } = props;
    const queryParamId = location.search.replace("?exercise=", "");
    // If there's a query param and no exercise has been selected
    // we select default exercuse by query param ID
    if (!data.loading && queryParamId && !state.selectedExercise) {
      const selectedExercise = data.exerciseDefinitions.find(
        (e: ExerciseDefinition) => e.id === queryParamId
      );
      // If no exercise is found, we just return the original state
      return selectedExercise ? { ...state, selectedExercise } : { ...state };
    }

    return { ...state };
  }

  addSet() {
    const sets = [...this.state.sets];
    const prevSet = sets[sets.length - 1];
    // Lossful deep copy of sets to prevent mutating state
    const newSet = JSON.parse(JSON.stringify(prevSet));
    sets.push(newSet);
    this.setState({ sets });
  }

  removeSet(index: number) {
    const sets = [...this.state.sets];
    sets.splice(index, 1);
    this.setState({ sets });
  }

  onFieldUpdate(
    set: number,
    field: "reps" | "value",
    value: string,
    exerciseId?: string
  ) {
    const state: any = { ...this.state };
    exerciseId
      ? state.sets[set].exercises.map((e: SetExercise) => {
          if (e.id === exerciseId) {
            return (e[field] = parseFloat(value));
          }
          return undefined;
        })
      : (state.sets[set][field] = value);
    this.setState(state);
  }

  cancelFilter() {
    const { filterExerciseType, filterMuscleGroup } = this.state;
    // Reset temp values to confirmed values
    this.setState({
      filterTempExerciseType: filterExerciseType,
      filterTempMuscleGroup: filterMuscleGroup
    });
  }

  resetFilter() {
    // Reset temp values to initial values
    this.setState({
      filteredExercises: [],
      filterExerciseType: FILTER_ALL,
      filterMuscleGroup: FILTER_ALL,
      filterTempExerciseType: FILTER_ALL,
      filterTempMuscleGroup: FILTER_ALL
    });
  }

  submitFilter() {
    const { filterTempExerciseType, filterTempMuscleGroup } = this.state;
    const exercises: ExerciseDefinition[] = this.props.data.exerciseDefinitions;
    // Do filtering stuff...
    const filterIsInactive =
      filterTempExerciseType === FILTER_ALL &&
      filterTempMuscleGroup === FILTER_ALL;
    // If both filters are set to ALL, just return empty
    const filteredExercises = filterIsInactive
      ? []
      : exercises.filter(e => {
          // ...if only primaryMuscleGroup is filtered, return those which include match
          if (filterTempExerciseType === FILTER_ALL) {
            return e.primaryMuscleGroup.includes(
              filterTempMuscleGroup as MuscleGroup
            );
          }
          // ...if only exercise type is selected, return those with type
          if (filterTempMuscleGroup === FILTER_ALL) {
            return e.type === filterTempExerciseType;
          }
          // ...finally, only return those which match both scenarios
          return (
            e.primaryMuscleGroup.includes(
              filterTempMuscleGroup as MuscleGroup
            ) && e.type === filterTempExerciseType
          );
        });
    // If the query returns no results, reset menu
    const reset = filteredExercises.length === 0;
    this.setState({
      filteredExercises,
      filterMenuAnchor: null, // close menu
      filterExerciseType: reset ? FILTER_ALL : filterTempExerciseType,
      filterMuscleGroup: reset ? FILTER_ALL : filterTempMuscleGroup,
      filterTempExerciseType: reset ? FILTER_ALL : filterTempExerciseType,
      filterTempMuscleGroup: reset ? FILTER_ALL : filterTempMuscleGroup
    });
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();
    const { selectedExercise, sets } = this.state;
    // Prevent empty exercises being added
    if (!selectedExercise || (sets.length === 1 && sets[0].reps === 0)) {
      return null;
    }
    const timeTaken = this.stopwatch.getTime();
    this.stopwatch.stop();
    await this.props.mutate({
      variables: {
        definitionId: selectedExercise.id,
        sets,
        timeTaken
      },
      refetchQueries: [{ query: GetExercises }]
    });
    this.setState({
      selectedExercise: null,
      sets: [],
      timerRunning: false
    });
  }

  onSelectExercise = (e: any) => {
    const exerciseId = e.target.value;
    const exercise: ExerciseDefinition =
      this.props.data.exerciseDefinitions.find(
        (def: ExerciseDefinition) => def.id === exerciseId
      ) || null;

    let set: any = { exercises: [] };
    isCompositeExercise(exercise.type) && exercise.childExercises
      ? // If composite type, we assign assign child exercise to set exercises
        exercise.childExercises.map(e => {
          return set.exercises.push({
            id: e.id,
            reps: 0,
            // Lockdown body weight value to 1
            value: isBodyWeight(e.unit) ? 1 : 0
          });
        })
      : // ...otherwise, we simply assign a rep/value per set
        (set = {
          reps: 0,
          // Lockdown body weight value to 1
          value: isBodyWeight(exercise.unit) ? 1 : 0
        });
    this.setState({
      sets: [set],
      selectedExercise: exercise
    });
  };

  closeFilterMenu() {
    this.cancelFilter();
    this.setState({
      filterMenuAnchor: null
    });
  }

  openFilterMenu(event: any) {
    this.setState({
      filterMenuAnchor: event.currentTarget
    });
  }

  setFilterValue(
    field: "filterTempMuscleGroup" | "filterTempExerciseType",
    value: any
  ) {
    const state: any = { ...this.state };
    state[field] = value;
    this.setState(state);
  }

  toggleTimer() {
    const timerRunning = this.state.timerRunning;
    timerRunning ? this.stopwatch.stop() : this.stopwatch.start();
    this.setState(prevState => ({
      timerRunning: !prevState.timerRunning
    }));
  }

  renderSetInputs(
    index: number,
    reps: number,
    value: number,
    unit?: Unit,
    exerciseId?: string
  ) {
    if (!this.state.selectedExercise) return null;
    const classes = this.props.classes;
    if (!unit) {
      // This would only occur if attempting to access unit on
      // a composite exericse (which doesn't have a unit)
      return console.log(`Error: unit not found on exercise ${exerciseId}`);
    }
    return (
      <div className={classes.setWrapper}>
        <TextField
          label="Reps"
          type="number"
          placeholder="5"
          className={classes.input}
          onChange={event =>
            this.onFieldUpdate(index, "reps", event.target.value, exerciseId)
          }
          value={reps || ""}
        />
        <TextField
          // Prevent user changing body weight value
          disabled={isBodyWeight(unit)}
          label={`${getUnitLabel(unit)} (${unit})`}
          type="number"
          placeholder="5"
          className={classes.input}
          onChange={event =>
            this.onFieldUpdate(index, "value", event.target.value, exerciseId)
          }
          value={value || ""}
        />
      </div>
    );
  }

  renderSetButtons(index: number, sets: Set[]) {
    const classes = this.props.classes;
    return (
      <Fragment>
        {index !== 0 ? (
          <IconButton
            className={classes.iconButton}
            onClick={() => this.removeSet(index)}
          >
            <RemoveIcon color="secondary" />
          </IconButton>
        ) : (
          <div className={classes.iconButton} />
        )}
      </Fragment>
    );
  }

  renderPbFeedback() {
    const { selectedExercise, sets } = this.state;
    const { classes } = this.props;
    if (!selectedExercise || !selectedExercise.history.length) {
      return null;
    }
    // TODO: add support for composite exercises
    const composite = isCompositeExercise(selectedExercise.type);
    if (composite) {
      return null;
    }
    const unit = selectedExercise.unit || "";
    const currentNetValue = getNetTotalFromSets(sets, composite);
    const pb = getPbFromExercise(selectedExercise);
    const pbNetValue = getNetTotalFromSets(pb.sets, composite);
    const delta = pbNetValue - currentNetValue;
    // If over current PB, display success message
    if (currentNetValue > pbNetValue) {
      return (
        <div className={classes.pbFeedbackWrapper}>
          <Typography
            align="center"
            variant="subtitle1"
            color="secondary"
          >{`Congratulations! New personal best ${currentNetValue}${unit}`}</Typography>
          <Typography
            align="center"
            color="textSecondary"
          >{`Previous personal best ${pbNetValue}${unit} (+${Math.abs(
            delta
          )}${unit})`}</Typography>
        </div>
      );
    }
    // Otherwise show delta with value/reps/sets recommendation
    // Sets are based on PB set length
    const setNumber =
      sets.length < pb.sets.length ? pb.sets.length - sets.length : 1;
    // Reps are PB set rep average
    const repAverage =
      pb.sets.reduce((total, set) => total + set.reps, 0) / pb.sets.length;
    // Value is derived from delta based on PB set and rep average
    const value = ((delta + 1) / setNumber / repAverage).toFixed(2);

    return (
      <div className={classes.pbFeedbackWrapper}>
        <Typography align="center" variant="subtitle1">{`${delta +
          1}${unit} until new personal best`}</Typography>
        <Typography
          align="center"
          color="textSecondary"
        >{`${value}${unit} x ${repAverage} reps x ${setNumber} sets`}</Typography>
      </div>
    );
  }

  renderExerciseForm() {
    const { classes } = this.props;
    const { selectedExercise, sets, timerRunning } = this.state;
    if (!selectedExercise) {
      return null;
    }
    const { childExercises, title, type, unit } = selectedExercise;
    const compositeType = isCompositeExercise(type);

    return (
      <form className={classes.sessionForm} onSubmit={this.submitForm}>
        <div className={classes.exerciseTitle}>
          <Typography className={classes.title} variant="h5">
            {title}
          </Typography>
          <ExerciseTypeIcon type={type} />
        </div>
        <InsightCard exerciseDefinition={selectedExercise} showToggles />
        <div className={classes.setList}>
          {sets.map((set: Set, index: number) =>
            compositeType && set.exercises ? (
              // Use set exercises for form state if exercise is composite type
              // for each child exercise, we provide an rep / value field
              <div className={classes.setExercisesWrapper} key={index}>
                {set.exercises.map((e: SetExercise, eIndex: number) => {
                  const childDef = getChildExercisDef(e, childExercises);
                  return (
                    <div key={e.id}>
                      <Typography>{childDef.title}</Typography>
                      {this.renderSetInputs(
                        index,
                        e.reps,
                        e.value,
                        childDef.unit,
                        e.id
                      )}
                    </div>
                  );
                })}
                {this.renderSetButtons(index, sets)}
              </div>
            ) : (
              // ... if not composite type, just use set rep/value for form state
              <Card className={classes.setCard} key={index}>
                <div className={classes.setWrapper}>
                  {this.renderSetInputs(index, set.reps, set.value, unit)}
                  {this.renderSetButtons(index, sets)}
                </div>
              </Card>
            )
          )}
        </div>
        <div className={classes.addButtonWrapper}>
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={this.addSet}
          >
            <AddIcon color="secondary" />
          </Button>
        </div>
        {this.renderPbFeedback()}
        <div className={classes.buttonWrapper}>
          <Stopwatch ref={(stopwatch: any) => (this.stopwatch = stopwatch)} />
          <IconButton
            className={classes.timerButton}
            onClick={this.toggleTimer}
          >
            {timerRunning ? (
              <PauseIcon color="secondary" />
            ) : (
              <StartIcon color="secondary" />
            )}
          </IconButton>
          {this.stopwatch && !isNull(this.stopwatch.time) && (
            <IconButton
              className={classes.timerButton}
              onClick={() => this.stopwatch.reset()}
            >
              <ResetIcon color="secondary" />
            </IconButton>
          )}
        </div>
        <Button
          className={classes.doneButton}
          color="primary"
          variant="contained"
          type="submit"
        >
          Done
        </Button>
      </form>
    );
  }

  renderExerciseFilter() {
    const {
      filterMenuAnchor,
      filterTempExerciseType,
      filterTempMuscleGroup
    } = this.state;
    const { classes } = this.props;
    const noValue = {
      id: FILTER_ALL,
      label: "All",
      value: FILTER_ALL
    };
    const primaryMuscleOptions = [
      noValue,
      ...Object.keys(MuscleGroup).map((key: any) => {
        return {
          id: MuscleGroup[key],
          label: MuscleGroup[key],
          value: MuscleGroup[key]
        };
      })
    ];
    const exerciseTypeOptions = [
      noValue,
      ...Object.keys(ExerciseType).map((key: any) => {
        return {
          id: ExerciseType[key],
          label: ExerciseType[key],
          value: ExerciseType[key]
        };
      })
    ];
    return (
      <Menu
        id="exercise-filter"
        anchorEl={filterMenuAnchor}
        classes={{
          paper: classes.filterMenu
        }}
        keepMounted
        open={Boolean(filterMenuAnchor)}
        onClose={this.closeFilterMenu}
      >
        <Typography align="center" variant="subtitle1">
          Filter exercises
        </Typography>
        <MenuItem>
          <Select
            label="Muscle group"
            options={primaryMuscleOptions}
            value={filterTempMuscleGroup}
            onChange={e =>
              this.setFilterValue("filterTempMuscleGroup", e.target.value)
            }
          />
        </MenuItem>
        <MenuItem>
          <Select
            label="Exercise type"
            options={exerciseTypeOptions}
            value={filterTempExerciseType}
            onChange={e =>
              this.setFilterValue("filterTempExerciseType", e.target.value)
            }
          />
        </MenuItem>
        <div className={classes.filterButtonWrapper}>
          <Button
            color="primary"
            onClick={this.submitFilter}
            variant="contained"
          >
            Filter
          </Button>
          <Button onClick={this.resetFilter}>Reset</Button>
        </div>
      </Menu>
    );
  }

  renderExerciseSelect(exercises: ExerciseDefinition[]) {
    const { classes } = this.props;
    const {
      filteredExercises,
      filterMenuAnchor,
      selectedExercise
    } = this.state;
    return (
      <div className={classes.selectWrapper}>
        <Select
          label="Exercise"
          className={classes.formControl}
          classes={{
            MenuItem: classes.formControlSelect,
            MuiSelect: classes.formControlSelect
          }}
          onChange={this.onSelectExercise}
          options={exercises
            .sort(sortAlphabetically)
            .map(({ id, title }: ExerciseDefinition) => ({
              id,
              value: id,
              label: title
            }))}
          value={selectedExercise ? selectedExercise.id : ""}
        />
        <IconButton
          aria-controls="exercise-filter"
          aria-haspopup="true"
          onClick={this.openFilterMenu}
        >
          <FilterIcon
            className={classes.filterButton}
            color={filteredExercises.length > 0 ? "primary" : "inherit"}
          />
        </IconButton>
        {Boolean(filterMenuAnchor) && this.renderExerciseFilter()}
      </div>
    );
  }

  render() {
    const { classes, data, result } = this.props;
    const { filteredExercises, selectedExercise, sets } = this.state;
    const { exerciseDefinitions, loading } = data;
    const exercises =
      filteredExercises.length > 0 ? filteredExercises : exerciseDefinitions;
    const noExercises = !loading && exercises.length === 0;

    // Block navigation if in progress
    const exerciseInProgress: boolean =
      // Exercise considered in progress when:
      !isUndefined(sets[0]) &&
      // ...first reps value has been set
      (Boolean(sets[0].reps) ||
        // ...or first child exercise reps value has been set
        (!isUndefined(sets[0].exercises) &&
          Boolean(sets[0].exercises[0].reps)));

    return (
      <PageRoot
        actionPanel={{
          title: `Good ${
            isAfter(Date.now(), setMinutes(setHours(Date.now(), 12), 0))
              ? "Evening"
              : "Morning"
          }!`,
          tagline: "Select an exercise to get started",
          children: !noExercises ? (
            <Fragment>
              <Prompt
                when={exerciseInProgress}
                message="Are you sure you want to discard your current session?"
              />
              <div className={classes.exerciseSelect}>
                {exercises && this.renderExerciseSelect(exercises)}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Link
                className={classes.createExerciseLink}
                label="Create Exercise"
                url={routes.NEW_EXERCISE.route}
              />
              <Typography>
                Looks like you don't have any exercises yet
              </Typography>
            </Fragment>
          )
        }}
        containerWidth="md"
        loading={loading}
        error={result.error}
      >
        {selectedExercise && this.renderExerciseForm()}
      </PageRoot>
    );
  }
}

const styled = withStyles(styles)(withWidth()(Index));

export default compose(graphql(GetExercises), graphql(AddExercise))(styled);
