import { createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import deepPurple from "@material-ui/core/colors/deepPurple";

const theme = createMuiTheme({
  palette: {
    primary: {
      ...deepPurple,
      main: "#8050D0",
      light: "#A199FF"
    },
    secondary: {
      ...orange,
      contrastText: "#fff"
    },
    text: {
      primary: "#4A4A4A"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "lowercase"
      }
    }
  }
});

theme.breakpoints.values.sm = 640;

export default theme;
