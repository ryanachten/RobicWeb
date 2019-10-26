import React from "react";
import { Exercise, Unit, ExerciseDefinition } from "../constants/types";
import {
  getNetTotalFromSets,
  formatDate,
  getChildExercisDef,
  formatTime,
  isCompositeExercise
} from "../utils";
import { Classes } from "jss";
import { Typography, Switch, Theme, createStyles } from "@material-ui/core";
import AwardIcon from "@material-ui/icons/Star";
import RecentIcon from "@material-ui/icons/AccessTime";
import TimerIcon from "@material-ui/icons/Timer";
import { LIGHT_CARD } from "../constants/colors";
import { withStyles } from "@material-ui/styles";

const styles = (theme: Theme) =>
  createStyles({
    historyContent: {
      display: "flex",
      flexFlow: "row wrap"
    },
    historyHeader: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(2)
    },
    historyIcon: {
      marginRight: theme.spacing(1)
    },

    historySectionWrapper: {
      display: "flex",
      flexFlow: "row wrap"
    },
    historyTimerWrapper: {
      display: "flex",
      marginTop: theme.spacing(2)
    },
    historyTimerIcon: {
      marginRight: theme.spacing(1)
    },
    historyTitle: {
      marginRight: theme.spacing(2)
    },
    historyWrapper: {
      backgroundColor: LIGHT_CARD,
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(4),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: "500px",
      padding: theme.spacing(2)
    },
    setItem: {
      marginRight: theme.spacing(2)
    },
    switchesWrapper: {
      display: "flex",
      marginBottom: theme.spacing(2)
    },
    switchWrapper: {
      alignItems: "center",
      display: "flex",
      marginRight: theme.spacing(2)
    }
  });

type Props = {
  classes: Classes;
  exerciseDefinition: ExerciseDefinition;
  showToggles: boolean;
};

type State = {
  showPbSession: boolean;
  showRecentSession: boolean;
};

class InsightCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showPbSession: false,
      showRecentSession: false
    };
  }

  toggleSwitch(switchName: "showPbSession" | "showRecentSession") {
    const state: any = { ...this.state };
    state[switchName] = !this.state[switchName];
    this.setState(state);
  }

  renderPersonalBest(
    history: Exercise[],
    composite: boolean,
    unit?: Unit,
    childExercises?: ExerciseDefinition[]
  ) {
    const personalBest = [...history].sort((a: Exercise, b: Exercise) => {
      const a_total = getNetTotalFromSets(a.sets, composite);
      const b_total = getNetTotalFromSets(b.sets, composite);
      return a_total > b_total ? -1 : 1;
    })[0];
    const classes = this.props.classes;
    return (
      <div className={classes.historyWrapper}>
        <div className={classes.historyHeader}>
          <AwardIcon className={classes.historyIcon} color="secondary" />
          <Typography className={classes.historyTitle} variant="subtitle1">
            Personal Best
          </Typography>
          <Typography color="textSecondary">{`${formatDate(
            personalBest.date,
            true
          )}`}</Typography>
        </div>
        <div className={classes.historyContent}>
          {personalBest.sets.map(({ reps, value, exercises }, index) => (
            <div key={index}>
              {composite && childExercises && exercises ? (
                exercises.map(e => {
                  const childDef = getChildExercisDef(e, childExercises);
                  return (
                    <Typography
                      key={e.id}
                      className={classes.setItem}
                    >{`${e.reps} reps x ${e.value} ${childDef.unit}`}</Typography>
                  );
                })
              ) : (
                <Typography
                  className={classes.setItem}
                  color="textSecondary"
                >{`${reps} reps x ${value} ${unit}`}</Typography>
              )}
            </div>
          ))}
        </div>
        <div className={classes.historyTimerWrapper}>
          <TimerIcon className={classes.historyTimerIcon} color="disabled" />
          <Typography className={classes.setItem} color="textSecondary">
            {formatTime(personalBest.timeTaken)}
          </Typography>
        </div>
      </div>
    );
  }

  renderHistory(
    history: Exercise[],
    composite: boolean,
    unit?: Unit,
    childExercises?: ExerciseDefinition[]
  ) {
    const { date, sets, timeTaken } = history[history.length - 1];
    const classes = this.props.classes;
    return (
      <div className={classes.historyWrapper}>
        <div className={classes.historyHeader}>
          <RecentIcon className={classes.historyIcon} color="secondary" />
          <Typography className={classes.historyTitle} variant="subtitle1">
            Last session
          </Typography>
          <Typography color="textSecondary">{`${formatDate(
            date,
            true
          )}`}</Typography>
        </div>
        <div className={classes.historyContent}>
          {sets.map(({ reps, value, exercises }, index) => (
            <div key={index}>
              {composite && childExercises && exercises ? (
                exercises.map(e => {
                  const childDef = getChildExercisDef(e, childExercises);
                  return (
                    <Typography
                      key={e.id}
                      className={classes.setItem}
                      color="textSecondary"
                    >{`${e.reps} reps x ${e.value} ${childDef.unit}`}</Typography>
                  );
                })
              ) : (
                <Typography
                  className={classes.setItem}
                >{`${reps} reps x ${value} ${unit}`}</Typography>
              )}
            </div>
          ))}
        </div>
        <div className={classes.historyTimerWrapper}>
          <TimerIcon className={classes.historyTimerIcon} color="disabled" />
          <Typography className={classes.setItem} color="textSecondary">
            {formatTime(timeTaken)}
          </Typography>
        </div>
      </div>
    );
  }

  render() {
    const { classes, exerciseDefinition, showToggles } = this.props;
    const { showPbSession, showRecentSession } = this.state;
    const { history, type, unit, childExercises } = exerciseDefinition;
    const compositeType = isCompositeExercise(type);
    return (
      <div>
        {showToggles && (
          <div className={classes.switchesWrapper}>
            <div className={classes.switchWrapper}>
              <AwardIcon color="secondary" />
              <Switch
                onChange={() => this.toggleSwitch("showPbSession")}
                checked={showPbSession}
              />
            </div>
            <div className={classes.switchWrapper}>
              <RecentIcon color="secondary" />
              <Switch
                onChange={() => this.toggleSwitch("showRecentSession")}
                checked={showRecentSession}
              />
            </div>
          </div>
        )}
        <div className={classes.historySectionWrapper}>
          {showPbSession ||
            (!showToggles &&
              history &&
              history.length > 0 &&
              this.renderPersonalBest(
                history,
                compositeType,
                unit,
                childExercises
              ))}
          {showRecentSession ||
            (!showToggles &&
              history &&
              history.length > 0 &&
              this.renderHistory(history, compositeType, unit, childExercises))}
        </div>
      </div>
    );
  }
}

const styled = withStyles(styles)(InsightCard);
export { styled as InsightCard };
