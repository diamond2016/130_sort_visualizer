/**
 * Merge Sort Algorithm
 *
 * Concept:
 * Merge sort is a divide-and-conquer sorting algorithm. It repeatedly splits
 * the array in half, recursively sorts each half, and then merges the two
 * sorted halves back into a single sorted run.
 *
 * Implementation Steps:
 * 1. Split the array into a left half and a right half.
 * 2. Recursively sort the left half.
 * 3. Recursively sort the right half.
 * 4. Merge the two sorted halves by scanning them left-to-right and writing
 *    the smaller front element back into the main array.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'compare': comparison between two values
 *   - 'write': value is placed in its final sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [i, j] for a compare step
 *   - Example: [index, index] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed
 * - swaps: total number of swaps performed
 *
 * Complexity:
 * - Time Complexity: O(n log n) in the worst and average cases.
 * - Space Complexity: O(n) because it uses an auxiliary array while merging.
 */

import { SortGenerator, SortedYieldResult } from '#/models/sorter'
export function mergeSortFunction(array: number[]): void {
    if (array.length <= 1)
        return

    const n: number = array.length
    const temp: number[] = new Array(n).fill(0)

    function sort(lo: number, hi: number): void {
        if (lo === hi)
            return
        const mid: number = Math.floor((lo + hi) / 2)
        sort(lo, mid)
        sort(mid + 1, hi)
        merge(lo, mid, hi)
    }

    function merge(lo: number, mid: number, hi: number): void {
        for (let i: number = lo; i <= hi; i++)
            temp[i] = array[i]
        let i: number = lo
        let j: number = mid + 1
        let k: number = lo
        while (i <= mid && j <= hi) {
            if (temp[i] <= temp[j]) {
                array[k] = temp[i]
                i++
            } else {
                array[k] = temp[j]
                j++
            }
            k++
        }
        while (i <= mid) {
            array[k] = temp[i]
            i++
            k++
        }
        while (j <= hi) {
            array[k] = temp[j]
            j++
            k++
        }
    }

    sort(0, n - 1)
}


// version of merge sort as Generator. Note the async. Returns Generator object (Iterator)
export async function* mergeSort(
    array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0
    if (array.length <= 1)
        return { comps, swaps }

    const n: number = array.length
    const temp: number[] = new Array(n).fill(0)

    async function* sort(lo: number, hi: number): AsyncGenerator<SortedYieldResult, void, void> {
        if (lo === hi)
            return
        const mid: number = Math.floor((lo + hi) / 2)
        yield* sort(lo, mid)
        yield* sort(mid + 1, hi)

        for (let i: number = lo; i <= hi; i++)
            temp[i] = array[i]
        let i: number = lo
        let j: number = mid + 1
        let k: number = lo
        while (i <= mid && j <= hi) {
            comps++
            yield { type: 'compare', indices: [i, j] }
            if (temp[i] <= temp[j]) {
                array[k] = temp[i]
                i++
            } else {
                array[k] = temp[j]
                j++
            }
            yield { type: 'write', indices: [k, k] }
            k++
        }
        while (i <= mid) {
            array[k] = temp[i]
            yield { type: 'write', indices: [k, k] }
            i++
            k++
        }
        while (j <= hi) {
            array[k] = temp[j]
            yield { type: 'write', indices: [k, k] }
            j++
            k++
        }
    }

    yield* sort(0, n - 1)
    return { comps, swaps }
}
