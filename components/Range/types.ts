

export interface RangeProps {
  min?: number;
  max?: number;
  values?: number[];
  initialMin?: number;
  initialMax?: number;
  unit?: string;
  onChange?: (min: number, max: number) => void;
}