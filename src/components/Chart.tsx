import React from "react";
import { Classes } from "jss";
import { Typography, Theme, withStyles, createStyles } from "@material-ui/core";
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
  color?: string;
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

const Chart = ({ classes, color, data, label, mobile, theme }: Props) => {
  // Check if all chart y values are the same
  const yAllTheSame = !data.map(d => d.y === data[0].y).includes(false);

  const strokeColor = color || theme.palette.primary.main;

  return (
    <div className={classes.chart}>
      {!mobile && (
        <Typography className={classes.chartLabel} variant="subtitle1">
          {label}
        </Typography>
      )}
      <VictoryChart
        domain={
          // If all y values are the same, we calculate the domain
          // manually to avoid weird Victory calculations
          yAllTheSame
            ? {
                x: [data[0].x, data[data.length - 1].x],
                y: [data[0].y - 1, data[0].y + 1]
              }
            : // ... otherwise, let Victory calculate domain
              undefined
        }
        theme={VictoryTheme.material}
        animate={{ duration: 1000 }}
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
            data: { stroke: strokeColor }
          }}
        />
      </VictoryChart>
    </div>
  );
};

const styled = withStyles(styles, { withTheme: true })(Chart);
export { styled as Chart };
