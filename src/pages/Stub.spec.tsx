import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Stub from "./Stub";
import renderer from "react-test-renderer";

describe("Page: Stub", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Stub" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Stub pageName="Stub" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
