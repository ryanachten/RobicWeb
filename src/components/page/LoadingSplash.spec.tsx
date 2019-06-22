import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { LoadingSplash } from "./LoadingSplash";
import renderer from "react-test-renderer";

describe("Component: LoadingSplash", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "LoadingSplash" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<LoadingSplash />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
