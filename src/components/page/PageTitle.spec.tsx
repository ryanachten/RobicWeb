import React from "react";
import { createShallow } from "@material-ui/core/test-utils";
import { PageTitle } from "./PageTitle";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";

describe("Component: PageTitle", () => {
  let shallow: any;

  beforeEach(() => {
    shallow = createShallow({ untilSelector: "Select" });
  });

  const initProps = {
    breadcrumb: {
      label: "Testing",
      url: "/testing"
    },
    label: "Testing"
  };

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PageTitle {...initProps} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
