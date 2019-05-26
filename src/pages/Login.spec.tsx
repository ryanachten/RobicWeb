import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import NakedLogin from "./Login";
import renderer from "react-test-renderer";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "../ApolloClient";

describe("Page: Login", () => {
  let shallow: any;

  const Login = () => (
    <ApolloProvider client={ApolloClient}>
      <NakedLogin />
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

  it("should set auth token and reload on form submission", async () => {
    const token = "fakeToken123";
    const mutateMock = jest.fn().mockImplementation(async () => ({
      data: {
        loginUser: token
      }
    }));
    ApolloClient.mutate = mutateMock;
    const reloadMock = jest.fn();
    location.reload = reloadMock;
    const storageSpy = jest.spyOn(Storage.prototype, "setItem");
    const wrapper = shallow(<Login />);
    const instance = wrapper.instance();
    const email = "test@test.com";
    const password = "123abc";
    instance.onFieldUpdate("email", email);
    instance.onFieldUpdate("password", password);
    await instance.submitForm({
      preventDefault: jest.fn()
    });
    await expect(mutateMock).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith("token", token);
    expect(reloadMock).toHaveBeenCalled();
  });
});
