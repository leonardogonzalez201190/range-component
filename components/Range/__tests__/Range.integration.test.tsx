/**
 * Basic integration flow:
 * 1. Render the Range component with initial min/max.
 * 2. Click the editable span to toggle the input.
 * 3. Simulate a user updating the minimum value.
 * 4. Verify the UI updates.
 * 5. Verify onChange is called with the updated range.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { Range } from '../Range';
import { vi } from 'vitest';

describe('Range – basic integration', () => {
    it('updates the minimum value when the user edits it', () => {
        // 1) Variable local para capturar datos
        let result: any = null;

        const handleChange = (...args: any[]) => {
            result = args; // guardamos min y max
        };

        render(
            <Range
                min={0}
                max={100}
                onChange={handleChange}
            />
        );

        // 1. Find the span that shows the current min
        const minSpan = screen.getAllByLabelText('editable-value')[0];
        expect(minSpan).toHaveTextContent('0');

        // 2. Click to activate the input
        fireEvent.click(minSpan);

        // 3. Now the input should appear
        const minInput = screen.getByRole('spinbutton'); // or getByDisplayValue('0')
       
        // 4. Change the min value to 10
        fireEvent.change(minInput, { target: { value: '10' } });

        // 4b. Trigger blur so RangeLabelEditable applies changes
        fireEvent.blur(minInput);

        // 5. Verify callback
        expect(result).toEqual([10, 100]);
    });
});
