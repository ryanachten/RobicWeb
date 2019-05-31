import { transparentize } from ".";

describe("Utilities", () => {
  it("should return hex and rgb colours in an rgba format", () => {
    // Scenario 1: rgb colours
    expect(transparentize("rgb(255, 255, 255)", 0.5)).toEqual(
      "rgba(255, 255, 255, 0.5)"
    );
    // Scenario 2: hex colours
    expect(transparentize("#fff", 0.5)).toEqual("rgba(255, 255, 255, 0.5)");
  });
});
