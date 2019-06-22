import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { Select } from "./Select";
import renderer from "react-test-renderer";

describe("Component: Select", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Select" });
  });

  const initProps = {
    label: "Testing",
    options: [
      {
        id: "test",
        value: "test",
        label: "test"
      }
    ],
    onChange: jest.fn(),
    value: "test"
  };

  it("renders correctly", () => {
    const tree = renderer.create(<Select {...initProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
