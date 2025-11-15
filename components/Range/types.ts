

export interface RangeProps {
  min?: number;
  max?: number;
  values?: number[];
  initialMin?: number;
  initialMax?: number;
  unit?: string;
  onChange?: (min: number, max: number) => void;
}

export interface EditableRangeLabelProps {
  value: number;
  unit?: string;

  kind: "min" | "max";

  minLimit?: number;
  maxLimit?: number;

  readOnly?: boolean;
  onChange: (newValue: number) => void;
}