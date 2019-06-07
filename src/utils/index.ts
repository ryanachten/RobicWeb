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
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return {
    hours: hours < 10 ? `0${hours}` : hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds
  };
};
