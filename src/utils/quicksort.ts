/**
 * Quick Sort Algorithm
 *
 * Concept:
 * Quick sort uses a divide-and-conquer strategy. It picks a pivot value,
 * partitions the array around the pivot so that smaller values end up on
 * the left and larger values on the right, and then recurses on both sides.
 *
 * Implementation Steps:
 * 1. Pick the last element of the subarray as the pivot.
 * 2. Partition the subarray: swap smaller elements to the left of the
 *    pivot and larger elements to the right.
 * 3. Place the pivot in its final position.
 * 4. Recurse on the subarray to the left of the pivot.
 * 5. Recurse on the subarray to the right of the pivot.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'compare': comparison between two values during partitioning
 *   - 'swap': elements are exchanged to partition around the pivot
 *   - 'write': pivot is placed in its final sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [i, j] for a compare/swap step
 *   - Example: [i, i] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed
 * - swaps: total number of swaps performed
 *
 * Complexity:
 * - Time Complexity: O(n log n) average case, O(n^2) worst case.
 * - Space Complexity: O(log n) stack for the recursion.
 */

import { SortGenerator, SortedYieldResult } from '#/models/sorter'
export function quickSortFunction(array: number[]): void {
    if (array.length <= 1)
        return

    const partition = (low: number, high: number): number => {
        const pivot = array[high]
        let i = low - 1
        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i = i + 1
                const tmp = array[i]
                array[i] = array[j]
                array[j] = tmp
            }
        }
        i = i + 1
        const tmp = array[i]
        array[i] = array[high]
        array[high] = tmp
        return i
    }

    const sort = (low: number, high: number): void => {
        if (low < high) {
            const p = partition(low, high)
            sort(low, p - 1)
            sort(p + 1, high)
        }
    }

    sort(0, array.length - 1)
}


// version of quick sort as Generator. Note the async. Returns Generator object (Iterator)
export async function* quickSort(
      array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0
    if (array.length <= 1)
        return { comps, swaps }

    async function* partition(low: number, high: number): AsyncGenerator<SortedYieldResult, number, void> {
        const pivot = array[high]
        let i = low - 1
        for (let j = low; j < high; j++) {
            // compare element with the pivot
            comps++
            yield { type: 'compare', indices: [j, high] }
            if (array[j] < pivot) {
                // swap element into the left partition
                i = i + 1
                swaps++
                const tmp = array[i]
                array[i] = array[j]
                array[j] = tmp
                yield { type: 'swap', indices: [i, j] }
            }
        }
        // place the pivot in its final position
        i = i + 1
        swaps++
        const tmp = array[i]
        array[i] = array[high]
        array[high] = tmp
        yield { type: 'swap', indices: [i, high] }
        yield { type: 'write', indices: [i, i] }
        return i
    }

    async function* sort(low: number, high: number): AsyncGenerator<SortedYieldResult, void, void> {
        if (low >= high)
            return
        const p: number = yield* partition(low, high)
        yield* sort(low, p - 1)
        yield* sort(p + 1, high)
    }

    yield* sort(0, array.length - 1)
    return { comps, swaps }
}
