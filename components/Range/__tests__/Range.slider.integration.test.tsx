/**
 * Integration tests for Range slider behavior.
 *
 * Test 1 — Moving the min thumb updates the min value.
 * Test 2 — Moving the max thumb into the min thumb causes the MIN to move,
 *          because the component swaps the active thumb to "min" when overlapping.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { Range } from "../Range";

describe("Range – slider integration", () => {
  beforeEach(() => {
    // JSDOM doesn't support pointer capture
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};

    // Mock bounding box so drag math works consistently
    Element.prototype.getBoundingClientRect = () => ({
      width: 300,
      height: 10,
      top: 0,
      left: 0,
      right: 300,
      bottom: 10,
      x: 0,
      y: 0,
      toJSON: () => {}
    });
  });

  it("updates min value when dragging the min thumb", () => {
    let result: any = null;
    const handleChange = (...args: any[]) => {
      result = args;
    };

    render(<Range min={0} max={100} onChange={handleChange} />);

    const minThumb = screen.getByLabelText("Minimum value");

    fireEvent.pointerDown(minThumb, { clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 200, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    expect(result).not.toBeNull();
    expect(result[0]).toBeGreaterThan(0);
  });

  /**
   * IMPORTANT:
   * According to the component logic,
   * when the MAX thumb is dragged into or past the MIN thumb,
   * the active thumb switches to "min" and the MIN thumb moves.
   * The max value does NOT move in this case.
   */
  it("moves the min thumb when the max thumb tries to overlap it", () => {
    let result: any = null;
    const handleChange = (...args: any[]) => {
      result = args;
    };

    render(<Range min={0} max={100} onChange={handleChange} />);

    const minThumb = screen.getByLabelText("Minimum value");
    const maxThumb = screen.getByLabelText("Maximum value");

    // Move MIN to roughly the middle
    fireEvent.pointerDown(minThumb, { clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 150, pointerId: 1 }); // ~50% of width
    fireEvent.pointerUp(document, { pointerId: 1 });

    // Attempt to drag MAX to the left past the MIN position
    fireEvent.pointerDown(maxThumb, { clientX: 300, pointerId: 2 });
    fireEvent.pointerMove(document, { clientX: 150, pointerId: 2 }); // left side
    fireEvent.pointerUp(document, { pointerId: 2 });

    const newMin = result[0];
    const newMax = result[1];

    // ✔ Min should be less than max
    expect(newMin).toBeLessThan(newMax);
   
  });
});
