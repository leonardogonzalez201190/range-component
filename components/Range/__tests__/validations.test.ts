import { describe, it, expect } from 'vitest';
import { validateProps } from '../validations';

describe('validateProps', () => {
  it('should return empty errors array for valid props', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 20,
      initialMax: 80,
      values: [0, 20, 40, 60, 80, 100]
    };
    
    const result = validateProps(props);
    expect(result.errors).toEqual([]);
  });

  it('should detect when min is greater than max', () => {
    const props = {
      min: 100,
      max: 50,
      initialMin: 20,
      initialMax: 80
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('Minimum value cannot be greater than maximum value.');
  });

  it('should detect initialMin out of bounds', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: -10,
      initialMax: 50
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('initialMin must be between 0 and 100.');
  });

  it('should detect initialMax out of bounds', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 20,
      initialMax: 150
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('initialMax must be between 0 and 100.');
  });

  it('should detect when initialMin is greater than initialMax', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 60,
      initialMax: 40
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('initialMin cannot be greater than initialMax.');
  });

  it('should validate values array has at least 2 elements', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 0,
      initialMax: 100,
      values: [0]
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('The values list must contain at least 2 elements.');
  });

  it('should validate all values are within min/max range', () => {
    const props = {
      min: 10,
      max: 90,
      initialMin: 10,
      initialMax: 90,
      values: [5, 10, 50, 90, 95]
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain("All values in 'values' must be within the [min, max] range.");
  });

  it('should validate initialMin exists in values when provided', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 15,
      initialMax: 85,
      values: [0, 10, 20, 85, 100]
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('initialMin must exist in \'values\'.');
  });

  it('should validate initialMax exists in values when provided', () => {
    const props = {
      min: 0,
      max: 100,
      initialMin: 10,
      initialMax: 85,
      values: [0, 10, 20, 30, 100]
    };
    
    const result = validateProps(props);
    expect(result.errors).toContain('initialMax must exist in \'values\'.');
  });

  it('should return multiple errors when multiple validations fail', () => {
    const props = {
      min: 100,
      max: 0,
      initialMin: 110,
      initialMax: -10,
      values: [0, 50, 100]
    };
    
    const result = validateProps(props);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
