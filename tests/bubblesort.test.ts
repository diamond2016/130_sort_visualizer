import { describe, it, expect } from 'vitest';
import { bubbleSort } from '../src/utils/bubblesort.ts';

describe('bubbleSort', () => {
  it('should sort an empty array', () => {
    const input: number[] = [];
    bubbleSort(input);
    expect(input).toEqual([]);
  });

  it('should sort a single element array', () => {
    const input = [1];
    bubbleSort(input);
    expect(input).toEqual([1]);
  });

  it('should sort an already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    bubbleSort(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

    it('should sort a short reverse sorted array', () => {
    const input = [5, 4];
    bubbleSort(input);
    console.log(`short: output is: ${input}`)
    expect(input).toEqual([4, 5]);
  });

  it('should sort a reverse sorted array', () => {
    const input = [5, 4, 3, 2, 1];
    bubbleSort(input);
    console.log(`reverse: output is: ${input}`)
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort an array with duplicate values', () => {
    const input = [3, 1, 2, 3, 1];
    bubbleSort(input);
    expect(input).toEqual([1, 1, 2, 3, 3]);
  });

  it('should sort an array with negative numbers', () => {
    const input = [-5, 2, -1, 0, 3];
    bubbleSort(input);
    expect(input).toEqual([-5, -1, 0, 2, 3]);
  });

  it('should sort a random unsorted array', () => {
    const input = [64, 34, 25, 12, 22, 11, 90];
    bubbleSort(input);
    expect(input).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });
});