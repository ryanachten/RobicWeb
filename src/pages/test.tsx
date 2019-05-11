import * as React from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";

const styles = (theme: Theme) => createStyles({});

type State = {};

type Props = {
  classes: Classes;
};

class Index extends React.Component<WithStyles<typeof styles>, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div>Meow</div>;
  }
}

export default withStyles(styles)(Index);
