import { describe, it, expect } from 'vitest';
import { radixSortFunction, radixSort } from '#/utils/radixsort';
import { isSorted } from '#/utils/validator';

describe('radixSortFunction', () => {
  it('should sort an empty array', () => {
    const input: number[] = [];
    radixSortFunction(input);
    expect(input).toEqual([]);
  });

  it('should sort a single element array', () => {
    const input = [5];
    radixSortFunction(input);
    expect(input).toEqual([5]);
  });

  it('should sort an already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    radixSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a short reverse sorted array', () => {
    const input = [9, 8];
    radixSortFunction(input);
    expect(input).toEqual([8, 9]);
  });

  it('should sort a reverse sorted array', () => {
    const input = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    radixSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should sort an array with duplicate values', () => {
    const input = [3, 1, 2, 3, 1];
    radixSortFunction(input);
    expect(input).toEqual([1, 1, 2, 3, 3]);
  });

  it('should sort an array with zero', () => {
    const input = [0, 5, 3, 1, 0, 2];
    radixSortFunction(input);
    expect(input).toEqual([0, 0, 1, 2, 3, 5]);
  });

  it('should sort a random unsorted array', () => {
    const input = [64, 34, 25, 12, 22, 11, 90];
    radixSortFunction(input);
    expect(input).toEqual([11, 12, 22, 25, 34, 64, 90]);
    expect(isSorted(input)).toBe(true);
  });
});

describe('radixSort generator', () => {
  it('should sort an array and yield correct events', async () => {
    const input = [3, 1, 2];
    const array = [...input];
    const generator = radixSort(array);

    let eventCount = 0;
    let lastEvent: any = null;

    let result = await generator.next();
    while (!result.done) {
      if (result.value) {
        lastEvent = result.value;
        eventCount++;
      }
      result = await generator.next();
    }

    const returnVal = result.value;

    expect(array).toEqual([1, 2, 3]);
    expect(isSorted(array)).toBe(true);
    expect(eventCount).toBeGreaterThan(0);
    expect(returnVal).toHaveProperty('comps');
    expect(returnVal).toHaveProperty('swaps');
  });
});
