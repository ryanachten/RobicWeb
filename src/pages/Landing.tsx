import * as React from "react";
import { RouteChildrenProps } from "react-router";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { LOGO_FONT } from "../constants/fonts";
import { Button } from "@material-ui/core";
import routes from "../constants/routes";

const styles = (theme: Theme) =>
  createStyles({
    robicLogo: {
      fontFamily: LOGO_FONT
    },
    root: {
      alignItems: "center",
      display: "flex",
      flexFlow: "column",
      paddingTop: theme.spacing(8)
    },
    sectionRoot: {
      marginBottom: theme.spacing(2),
      maxWidth: theme.breakpoints.values.md
    }
  });

type State = {};

type Props = RouteChildrenProps & {
  classes: Classes;
  mutate: any;
};

type SectionProps = {
  classes: Classes;
  title: string;
  content: string;
};

const Section = withStyles(styles)(
  ({ classes, title, content }: SectionProps) => (
    <section className={classes.sectionRoot}>
      <Typography variant="h6">{title}</Typography>
      <Typography>{content}</Typography>
    </section>
  )
);

class Landing extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.navigateToLogin = this.navigateToLogin.bind(this);
  }

  navigateToLogin() {
    this.props.history.push(routes.LOGIN.route);
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.root}>
        <Typography className={classes.robicLogo} variant="h1">
          robic
        </Typography>
        <article>
          <section className={classes.sectionRoot}>
            <Typography align="center" color="textSecondary" variant="h5">
              exercise analytics to help monitor and improve your performance
            </Typography>
          </section>
          <Section
            title="Create an exercise"
            content="Create an exercise tailored to your needs. Robic has support for a range of exercise types, including circuit and superset exercises. These can be assigned additional information, such as units and muscle groups for granular analysis."
          />
          <Section
            title="Start an exercise"
            content="Simply select from the list of your exercises to get going. Robic allows you to time your exercise while adding set and repetition information. Previous exercise and personal best information are designed to push you to your limits."
          />
          <Section
            title="Monitor progress"
            content="Over time, Robic will be able to provide you insight into areas you are excelling in, and areas which could do with some improvement. Analytics can also be viewed on a specific exercise or over a period of time."
          />
        </article>
        <Button
          color="primary"
          variant="contained"
          onClick={() => this.navigateToLogin()}
        >
          Get started!
        </Button>
      </main>
    );
  }
}

export default withStyles(styles)(Landing);
