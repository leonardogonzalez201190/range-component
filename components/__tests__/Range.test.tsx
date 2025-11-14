import { render, screen } from "@testing-library/react";
import { Range } from "../Range";

describe("Range component", () => {
  it("renders initial min and max labels", () => {
    render(<Range min={0} max={100} initialMin={10} initialMax={90} />);
    expect(screen.getByText("10$")).toBeInTheDocument();
    expect(screen.getByText("90$")).toBeInTheDocument();
  });
});
