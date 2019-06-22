import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { PageRoot } from "./PageRoot";
import renderer from "react-test-renderer";

describe("Component: PageRoot", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "PageRoot" });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<PageRoot>Testing</PageRoot>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
