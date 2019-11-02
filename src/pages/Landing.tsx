import * as React from "react";
import { RouteChildrenProps } from "react-router";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { Button, Divider } from "@material-ui/core";
import routes from "../constants/routes";
import { RobicLogo, PageTitle } from "../components";
import { LIGHT_GRADIENT, PURPLE_GRADIENT, PURPLE } from "../constants/colors";
import classnames from "../utils";

const styles = (theme: Theme) =>
  createStyles({
    doneButton: {
      marginTop: theme.spacing(2),
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.main
    },
    headerSection: {
      alignItems: "center",
      display: "flex",
      flexFlow: "column",
      marginBottom: theme.spacing(4),
      padding: theme.spacing(4)
    },
    footerContent: {
      alignItems: "center",
      display: "flex",
      flexFlow: "column",
      justifyContent: "center"
    },
    footerLinks: {
      flexGrow: 1,
      margin: theme.spacing(2),
      width: "100%"
    },
    footerTagline: {
      color: theme.palette.secondary.main,
      marginTop: theme.spacing(2)
    },
    root: {
      alignItems: "center",
      display: "flex",
      flexFlow: "column",
      paddingTop: theme.spacing(8)
    },
    sectionContent: {
      margin: "0 auto",
      maxWidth: theme.breakpoints.values.sm,
      padding: theme.spacing(8),

      [theme.breakpoints.only("xs")]: {
        padding: theme.spacing(4)
      }
    },
    sectionDivider: {
      margin: `${theme.spacing(2)}px 0`
    },
    sectionLight: {
      background: LIGHT_GRADIENT,
      color: theme.palette.primary.main
    },
    sectionPurple: {
      background: PURPLE_GRADIENT,
      color: theme.palette.common.white
    },
    sectionLightDivider: {
      backgroundColor: "white"
    },
    sectionPurpleDivider: {
      backgroundColor: PURPLE
    },
    sectionRoot: {
      marginBottom: theme.spacing(2)
    },
    sectionWrapper: {
      width: "100%"
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
  variant: "purple" | "light";
};

const Section = withStyles(styles)(
  ({ classes, title, content, variant }: SectionProps) => {
    const sectionClasses = classnames(
      classes.sectionRoot,
      variant === "purple" ? classes.sectionPurple : classes.sectionLight
    );
    const dividerClasses = classnames(
      classes.sectionDivider,
      variant === "purple"
        ? classes.sectionLightDivider
        : classes.sectionPurpleDivider
    );
    return (
      <div className={sectionClasses}>
        <section className={classes.sectionContent}>
          <Typography align="center" variant="h6">
            {title}
          </Typography>
          <Divider className={dividerClasses} />
          <Typography>{content}</Typography>
        </section>
      </div>
    );
  }
);

class Landing extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  navigateToScreen(route: string) {
    this.props.history.push(route);
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.root}>
        <section className={classes.headerSection}>
          <RobicLogo size="large" />
          <PageTitle>Everyday exercise data</PageTitle>
          <Typography variant="subtitle1">
            Analytics to help monitor and improve your exercise performance
          </Typography>
          <Button
            className={classes.doneButton}
            variant="contained"
            onClick={() => this.navigateToScreen(routes.LOGIN.route)}
          >
            Get started!
          </Button>
        </section>
        <article className={classes.sectionWrapper}>
          <Section
            variant="purple"
            title="manage exercises"
            content="Create an exercise tailored to your needs. Robic has support for a range of exercise types, including circuit and superset exercises. These can be assigned additional information, such as units and muscle groups for granular analysis."
          />
          <Section
            variant="light"
            title="record your effort"
            content="Simply select from the list of your exercises to get going. Robic allows you to time your exercise while adding set and repetition information. Previous exercise and personal best information are designed to push you to your limits."
          />
          <Section
            variant="purple"
            title="monitor progress"
            content="Over time, Robic will be able to provide you insight into areas you are excelling in, and areas which could do with some improvement. Analytics can also be viewed on a specific exercise or over a period of time."
          />
          <div
            className={classnames(classes.sectionRoot, classes.sectionLight)}
          >
            <section className={classes.sectionContent}>
              <section className={classes.footerContent}>
                <RobicLogo />
                <Typography align="center" className={classes.footerTagline}>
                  Ready to get started?
                </Typography>
                <div className={classes.footerLinks}>
                  <Typography
                    align="center"
                    variant="h6"
                    onClick={() => this.navigateToScreen(routes.LOGIN.route)}
                  >
                    {routes.LOGIN.label}
                  </Typography>
                  <Divider className={classes.sectionDivider} />
                  <Typography
                    align="center"
                    variant="h6"
                    onClick={() => this.navigateToScreen(routes.REGISTER.route)}
                  >
                    {routes.REGISTER.label}
                  </Typography>
                </div>
              </section>
            </section>
          </div>
        </article>
      </main>
    );
  }
}

export default withStyles(styles)(Landing);
