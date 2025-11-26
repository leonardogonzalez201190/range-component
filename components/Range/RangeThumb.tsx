// Thumb component for Range slider
// This component handles both min and max slider thumbs with pointer and keyboard interactions.

import { RangeThumbProps } from "./types";

export const RangeThumb = ({
    position,
    value,
    ariaLabel,
    ariaMin,
    ariaMax,
    onPointerDown,
    onKeyDown,
    isActive
}: RangeThumbProps) => {
    return (
        <button
            type="button"
            role="slider"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-valuemin={ariaMin}
            aria-valuemax={ariaMax}
            aria-valuenow={value}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            className={`absolute w-5 h-5 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform 
        ${isActive ? "scale-150 cursor-grabbing" : "cursor-grab hover:scale-125"}`}
            style={{ left: `${position}%`, top: "50%", touchAction: "none" }}
        />
    );
};
