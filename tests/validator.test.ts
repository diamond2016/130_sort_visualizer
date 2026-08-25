import { describe, it, expect } from "vitest";
import { isSorted } from "../src/utils/validator";

describe("isSorted validator", () => {
  it("should return true for an empty array", () => {
    expect(isSorted([])).toBe(true);
  });

  it("should return true for a single element array", () => {
    expect(isSorted([42])).toBe(true);
  });

  it("should return true for an already sorted array", () => {
    expect(isSorted([1, 2, 3, 4, 5])).toBe(true);
  });

  it("should return false for an unsorted array", () => {
    expect(isSorted([1, 3, 2, 4])).toBe(false);
  });

  it("should return false for a reverse sorted array", () => {
    expect(isSorted([5, 4, 3, 2, 1])).toBe(false);
  });

  it("should return true for an array with equal adjacent values", () => {
    expect(isSorted([1, 2, 2, 3, 3, 5])).toBe(true);
  });

  it("should return true for an array with negative numbers sorted", () => {
    expect(isSorted([-10, -5, 0, 5, 10])).toBe(true);
  });

  it("should return false for negative numbers unsorted", () => {
    expect(isSorted([-5, -10, 0])).toBe(false);
  });
});
