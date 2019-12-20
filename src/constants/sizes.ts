import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

const TABLET_SIZES = new Set(["xs", "sm", "md"]);

export const isMobile = (width: Breakpoint) => width === "xs";
export const isTablet = (width: Breakpoint) => TABLET_SIZES.has(width);
