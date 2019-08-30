import { createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";

const theme = createMuiTheme({
  palette: {
    primary: {
      ...orange,
      contrastText: "#fff"
    },
    secondary: red
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "capitalize"
      }
    }
  }
});

export default theme;
