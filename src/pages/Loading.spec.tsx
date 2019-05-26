import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import Loading from "./Loading";
import renderer from "react-test-renderer";

describe("Page: Loading", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Loading" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Loading />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
