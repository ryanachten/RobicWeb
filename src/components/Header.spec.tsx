import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Header from "./Header";
import renderer from "react-test-renderer";

describe("Component: Header", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Header" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Header />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should call toggleMenu", () => {
    const wrapper = shallow(<Header />);
    const instance = wrapper.instance();
    expect(instance.state.drawerOpen).toBeFalsy;
    instance.toggleMenu();
    expect(instance.state.drawerOpen).toBeTruthy;
    instance.toggleMenu();
    expect(instance.state.drawerOpen).toBeFalsy;
  });
});
