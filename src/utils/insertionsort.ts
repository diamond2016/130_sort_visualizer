/**
 * Insertion Sort Algorithm
 *
 * Concept:
 * Insertion sort builds the final sorted array one item at a time.
 * It takes each unsorted element and inserts it into the correct position
 * in the already-sorted portion of the array by shifting larger values to
 * the right.
 *
 * Implementation Steps:
 * 1. Start from the second element of the array, as the first element is assumed to be sorted.
 * 2. Compare the second element with the first if the second is smaller then swap them.
 * 3. Move to the third element, compare it with the first two, and put it in its correct position
 * 4. Repeat until the entire array is sorted.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'compare': comparison between two values
 *   - 'swap': elements are exchanged
 *   - 'write': value is placed in its final sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [i, i + 1] for a compare/swap step
 *   - Example: [index, index] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed
 * - swaps: total number of swaps performed
 *
 * Complexity:
 * - Time Complexity: O(n^2) in the worst and average cases.
 * - Space Complexity: O(1) because it sorts in place.
 */

import { SortGenerator } from '#/models/sorter'
export function insertionSortFunction(array: number[]): void {
    if (array.length <= 1)
        return

    for (let index = 1; index < array.length; index++) {
        const key = array[index]
        let j = index - 1
        /* Move elements of arr[0..i-1], that are
           greater than key, to one position ahead
           of their current position */
        while ((j >= 0) && (array[j] > key)) {
            array[j + 1] = array[j]
            j = j -1
        }
        array[j + 1] = key
    }
}


// version of insertionsort as Generator. Note the async. Returns Generator object (Iterator)
export async function* insertionSort(
      array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0
    if (array.length <= 1)
        return { comps, swaps }

    for (let index = 1; index < array.length; index++) {
        const key = array[index]
        let j = index - 1
        /* Move elements of arr[0..i-1], that are
           greater than key, to one position ahead
           of their current position */
        while ((j >= 0) && (array[j] > key)) {
            // compare
            comps++
            yield { type: 'compare', indices: [j, index] }
            // swap right
            swaps++
            array[j + 1] = array[j]
            yield { type: 'swap', indices: [j + 1, j] }
            j = j -1
        }
        // put key in correct position
        swaps++
        array[j + 1] = key
        yield { type: 'write', indices: [j + 1, j + 1] }
    }

   return { comps, swaps } 
}