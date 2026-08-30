import { describe, it, expect } from 'vitest';
import { heapSortFunction, heapSort } from '#/utils/heapsort';
import { isSorted } from '../src/utils/validator';

describe('heapSortFunction', () => {
  it('should sort an empty array', () => {
    const input: number[] = [];
    heapSortFunction(input);
    expect(input).toEqual([]);
  });

  it('should sort a single element array', () => {
    const input = [1];
    heapSortFunction(input);
    expect(input).toEqual([1]);
  });

  it('should sort an already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    heapSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a short reverse sorted array', () => {
    const input = [5, 4];
    heapSortFunction(input);
    expect(input).toEqual([4, 5]);
  });

  it('should sort a reverse sorted array', () => {
    const input = [5, 4, 3, 2, 1];
    heapSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort an array with duplicate values', () => {
    const input = [3, 1, 2, 3, 1];
    heapSortFunction(input);
    expect(input).toEqual([1, 1, 2, 3, 3]);
  });

  it('should sort an array with negative numbers', () => {
    const input = [-5, 2, -1, 0, 3];
    heapSortFunction(input);
    expect(input).toEqual([-5, -1, 0, 2, 3]);
  });

  it('should sort a random unsorted array', () => {
    const input = [64, 34, 25, 12, 22, 11, 90];
    heapSortFunction(input);
    expect(input).toEqual([11, 12, 22, 25, 34, 64, 90]);
    expect(isSorted(input)).toBe(true);
  });
});

describe('heapSort generator', () => {
  it('should sort an array and yield correct events', async () => {
    const input = [3, 1, 2];
    const array = [...input];
    const generator = heapSort(array);
    
    let eventCount = 0;
    let lastEvent: any = null;

    // We need to consume the generator to get the return value
    // In Vitest/Jest, we can use a helper or just manually iterate
    let result = await generator.next();
    while (!result.done) {
      if (result.value) {
        lastEvent = result.value;
        eventCount++;
      }
      result = await generator.next();
    }

    // After the loop, result.value is the return value
    const returnVal = result.value;

    expect(array).toEqual([1, 2, 3]);
    expect(isSorted(array)).toBe(true);
    expect(eventCount).toBeGreaterThan(0);
    expect(returnVal).toHaveProperty('comps');
    expect(returnVal).toHaveProperty('swaps');
  });
});
