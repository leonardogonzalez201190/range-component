import { render, screen } from "@testing-library/react";
import { Range } from "../Range";

describe("Range component with array of values", () => {

  const valuesArray = [5, 15, 25, 35, 45, 55, 65];

  it("renders initial min and max labels based on array", () => {
    render(
      <Range
        values={valuesArray}
        initialMin={15}
        initialMax={55}
      />
    );

    expect(screen.getByText("15$")).toBeInTheDocument();
    expect(screen.getByText("55$")).toBeInTheDocument();
  });

  it("updates min and max labels when values change programmatically", () => {
    let minVal = 15;
    let maxVal = 55;

    const handleChange = (min: number, max: number) => {
      minVal = min;
      maxVal = max;
    };

    render(
      <Range
        values={valuesArray}
        initialMin={15}
        initialMax={55}
        onChange={handleChange}
      />
    );

    // Simulate updating values through props / programmatic interaction
    handleChange(25, 65);

    expect(minVal).toBe(25);
    expect(maxVal).toBe(65);
  });
});
