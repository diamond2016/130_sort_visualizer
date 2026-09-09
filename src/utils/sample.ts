import { OrderMode } from "#/models/sorter"
import { MAX_VALUE } from "#/models/renderer"
import { createRandomArray } from "./helper";

/**
 * Generates a sample array with the requested size and ordering.
 * Returns an empty array when the size is outside the supported range or the
 * order is not recognized.
 *
 * @param size - The requested number of elements, from 5 to `MAX_VALUE`.
 * @param order - The ordering to apply: increasing, decreasing, or random.
 * @returns A generated sample array, or an empty array for invalid input.
 */
export function generateSample(size: number, order: OrderMode): number[] {

  const compareDecreasing = (a: number, b:number): number => {
    return (b - a) 
  }
  const compareIncreasing = (a: number, b:number): number => {
    return (a - b) 
  }

  if ((size < 5) || (size > MAX_VALUE))
    return []

  switch (order) {
    case "increasing":
      return createRandomArray(size, MAX_VALUE).sort(compareIncreasing);
      break;
    case "decreasing":
      return createRandomArray(size, MAX_VALUE).sort(compareDecreasing);
      break;
    case "random":
      return createRandomArray(size, MAX_VALUE);
      break;
    default:
      return []
  }
}
