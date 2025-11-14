import React, { useState } from "react";
import { clsx } from 'clsx';

interface EditableRangeLabelProps {
    value: number;
    unit?: string;

    kind: "min" | "max"; // indicates if it is minimum or maximum

    minLimit?: number; // minimum limit allowed
    maxLimit?: number; // maximum limit allowed

    readOnly?: boolean;
    onChange: (newValue: number) => void;
}

export const EditableRangeLabel: React.FC<EditableRangeLabelProps> = ({
    value,
    unit = "$",
    kind,
    minLimit,
    maxLimit,
    readOnly,
    onChange,
}) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [error, setError] = useState("");

    const validate = (val: number) => {
        if (kind === "min" && minLimit !== undefined && val < minLimit) {
            return `The minimum value cannot be less than ${minLimit}${unit}`;
        }
        if (kind === "max" && maxLimit !== undefined && val > maxLimit) {
            return `The maximum value cannot be greater than ${maxLimit}${unit}`;
        }
        return "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        <form
            onSubmit={handleSubmit}
            title={error}
            className="flex flex-col items-start">
            {!editing ? (
                <span
                    aria-label="editable-value"
                    className={clsx(
                        "cursor-pointer text-gray-700 font-medium",
                        kind === "min" ? "text-right" : "text-left"
                    )}
                    onClick={() => {
                        if (readOnly) return;
                        setTempValue(value);
                        setEditing(true);
                    }}
                >
                    {parseFloat(value.toFixed(2))}{unit}
                </span>
            ) : (
                <input
                    type="number"
                    value={tempValue}
                    autoFocus
                    onBlur={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit(e);
                        }
                    }}
                    onChange={(e) => setTempValue(Number(e.target.value))}
                    className={clsx(
                        "border px-2 py-1 rounded w-20",
                        kind === "min" ? "text-right" : "text-left",
                        error && "border-red-500"
                    )}
                />
            )}
        </form>
    );
};
