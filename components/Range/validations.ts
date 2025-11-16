import { RangeProps, ValidatedProps } from "./types";

export function validateProps({
  min = 0,
  max = 100,
  initialMin = 0,
  initialMax = 100,
  values,
}: RangeProps): ValidatedProps {

  const errors: string[] = [];

  // 1. BASIC VALIDATIONS

  if (min > max) {
    errors.push("Minimum value cannot be greater than maximum value.");
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

  // 2. DISCRETE VALUES VALIDATIONS

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

  // 3. IF THERE ARE ERRORS → RETURN PROPS AS IS
  // The component will NOT work, but it will render the error messages,
  // that's why we return the original unsanitized version.
  if (errors.length > 0) {
    return { errors, min, max, values, initialMin, initialMax };
  }

  // 4. SANITIZATION (NO ERRORS)

  // If there are values → discrete mode (use list boundaries)
  if (values && values.length > 1) {
    const normalizedMin = values.includes(initialMin)
      ? initialMin
      : values[0];

    const normalizedMax = values.includes(initialMax)
      ? initialMax
      : values[values.length - 1];

    return {
      errors,
      min,
      max,
      values,
      initialMin: normalizedMin,
      initialMax: normalizedMax
    };
  }

  // If there are NO values → continuous mode, clamp to [min, max]
  const normalizedMin = Math.max(min, Math.min(initialMin, max));
  const normalizedMax = Math.max(min, Math.min(initialMax, max));

  return {
    errors,
    min,
    max,
    values,
    initialMin: normalizedMin,
    initialMax: normalizedMax,
  };
}
