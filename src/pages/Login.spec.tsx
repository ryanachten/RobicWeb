import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import NakedLogin from "./Login";
import renderer from "react-test-renderer";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "../ApolloClient";

describe("Page: Login", () => {
  let shallow: any;

  const initProps = () => {
    return {
      mutate: null,
      match: null,
      history: null,
      location: null
    };
  };

  const Login = () => (
    <ApolloProvider client={ApolloClient}>
      <NakedLogin {...initProps} />
    </ApolloProvider>
  );

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Login" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should call update fields properly", () => {
    const wrapper = shallow(<Login />);
    const instance = wrapper.instance();
    expect(instance.state.email).toBe("");
    const input = "testing";
    instance.onFieldUpdate("email", input);
    expect(instance.state.email).toBe(input);
  });
});
