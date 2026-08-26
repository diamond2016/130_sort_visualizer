import { describe, it, expect } from 'vitest';
import { insertionSortFunction } from '#/utils/insertionsort';

describe('insertionSort', () => {
  it('should sort an empty array', () => {
    const input: number[] = [];
    insertionSortFunction(input);
    expect(input).toEqual([]);
  });

  it('should sort a single element array', () => {
    const input = [1];
    insertionSortFunction(input);
    expect(input).toEqual([1]);
  });

  it('should sort an already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    insertionSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a short reverse sorted array', () => {
    const input = [5, 4];
    insertionSortFunction(input);
    expect(input).toEqual([4, 5]);
  });

  it('should sort a reverse sorted array', () => {
    const input = [5, 4, 3, 2, 1];
    insertionSortFunction(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort an array with duplicate values', () => {
    const input = [3, 1, 2, 3, 1];
    insertionSortFunction(input);
    expect(input).toEqual([1, 1, 2, 3, 3]);
  });

  it('should sort an array with negative numbers', () => {
    const input = [-5, 2, -1, 0, 3];
    insertionSortFunction(input);
    expect(input).toEqual([-5, -1, 0, 2, 3]);
  });

  it('should sort a random unsorted array', () => {
    const input = [64, 34, 25, 12, 22, 11, 90];
    insertionSortFunction(input);
    expect(input).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });
});