// Time functionality via https://codepen.io/_Billy_Brown/pen/dbJeh

import * as React from "react";
import { Typography } from "@material-ui/core";

type Props = {
  ref: any;
};

type State = {
  // laps:
  running: boolean;
  time: number | null;
  times: [number, number, number];
};

class Stopwatch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      //   laps: [],
      running: false,
      time: null,
      times: [0, 0, 0]
    };
  }

  public componentDidMount() {
    this.reset();
  }

  public reset() {
    this.setState({
      times: [0, 0, 0]
    });
  }

  public start() {
    let { running, time } = this.state;
    if (!time) time = performance.now();
    if (!running) {
      running = true;
      requestAnimationFrame(this.step.bind(this));
    }
    this.setState({
      time,
      running
    });
  }

  // lap() {
  //   let times = this.times;
  //   li.innerText = this.format(times);
  //   this.results.appendChild(li);
  // }

  public stop() {
    this.setState({
      running: false,
      time: null
    });
  }

  public restart() {
    let { running, time } = this.state;
    if (!time) time = performance.now();
    if (!running) {
      running = true;
      requestAnimationFrame(this.step.bind(this));
    }
    this.setState({
      time,
      running
    });
    this.reset();
  }

  public step(timestamp: number) {
    if (!this.state.running) return;
    this.calculate(timestamp);
    this.setState({
      time: timestamp
    });
    requestAnimationFrame(this.step.bind(this));
  }

  public calculate(timestamp: number) {
    const { time, times } = this.state;
    if (!time) {
      return;
    }
    const diff = timestamp - time;
    // Hundredths of a second are 100 ms
    times[2] += diff / 10;
    // Seconds are 100 hundredths of a second
    if (times[2] >= 100) {
      times[1] += 1;
      times[2] -= 100;
    }
    // Minutes are 60 seconds
    if (times[1] >= 60) {
      times[0] += 1;
      times[1] -= 60;
    }
    this.setState({
      times
    });
  }

  public getTime() {
    const times = this.state.times;
    const date = new Date(0);
    date.setHours(times[0]);
    date.setMinutes(times[1]);
    date.setSeconds(times[2]);
    return date;
  }

  public render() {
    const times = this.state.times;
    return (
      <div style={{ display: "flex" }}>
        <Typography variant="h5" component="p">{`${pad0(
          times[0],
          2
        )}:`}</Typography>
        <Typography variant="h5" component="p">{`${pad0(
          times[1],
          2
        )}:`}</Typography>
        <Typography variant="h5" component="p">{`${pad0(
          Math.floor(times[2]),
          2
        )}`}</Typography>
      </div>
    );
  }
}

function pad0(value: number, count: number) {
  let result = value.toString();
  for (; result.length < count; --count) result = "0" + result;
  return result;
}

export default Stopwatch;
