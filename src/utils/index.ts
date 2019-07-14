import { decomposeColor } from "@material-ui/core/styles/colorManipulator";
import {
  format,
  distanceInWordsToNow,
  isValid,
  parse,
  isBefore
} from "date-fns";
// @ts-ignore
import classnames from "classnames";
import { Unit, ExerciseType } from "../constants/types";

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
