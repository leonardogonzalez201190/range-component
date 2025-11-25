/**
 * Integration test:
 * 1. Render Range.
 * 2. Grab the min slider (pointerDown).
 * 3. Move it to the right (pointerMove).
 * 4. Trigger pointerUp.
 * 5. Confirm onChange received updated min value.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { Range } from '../Range';

describe('Range – slider integration', () => {
  
  beforeEach(() => {
    // JSDOM doesn't support pointer capture, mock it
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  });

  it('updates min value when dragging the slider', () => {
    let result: any = null;
    const handleChange = (...args: any[]) => { result = args; };

    render(<Range min={0} max={100} onChange={handleChange} />);

    const minThumb = screen.getByLabelText('Minimum value');

    fireEvent.pointerDown(minThumb, { clientX: 0, pointerId: 1 });

    // mock bounding box so drag math works
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

    fireEvent.pointerMove(document, { clientX: 200, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    expect(result).not.toBeNull();
    expect(result[0]).toBeGreaterThan(0);
    console.log(result);
  });
});
