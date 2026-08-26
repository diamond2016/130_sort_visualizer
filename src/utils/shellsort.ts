/**
 * Shell Sort Algorithm
 *
 * Concept:
 *
 * TODO.
 *
 * Implementation Steps:
 *
 * TODO
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
 * - Time Complexity: TODO in the worst and average cases.
 * - Space Complexity: TODO because it sorts in place.
 */

import { SortGenerator } from '#/models/sorter'
export function shellSortFunction(array: number[]): void {
// TODO
}

const swap = (arr: number[], a: number, b: number): void => {
    const temp: number = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}


// version of sort as Generator. Note the async. Returns Generator object (Iterator)

export async function* shellSort(
      array: number[]
): SortGenerator {
//    TODO
}