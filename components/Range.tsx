"use client";
import React, { useState, useRef, useEffect } from "react";
import { EditableRangeLabel } from "./EditableRangeLabel";

interface RangeProps {
  min?: number;
  max?: number;
  values?: number[];
  initialMin?: number;
  initialMax?: number;
  unit?: string;
  onChange?: (min: number, max: number) => void;
}

export const Range: React.FC<RangeProps> = ({
  min = 0,
  max = 100,
  values,
  initialMin = 30,
  initialMax = 70,
  unit = "$",
  onChange,
}) => {

  const [minVal, setMinVal] = useState(initialMin ?? values?.[0]);
  const [maxVal, setMaxVal] = useState(initialMax ?? values?.[values?.length - 1]);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (thumb: "min" | "max") => {
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


  const getClosestValue = (clientX: number) => {
    if (!values) return minVal;
    if (!rangeRef.current) return minVal;

    const { left, width } = rangeRef.current.getBoundingClientRect();
    const percent = (clientX - left) / width;
    const index = Math.round(percent * (values.length - 1));
    return values[Math.max(0, Math.min(values.length - 1, index))];
  };

  useEffect(() => {
    if (!activeThumb) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rangeRef.current) return;

      const rect = rangeRef.current.getBoundingClientRect();
      const start = rect.left;
      const width = rect.width;

      let pos = ((e.clientX - start) / width) * 100;
      pos = Math.max(0, Math.min(100, pos));

      let value = min + (pos / 100) * (max - min);

      if (values) value = getClosestValue(e.clientX);

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

    const handleMouseUp = () => setActiveThumb(null);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeThumb, min, max, minVal, maxVal, onChange]);


  const getPosition = (value: number): number => {
    if (!values || values.length < 2) {
      return ((value - min) / (max - min)) * 100;
    }
    const index = values.indexOf(value);
    if (index === -1) return 0;
    return (index / (values.length - 1)) * 100;
  };

  // FIX: compute both as straight percentages
  const minPosition = getPosition(minVal);
  const maxPosition = getPosition(maxVal);

  const handleKey = (
    e: React.KeyboardEvent,
    thumb: "min" | "max"
  ) => {
    const isMin = thumb === "min";
    const current = isMin ? minVal : maxVal;

    // for continuous: step at least 1
    const continuousStep = Math.max(1, Math.round((max - min) / 100));
    const continuousBigStep = Math.max(1, Math.round((max - min) / 10));

    // for discrete: move by indices within the array
    const discreteStep = 1;
    const discreteBigStep = Math.max(1, Math.round((values?.length ?? 2) * 0.1));

    const applyContinuous = (v: number) => {
      if (isMin) handleMinChange(v);
      else handleMaxChange(v);
    };

    const applyDiscreteByIndex = (idx: number) => {
      const clampedIndex = Math.max(0, Math.min((values!.length - 1), idx));
      const v = values![clampedIndex];
      if (isMin) handleMinChange(v);
      else handleMaxChange(v);
    };

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown": {
        if (values && values.length) {
          // discrete: find current index and decrease
          const idx = Math.max(0, values.indexOf(current));
          const step = e.shiftKey ? discreteBigStep : discreteStep;
          applyDiscreteByIndex(idx - step);
        } else {
          const step = e.shiftKey ? continuousBigStep : continuousStep;
          applyContinuous(current - step);
        }
        e.preventDefault();
        break;
      }

      case "ArrowRight":
      case "ArrowUp": {
        if (values && values.length) {
          const idx = Math.max(0, values.indexOf(current));
          const step = e.shiftKey ? discreteBigStep : discreteStep;
          applyDiscreteByIndex(idx + step);
        } else {
          const step = e.shiftKey ? continuousBigStep : continuousStep;
          applyContinuous(current + step);
        }
        e.preventDefault();
        break;
      }

      case "Home": {
        if (isMin) {
          if (values && values.length) applyDiscreteByIndex(0);
          else applyContinuous(min);
        } else {
          if (values && values.length) applyDiscreteByIndex(values.length - 1);
          else applyContinuous(max);
        }
        e.preventDefault();
        break;
      }

      case "End": {
        if (isMin) {
          if (values && values.length) applyDiscreteByIndex(values.length - 1);
          else applyContinuous(max);
        } else {
          if (values && values.length) applyDiscreteByIndex(0);
          else applyContinuous(min);
        }
        e.preventDefault();
        break;
      }
    }
  };


  return (
    <div className="w-full flex items-center gap-2">
      <span className="w-20 flex justify-end">
        <EditableRangeLabel
          readOnly={values !== undefined}
          value={minVal}
          unit={unit}
          kind="min"
          minLimit={min}
          maxLimit={max}
          onChange={handleMinChange}
        />
      </span>

      <div ref={rangeRef} className="relative h-2 bg-gray-200 rounded-full flex-1 mx-2">

        <div
          className="absolute h-full bg-gray-700 rounded-full"
          style={{ left: `${minPosition}%`, right: `${100 - maxPosition}%` }}
        />

        {/* THUMB MIN */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={maxVal}
          aria-valuenow={minVal}
          onKeyDown={(e) => handleKey(e, "min")}
          className={`absolute w-5 h-5 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform 
            ${activeThumb === "min" ? "scale-150 cursor-grabbing" : "cursor-grab hover:scale-125"}`}
          style={{ left: `${minPosition}%`, top: "50%" }}
          onMouseDown={() => handleMouseDown("min")}
        />

        {/* THUMB MAX */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Maximum value"
          aria-valuemin={minVal}
          aria-valuemax={max}
          aria-valuenow={maxVal}
          onKeyDown={(e) => handleKey(e, "max")}
          className={`absolute w-5 h-5 bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform 
            ${activeThumb === "max" ? "scale-150 cursor-grabbing" : "cursor-grab hover:scale-125"}`}
          style={{ left: `${maxPosition}%`, top: "50%" }}
          onMouseDown={() => handleMouseDown("max")}
        />
      </div>

      <span className="w-20">
        <EditableRangeLabel
          readOnly={values !== undefined}
          value={maxVal}
          unit={unit}
          kind="max"
          minLimit={min}
          maxLimit={max}
          onChange={handleMaxChange}
        />
      </span>
    </div>
  );
};


export function SkeletonRange() {
  return (
    <div className="relative animate-pulse mx-14 p-2">
      <div className="h-1.5 w-full bg-gray-300 rounded"></div>
      <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between">
        <div className="size-6 bg-gray-300 rounded-full"></div>
        <div className="size-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
