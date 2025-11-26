

/**
 * Props for the Range component
 */
export interface RangeProps {
  /** Minimum allowed value for the range (default: 0) */
  min?: number;
  /** Maximum allowed value for the range (default: 100) */
  max?: number;
  /** Array of discrete values (optional, for discrete mode) */
  values?: number[];
  /** Initial minimum value (defaults to min if not provided) */
  initialMin?: number;
  /** Initial maximum value (defaults to max if not provided) */
  initialMax?: number;
  /** Unit to display with values (e.g., '$', '€', 'kg') */
  unit?: string;
  /** Callback when range values change */
  onChange?: (min: number, max: number) => void;
}

/**
 * Props for the editable range label component
 */
export interface EditableRangeLabelProps {
  /** Current value to display */
  value: number;
  /** Unit to display after the value */
  unit?: string;
  /** Additional CSS class name */
  className?: string;
  /** Type of label (min or max) */
  kind: "min" | "max";
  /** Minimum allowed value */
  minLimit?: number;
  /** Maximum allowed value */
  maxLimit?: number;
  /** Whether the label is read-only */
  readOnly?: boolean;
  /** Callback when value changes */
  onChange: (newValue: number) => void;
}

/**
 * Result of validating range props
 */
export interface ValidatedProps {
  /** Array of validation error messages */
  errors: string[];
  /** Normalized minimum value */
  min: number;
  /** Normalized maximum value */
  max: number;
  /** Normalized values array (if provided) */
  values?: number[];
  /** Normalized initial minimum value */
  initialMin: number;
  /** Normalized initial maximum value */
  initialMax: number;
}

/**
 * Props for the range thumb component
 */
export interface RangeThumbProps {
  /** Position of the thumb in percentage */
  position: number;
  /** Current value of the thumb */
  value: number;
  /** ARIA label for the thumb */
  ariaLabel: string;
  /** Minimum allowed value */
  ariaMin: number;
  /** Maximum allowed value */
  ariaMax: number;
  /** Callback when pointer down event is triggered */
  onPointerDown: (e: React.PointerEvent) => void;
  /** Callback when key down event is triggered */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Whether the thumb is active */
  isActive: boolean;
}