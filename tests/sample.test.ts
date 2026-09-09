import { describe, it, expect } from "vitest";
import { generateSample } from "../src/utils/sample";
import { MAX_VALUE } from "../src/models/renderer";

describe("generateSample utility", () => {
  it("should clamp size below 5 to return empty array", () => {
    expect(generateSample(4, "random")).toEqual([]);
    expect(generateSample(0, "increasing")).toEqual([]);
    expect(generateSample(-10, "decreasing")).toEqual([]);
  });

  it("should clamp size above MAX_VALUE (100) to return empty array", () => {
    expect(generateSample(101, "random")).toEqual([]);
    expect(generateSample(150, "increasing")).toEqual([]);
  });

  it("should generate a sample of correct size between 5 and 100", () => {
    const sample = generateSample(30, "random");
    expect(sample.length).toBe(30);
  });

  it("should produce strictly ascending values for 'increasing' order", () => {
    const sample = generateSample(20, "increasing");
    console.log(sample)
    expect(sample.length).toBe(20);
    for (let i = 0; i < sample.length - 1; i++) {
      expect(sample[i]).toBeLessThanOrEqual(sample[i + 1]);
    }
    // Also check it has values from 1 to MAX_VALUE or sorted sequence
    expect(sample[0]).toBeGreaterThanOrEqual(1);
    expect(sample[sample.length - 1]).toBeLessThanOrEqual(MAX_VALUE);
  });

  it("should produce strictly descending values for 'decreasing' order", () => {
    const sample = generateSample(20, "decreasing");
    console.log(sample)
    expect(sample.length).toBe(20);
    for (let i = 0; i < sample.length - 1; i++) {
      expect(sample[i]).toBeGreaterThanOrEqual(sample[i + 1]);
    }
    expect(sample[0]).toBeLessThanOrEqual(MAX_VALUE);
    expect(sample[sample.length - 1]).toBeGreaterThanOrEqual(1);
  });

  it("should produce random values bounded by 1 and MAX_VALUE for 'random' order", () => {
    const sample = generateSample(30, "random");
    expect(sample.length).toBe(30);
    sample.forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(MAX_VALUE);
    });
  });
});
