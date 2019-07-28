import React from "react";
import { Classes } from "jss";
import {
  Typography,
  Theme,
  withStyles,
  createStyles,
  withWidth
} from "@material-ui/core";
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine
} from "victory";
import { formatDate, transparentize } from "../utils";

const styles = (theme: Theme) =>
  createStyles({
    chart: {
      maxHeight: "500px",
      maxWidth: "500px"
    },
    chartLabel: {
      textAlign: "center"
    }
  });

type Props = {
  classes: Classes;
  data: {
    x: number;
    y: number;
    [props: string]: any;
  }[];
  label: string;
  mobile?: boolean;
  theme: Theme;
};

const Chart = ({ classes, data, label, mobile, theme }: Props) => {
  return (
    <div className={classes.chart}>
      {!mobile && (
        <Typography className={classes.chartLabel} variant="subtitle1">
          {label}
        </Typography>
      )}
      <VictoryChart
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => formatDate(d.date)}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{
                  fill: theme.palette.common.white,
                  stroke: transparentize(theme.palette.common.black, 0.1)
                }}
                style={{ fill: theme.palette.text.primary }}
              />
            }
          />
        }
      >
        <VictoryLine
          data={data}
          style={{
            data: { stroke: theme.palette.primary.main }
          }}
        />
      </VictoryChart>
    </div>
  );
};

const styled = withStyles(styles, { withTheme: true })(Chart);
export { styled as Chart };
