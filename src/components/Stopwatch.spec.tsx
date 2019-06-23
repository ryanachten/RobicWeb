import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Stopwatch from "./Stopwatch";
import renderer from "react-test-renderer";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "../ApolloClient";

describe("Component: Stopwatch", () => {
  let shallow: any;

  const initProps = {
    ref: jest.fn()
  };

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Stopwatch" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Stopwatch {...initProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should set time and running on start and stop", () => {
    const wrapper = shallow(<Stopwatch {...initProps} />);
    const instance = wrapper.instance();
    const now = 571144.6650000289;
    performance.now = jest.fn().mockImplementation(() => now);
    expect(instance.state.running).toBeFalsy;
    expect(instance.state.time).toBeNull;
    instance.start();
    expect(instance.state.running).toBeTruthy;
    expect(instance.state.time).toBe(now);
    instance.start();
    expect(instance.state.running).toBeFalsy;
    expect(instance.state.time).toBeNull;
  });

  it("should set time on reset", () => {
    const wrapper = shallow(<Stopwatch {...initProps} />);
    const instance = wrapper.instance();
    instance.state.times = [10, 10, 10];
    instance.reset();
    expect(instance.state.times).toEqual([0, 0, 0]);
  });

  it("should set time, running and call reset on restart", () => {
    const wrapper = shallow(<Stopwatch {...initProps} />);
    const instance = wrapper.instance();
    instance.state.running = true;
    instance.state.time = 571144.6650000289;
    const reset = jest.fn();
    instance.reset = reset;
    instance.restart();
    expect(instance.state.running).toBeFalsy;
    expect(instance.state.time).toBeNull;
    expect(reset).toHaveBeenCalled;
  });

  it("should calculate formatted times from timestamp", () => {
    const wrapper = shallow(<Stopwatch {...initProps} />);
    const instance = wrapper.instance();
    instance.state.time = 570000;
    instance.calculate(580000);
    expect(instance.state.times).toEqual([0, 1, 900]);
  });

  it("should set time and call calculate on step", () => {
    const wrapper = shallow(<Stopwatch {...initProps} />);
    const instance = wrapper.instance();
    const calculate = jest.fn();
    const timestamp = 570000;
    instance.calculate = calculate;
    instance.state.running = true;
    instance.step(timestamp);
    expect(calculate).toHaveBeenCalled;
    expect(instance.state.time).toBe(timestamp);
  });
});
