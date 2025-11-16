"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { EditableRangeLabelProps } from "./types";

export const RangeLabelEditable = ({
  value,
  unit = "$",
  minLimit,
  maxLimit,
  readOnly,
  className,
  onChange,
}: EditableRangeLabelProps) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState("");

  const validate = (val: number) => {
    if (minLimit !== undefined && val < minLimit)
      return `The minimum value cannot be less than ${minLimit}${unit}`;
    if (maxLimit !== undefined && val > maxLimit)
      return `The maximum value cannot be greater than ${maxLimit}${unit}`;
    return "";
  };

  const handleSubmit = () => {
    const newError = validate(tempValue);

    if (newError) {
      setError(newError);
      return;
    }

    setError("");
    onChange(tempValue);
    setEditing(false);
  };

  return (
    <span className={className}>
      <div title={error} className="flex flex-col">
        {!editing ? (
          <span
            aria-label="editable-value"
            tabIndex={readOnly ? -1 : 0}
            className={clsx(
              "cursor-pointer text-gray-700 font-medium text-right"
            )}
            onClick={() => {
              if (readOnly) return;
              setTempValue(value);
              setEditing(true);
            }}
            onKeyDown={(e) => {
              if (!readOnly && e.key === "Enter") {
                setTempValue(value);
                setEditing(true);
              }
            }}
          >
            {parseFloat(value.toFixed(2))}{unit}
          </span>
        ) : (
          <input
            type="number"
            value={tempValue}
            min={minLimit}
            max={maxLimit}
            autoFocus
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            onChange={(e) => setTempValue(Number(e.target.value))}
            className={clsx("border px-2 py-1 rounded w-20",
              error && "border-red-500"
            )}
          />
        )}
      </div>
    </span>
  );
};
