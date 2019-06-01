import {
  decomposeColor,
  convertHexToRGB
} from "@material-ui/core/styles/colorManipulator";
// @ts-ignore
import classnames from "classnames";

export default classnames;

export const transparentize = (color: string, alpha: number): string => {
  const rgb: [number, number, number, number?] = decomposeColor(color).values;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};
