import * as React from "react";
import { RouteChildrenProps } from "react-router";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Classes } from "jss";
import { Button, Divider, withWidth } from "@material-ui/core";
import routes from "../constants/routes";
import { RobicLogo, PageTitle } from "../components";
import { LIGHT_GRADIENT, PURPLE_GRADIENT, PURPLE } from "../constants/colors";
import classnames from "../utils";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isMobile } from "../constants/sizes";

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
    imgSection: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      minHeight: "250px"
    },
    footerContent: {
      alignItems: "center",
      display: "flex",
      flexFlow: "column",
      justifyContent: "center",
      margin: `${theme.spacing(4)}px 0`
    },
    footerLink: {
      "&:hover": {
        cursor: "pointer"
      }
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
      width: "50%",

      [theme.breakpoints.only("xs")]: {
        width: "100%"
      }
    },
    sectionWrapper: {
      display: "flex",
      flexFlow: "row wrap",
      width: "100%",

      [theme.breakpoints.up("lg")]: {
        maxWidth: "80vw"
      }
    }
  });

type State = {};

type Props = RouteChildrenProps & {
  classes: Classes;
  mutate: any;
};

type Order = {
  desktop: number;
  mobile: number;
};

type SectionProps = {
  classes: Classes;
  content: string;
  order: Order;
  title: string;
  variant: "purple" | "light";
  width: Breakpoint;
};

const Section = withWidth()(
  withStyles(styles, { withTheme: true })(
    ({ classes, content, order, title, variant, width }: SectionProps) => {
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
      const flexOrder = isMobile(width) ? order.mobile : order.desktop;
      return (
        <div
          style={{
            order: flexOrder
          }}
          className={sectionClasses}
        >
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
  )
);

type ImgSectionProps = {
  classes: Classes;
  imgUrl: string;
  order: Order;
  width: Breakpoint;
};

const ImgSection = withWidth()(
  withStyles(styles)(({ classes, imgUrl, order, width }: ImgSectionProps) => {
    const flexOrder = isMobile(width) ? order.mobile : order.desktop;
    return (
      <div
        style={{
          backgroundImage: `url(${imgUrl})`,
          order: flexOrder
        }}
        className={classnames(classes.sectionRoot, classes.imgSection)}
      />
    );
  })
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
          <ImgSection
            order={{ desktop: 1, mobile: 1 }}
            imgUrl="https://via.placeholder.com/150"
          />
          <Section
            order={{ desktop: 2, mobile: 2 }}
            variant="purple"
            title="manage exercises"
            content="Create an exercise tailored to your needs. Robic has support for a range of exercise types, including circuit and superset exercises. These can be assigned additional information, such as units and muscle groups for granular analysis."
          />
          <ImgSection
            order={{ desktop: 4, mobile: 3 }}
            imgUrl="https://via.placeholder.com/150"
          />
          <Section
            order={{ desktop: 3, mobile: 4 }}
            variant="light"
            title="record your effort"
            content="Simply select from the list of your exercises to get going. Robic allows you to time your exercise while adding set and repetition information. Previous exercise and personal best information are designed to push you to your limits."
          />
          <ImgSection
            order={{ desktop: 5, mobile: 5 }}
            imgUrl="https://via.placeholder.com/150"
          />
          <Section
            order={{ desktop: 6, mobile: 6 }}
            variant="purple"
            title="monitor progress"
            content="Over time, Robic will be able to provide you insight into areas you are excelling in, and areas which could do with some improvement. Analytics can also be viewed on a specific exercise or over a period of time."
          />
        </article>
        <footer className={classes.footerContent}>
          <RobicLogo />
          <Typography align="center" className={classes.footerTagline}>
            Ready to get started?
          </Typography>
          <div className={classes.footerLinks}>
            <Typography
              align="center"
              color="primary"
              className={classes.footerLink}
              variant="h6"
              onClick={() => this.navigateToScreen(routes.LOGIN.route)}
            >
              {routes.LOGIN.label}
            </Typography>
            <Divider className={classes.sectionDivider} />
            <Typography
              align="center"
              color="primary"
              className={classes.footerLink}
              variant="h6"
              onClick={() => this.navigateToScreen(routes.REGISTER.route)}
            >
              {routes.REGISTER.label}
            </Typography>
          </div>
        </footer>
      </main>
    );
  }
}

export default withStyles(styles)(Landing);
