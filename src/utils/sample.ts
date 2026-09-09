import { OrderMode } from "#/models/sorter"
import { MAX_VALUE } from "#/models/renderer"

/**
 * Generates a sample array with the requested size and ordering.
 * Returns an empty array when the size is outside the supported range or the
 * order is not recognized.
 *
 * @param size - The requested number of elements, from 5 to `MAX_VALUE`.
 * @param order - The ordering to apply: increasing, decreasing, or random.
 * @returns A generated sample array, or an empty array for invalid input.
 */
export function generateSample(size: number, maxValue: number, order: OrderMode): number[] {
  if ((size < 5) || (size > MAX_VALUE))
    return []

  const sample = Array.from(
    { length: size },
    (_, index) => Math.max(1, Math.round(((index + 1) / size) * maxValue))
  );

  switch (order) {
    case "increasing":
      return sample;
    case "decreasing":
      return sample.reverse();
    case "random":
      return Array.from(
        { length: size },
        () => Math.floor(Math.random() * maxValue) + 1
      );
    default:
      return []
  }
}
