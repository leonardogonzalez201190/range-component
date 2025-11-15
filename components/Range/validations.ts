import { RangeProps } from "./types";

export const validateProps = ({
  min = 0,
  max = 100,
  initialMin = 0,
  initialMax = 100,
  values,
}: RangeProps): string[] => {
  const errors: string[] = [];

  if (min > max) {
    errors.push("Minimum value cannot be greater than maximum value.");
    return errors; // Early return as other checks won't be valid
  }

  if (initialMin < min || initialMin > max) {
    errors.push(`initialMin must be between ${min} and ${max}.`);
  }

  if (initialMax < min || initialMax > max) {
    errors.push(`initialMax must be between ${min} and ${max}.`);
  }

  if (initialMin > initialMax) {
    errors.push("initialMin cannot be greater than initialMax.");
  }

  if (values) {
    if (values.length < 2) {
      errors.push("The values list must contain at least 2 elements.");
    } else {
      if (values.some(v => v < min || v > max)) {
        errors.push("All values in 'values' must be within the [min, max] range.");
      }

      if (!values.includes(initialMin)) {
        errors.push("initialMin must exist in 'values'.");
      }

      if (!values.includes(initialMax)) {
        errors.push("initialMax must exist in 'values'.");
      }
    }
  }

  return errors;
};