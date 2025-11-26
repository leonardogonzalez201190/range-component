"use client";

import { useState, useRef, useEffect } from "react";
import { RangeLabelEditable } from "./RangeLabelEditable";
import { validateProps } from "./validations";
import { RangeProps } from "./types";
import { RangeErrorsTooltip } from "./RangeErrorsTooltip";
import { RangeThumb } from "./RangeThumb";

export const Range = ({ unit, onChange, ...props }: RangeProps) => {

  const {
    errors,
    min,
    max,
    values,
    initialMin,
    initialMax
  } = validateProps(props);

  if (errors.length > 0) {
    return <RangeErrorsTooltip errors={errors} />;
  }

  const rangeRef = useRef<HTMLDivElement>(null);

  const [minVal, setMinVal] = useState<number>(initialMin);
  const [maxVal, setMaxVal] = useState<number>(initialMax);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const handlePointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveThumb(thumb);
  };

  const handleMinChange = (newMin: number) => {
    const clampedValue = Math.min(Math.max(newMin, min), maxVal);
    setMinVal(clampedValue);
    onChange?.(clampedValue, maxVal);
  };

  const handleMaxChange = (newMax: number) => {
    const clampedValue = Math.max(Math.min(newMax, max), minVal);
    setMaxVal(clampedValue);
    onChange?.(minVal, clampedValue);
  };

  const getClosestValue = (clientX: number): number => {
    if (!values || !rangeRef.current) return minVal;

    const { left, width } = rangeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - left) / width));
    const index = Math.round(percent * (values.length - 1));
    return values[Math.max(0, Math.min(values.length - 1, index))] ?? minVal;
  };

  // POINTER EVENTS drag system (no refs)
  useEffect(() => {
    if (!activeThumb) return;

    const handleMove = (e: PointerEvent) => {
      if (!rangeRef.current) return;

      const clientX = e.clientX;

      const rect = rangeRef.current.getBoundingClientRect();
      const start = rect.left;
      const width = rect.width;

      let pos = ((clientX - start) / width) * 100;
      pos = Math.max(0, Math.min(100, pos));

      let value = min + (pos / 100) * (max - min);

      if (values) value = getClosestValue(clientX);

      if (activeThumb === "min") {
        if (value >= maxVal) {
          setActiveThumb("max");
          setMaxVal(Math.round(value));
          onChange?.(minVal, value);
        } else {
          setMinVal(Math.round(value));
          onChange?.(value, maxVal);
        }
      } else {
        if (value <= minVal) {
          setActiveThumb("min");
          setMinVal(Math.round(value));
          onChange?.(value, maxVal);
        } else {
          setMaxVal(Math.round(value));
          onChange?.(minVal, value);
        }
      }
    };

    const stop = () => setActiveThumb(null);

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", stop);
      document.removeEventListener("pointercancel", stop);
    };
  }, [activeThumb, min, max, values, minVal, maxVal, onChange]);

  const getPosition = (value: number): number => {
    if (!values || values.length < 2) {
      const range = max - min;
      return range === 0 ? 0 : ((value - min) / range) * 100;
    }
    const index = values.indexOf(value);
    if (index === -1) return 0;
    return (index / (values.length - 1)) * 100;
  };

  const minPosition = getPosition(minVal);
  const maxPosition = getPosition(maxVal);

  const handleKey = (
    e: React.KeyboardEvent,
    thumb: "min" | "max"
  ) => {

    const isMin = thumb === "min";
    const currentValue = isMin ? minVal : maxVal;
    let direction: "decrease" | "increase" | null = null;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        direction = "decrease";
        break;

      case "ArrowRight":
      case "ArrowUp":
        direction = "increase";
        break;

      default:
        return;
    }

    e.preventDefault();

    if (values && values.length > 1) {
      const index = values.indexOf(currentValue);

      const applyDiscrete = (newIndex: number) => {
        const idx = Math.max(0, Math.min(values.length - 1, newIndex));
        const newValue = values[idx];

        if (isMin && newValue < maxVal) handleMinChange(newValue);
        if (!isMin && newValue > minVal) handleMaxChange(newValue);
      };

      if (direction === "decrease") applyDiscrete(index - 1);
      else applyDiscrete(index + 1);

      return;
    }

    const applyContinuous = (value: number) => {
      if (isMin) handleMinChange(value);
      else handleMaxChange(value);
    };

    if (direction === "decrease") applyContinuous(currentValue - 1);
    else applyContinuous(currentValue + 1);
  };


  return (
    <div className="w-full flex items-center gap-2">

      <RangeLabelEditable
        className="w-20 flex justify-end"
        readOnly={values !== undefined}
        value={minVal}
        unit={unit}
        kind="min"
        minLimit={min}
        maxLimit={max}
        onChange={handleMinChange}
      />

      <div ref={rangeRef} className="relative h-2 bg-gray-200 rounded-full flex-1 mx-2">

        <div
          className="absolute h-full bg-gray-700 rounded-full"
          style={{ left: `${minPosition}%`, right: `${100 - maxPosition}%` }}
        />

        {/* THUMB MIN */}
        <RangeThumb
          position={minPosition}
          value={minVal}
          ariaLabel="Minimum value"
          ariaMin={min}
          ariaMax={maxVal}
          onKeyDown={(e) => handleKey(e, "min")}
          onPointerDown={handlePointerDown("min")}
          isActive={activeThumb === "min"}
        />

        {/* THUMB MAX */}
        <RangeThumb
          position={maxPosition}
          value={maxVal}
          ariaLabel="Maximum value"
          ariaMin={minVal}
          ariaMax={max}
          onKeyDown={(e) => handleKey(e, "max")}
          onPointerDown={handlePointerDown("max")}
          isActive={activeThumb === "max"}
        />
      </div>

      <RangeLabelEditable
        className="w-20 flex justify-start"
        readOnly={values !== undefined}
        value={maxVal}
        unit={unit}
        kind="max"
        minLimit={min}
        maxLimit={max}
        onChange={handleMaxChange}
      />
    </div>
  );
};
