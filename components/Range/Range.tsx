"use client";
import React, { useState, useRef, useEffect } from "react";
import { EditableRangeLabel } from "./EditableRangeLabel";
import { validateProps } from "./validations";
import { RangeProps } from "./types";



export const Range: React.FC<RangeProps> = ({
  min = 0,
  max = 100,
  values,
  initialMin = 30,
  initialMax = 70,
  unit = "$",
  onChange,
}) => {
  
  // Validate props and show errors in console
  const validationErrors = validateProps({ min, max, values, initialMin, initialMax });
  // Ensure we have valid initial values
  const safeInitialMin = values ? Math.max(min, Math.min(initialMin, max)) : initialMin;
  const safeInitialMax = values ? Math.max(min, Math.min(initialMax, max)) : initialMax;
  
  const [minVal, setMinVal] = useState<number>(() => {
    if (values && values.length > 0) {
      return values.includes(initialMin) ? initialMin : values[0];
    }
    return safeInitialMin;
  });
  
  const [maxVal, setMaxVal] = useState<number>(() => {
    if (values && values.length > 0) {
      const lastValue = values[values.length - 1];
      return values.includes(initialMax) ? initialMax : lastValue;
    }
    return safeInitialMax;
  });
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

  const getClosestValue = (clientX: number): number => {
    if (!values || !rangeRef.current) return minVal;

    const { left, width } = rangeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - left) / width));
    const index = Math.round(percent * (values.length - 1));
    return values[Math.max(0, Math.min(values.length - 1, index))] ?? minVal;
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
    const current = isMin ? minVal : maxVal;

    const continuousStep = Math.max(1, Math.round((max - min) * 0.02));
    const continuousBigStep = Math.max(1, Math.round((max - min) * 0.1));

    const discreteStep = 1;
    const discreteBigStep = Math.max(1, Math.round((values?.length ?? 2) * 0.1));

    const getDiscreteIndex = () => {
      if (!values) return 0;
      const rawIndex = values.indexOf(current);
      if (rawIndex !== -1) return rawIndex;
      const fallbackIndex = values.findIndex(v => v >= current);
      return fallbackIndex !== -1 ? fallbackIndex : values.length - 1;
    };

    const discreteApply = (newIndex: number) => {
      if (!values) return;
      
      const clampedIndex = Math.max(0, Math.min(values.length - 1, newIndex));
      const newValue = values[clampedIndex];

      // current index of the opposite limit (robust against missing values)
      const maxIndex = (() => {
        const mi = values.indexOf(maxVal);
        if (mi !== -1) return mi;
        const f = values.findIndex(v => v >= maxVal);
        return f !== -1 ? f : values.length - 1;
      })();

      const minIndex = (() => {
        const mi = values.indexOf(minVal);
        if (mi !== -1) return mi;
        const f = values.findIndex(v => v >= minVal);
        return f !== -1 ? f : values.length - 1;
      })();

      if (isMin) {
        // minIndex must always be strictly LESS than maxIndex
        if (clampedIndex >= maxIndex) return;
        handleMinChange(newValue);
      } else {
        // maxIndex must always be strictly GREATER than minIndex
        if (clampedIndex <= minIndex) return;
        handleMaxChange(newValue);
      }
    };

    const continuousApply = (newValue: number) => {
      if (isMin) {
        if (newValue > maxVal) return;
        handleMinChange(newValue);
      } else {
        if (newValue < minVal) return;
        handleMaxChange(newValue);
      }
    };

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown": {
        if (values && values.length) {
          const idx = getDiscreteIndex();
          const step = e.shiftKey ? discreteBigStep : discreteStep;
          discreteApply(idx - step);
        } else {
          const step = e.shiftKey ? continuousBigStep : continuousStep;
          continuousApply(current - step);
        }
        e.preventDefault();
        return;
      }

      case "ArrowRight":
      case "ArrowUp": {
        if (values && values.length) {
          const idx = getDiscreteIndex();
          const step = e.shiftKey ? discreteBigStep : discreteStep;
          discreteApply(idx + step);
        } else {
          const step = e.shiftKey ? continuousBigStep : continuousStep;
          continuousApply(current + step);
        }
        e.preventDefault();
        return;
      }

      case "Home":
        if (values && values.length) {
          if (isMin) discreteApply(0);
          else discreteApply(values.length - 1);
        } else {
          if (isMin) continuousApply(min);
          else continuousApply(max);
        }
        e.preventDefault();
        return;

      case "End":
        if (values && values.length) {
          if (isMin) discreteApply(values.length - 1);
          else discreteApply(0);
        } else {
          if (isMin) continuousApply(max);
          else continuousApply(min);
        }
        e.preventDefault();
        return;
    }
  };

  if (validationErrors.length > 0) {
    return (
      <div className="w-full flex items-center justify-center cursor-pointer">
        <div className="relative inline-block group">
          <div className="px-3 py-1.5 text-center text-red-700 rounded-md text-sm flex items-center">
            <span>⚠️ {validationErrors.length} validation error{validationErrors.length > 1 ? 's' : ''} found</span>
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="hidden group-hover:block absolute z-10 p-2 mt-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="text-red-700 font-medium mb-1">Validation Errors:</div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-gray-800 whitespace-nowrap">{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
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

    </div>
  );
};

export function SkeletonRange() {
  return (
    <div className="relative animate-pulse mx-14 p-2">
      <div className="h-1.5 w-full bg-gray-300 rounded" />
      <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between">
        <div className="size-6 bg-gray-300 rounded-full" />
        <div className="size-6 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
