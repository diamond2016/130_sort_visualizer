/**
 * Heap Sort Algorithm
 *
 * Concept:
 * Build a max-heap from the array, then repeatedly extract the maximum element
 * and place it at the end of the array.
 *
 * Implementation Steps:
 * 1. Build a max-heap by heapifying the array.
 * 2. Repeatedly swap the root (maximum element) with the last element of the current heap.
 * 3. Reduce the heap size and sift down the new root to maintain the max-heap property.
 * 4. Repeat until the heap size is 1.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'compare': comparison between two values
 *   - 'swap': elements are exchanged
 *   - 'write': value is placed in its final sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [i, j] for a compare/swap step
 *   - Example: [index, index] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed
 * - swaps: total number of swaps performed
 *
 * Complexity:
 * - Time Complexity: O(n log n)
 * - Space Complexity: O(1) (in-place)
 */

import { SortGenerator } from '#/models/sorter'

export function heapSortFunction(array: number[]): void {
    if (array.length <= 1) return;

    // Build max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        siftDown(array, i, array.length);
    }

    // Extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
        swap(array, 0, i);
        siftDown(array, 0, i);
    }
}

function siftDown(array: number[], i: number, length: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < length && array[left] > array[largest]) {
        largest = left;
    }

    if (right < length && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swap(array, i, largest);
        siftDown(array, largest, length);
    }
}

const swap = (arr: number[], a: number, b: number): void => {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
};

export async function* heapSort(
  array: number[]
): SortGenerator {
  let comps = 0;
  let swaps = 0;

  if (array.length <= 1) {
    return { comps, swaps };
  }

  const siftDownAsync = async function* (arr: number[], i: number, length: number) {
    let current = i;
    while (true) {
      let largest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < length) {
        comps++;
        yield { type: 'compare', indices: [left, largest] };
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < length) {
        comps++;
        yield { type: 'compare', indices: [right, largest] };
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== current) {
        const temp = arr[current];
        arr[current] = arr[largest];
        arr[largest] = temp;
        swaps++;
        yield { type: 'swap', indices: [current, largest] };
        current = largest;
      } else {
        break;
      }
    }
  };

  // Build max heap
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    yield* siftDownAsync(array, i, array.length);
  }

  // Extract elements from heap
  for (let i = array.length - 1; i > 0; i--) {
    // Swap root with last element
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    swaps++;
    yield { type: 'swap', indices: [0, i] };

    // Element at index i is now in its final position
    yield { type: 'write', indices: [i, i] };

    // Sift down the new root
    yield* siftDownAsync(array, 0, i);
  }

  return { comps, swaps };
}
