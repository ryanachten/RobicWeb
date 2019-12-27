import { decomposeColor } from "@material-ui/core/styles/colorManipulator";
import {
  format,
  distanceInWordsToNow,
  isValid,
  parse,
  isBefore,
  compareDesc
} from "date-fns";
// @ts-ignore
import classnames from "classnames";
import {
  Unit,
  ExerciseType,
  ExerciseDefinition,
  MuscleGroup,
  SetExercise,
  Set
} from "../constants/types";

export default classnames;

export const transparentize = (color: string, alpha: number): string => {
  const rgb: [number, number, number, number?] = decomposeColor(color).values;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};

export const formatDate = (
  originalDate: string,
  relative?: boolean
): string => {
  const date = parse(originalDate);
  if (!isValid(date)) {
    return "invalid date";
  }
  if (relative) {
    return isBefore(date, Date.now())
      ? `${distanceInWordsToNow(date)} ago`
      : `in ${distanceInWordsToNow(date)}`;
  }
  return format(date, "DD/MM/YYYY");
};

export const formatTime = (timeTaken: string) => {
  const date = new Date(timeTaken);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const millis = date.getMilliseconds();
  return `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }:${millis < 10 ? `0${millis}` : millis}`;
};

export const getUnitLabel = (unit: Unit) => {
  switch (unit) {
    case Unit.bodyweight: {
      return "Weight";
    }
    case Unit.kg: {
      return "Weight";
    }
    case Unit.min: {
      return "Time";
    }
    default: {
      return "Weight";
    }
  }
};

// Returns whether or not an exercise type
// is made up of child exercises
export const isCompositeExercise = (type: ExerciseType) =>
  type === ExerciseType.CIRCUIT || type === ExerciseType.SUPERSET;

// Get total muscles groups based on child exercises
export const getChildExerciseMuscles = (childExercises: ExerciseDefinition[]) =>
  childExercises.reduce(
    (total: MuscleGroup[], exercise: ExerciseDefinition) => {
      return exercise.primaryMuscleGroup
        ? [...total, ...exercise.primaryMuscleGroup]
        : total;
    },
    []
  );

export const getChildExercisDef = (
  exercise: SetExercise,
  childExercises?: ExerciseDefinition[]
) => {
  const childDef: any =
    childExercises && childExercises.find(d => d.id === exercise.id);
  if (!childDef) {
    // Probably not possible to hit this condition in reality
    // ... more to satisfy type checking
    return console.log("Error: could not find child exercise definition");
  }
  return childDef;
};

/**
 * A linear interpolator for hexadecimal colors
 * via https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
export const lerpColor = (a: string, b: string, amount: number) => {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
};

export const sortAlphabetically = (
  a: ExerciseDefinition,
  b: ExerciseDefinition
) => (a.title >= b.title ? 1 : -1);

export const compareExerciseDates = (
  a: ExerciseDefinition,
  b: ExerciseDefinition
) => {
  const a_latestSession =
    a.history.length > 0 ? a.history[a.history.length - 1].date : new Date(0);
  const b_latestSession =
    b.history.length > 0 ? b.history[b.history.length - 1].date : new Date(0);
  const res = compareDesc(a_latestSession, b_latestSession);
  if (res !== 0) {
    return res;
  }
  // In the case where dates are the same, sort alphabetically
  return sortAlphabetically(a, b);
};

// Get net value from sets
export const getNetTotalFromSets = (sets: Set[], composite: boolean) => {
  return composite
    ? // If composite, net = exercises ~ (sets * (reps * value))
      sets.reduce((setTotal, set) => {
        if (!set.exercises) return setTotal;
        return (
          setTotal +
          set.exercises.reduce(
            (total, e) =>
              // Exclude non-kg units from composite net-sums
              e.unit === Unit.kg ? total + e.value * e.reps : total,
            0
          )
        );
      }, 0)
    : // If exercise is not a composite, net = (sets * (reps * value))
      sets.reduce((total, set) => total + set.value * set.reps, 0);
};

export const isBodyWeight = (unit?: Unit) => unit === Unit.bodyweight;
