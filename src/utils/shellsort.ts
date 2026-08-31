/**
 * Shell Sort Algorithm
 *
 * Concept:
 * Shell sort is an in-place, comparison-based sorting algorithm that generalizes
 * insertion sort by allowing the comparison of elements that are more than one
 * apart. It first sorts elements with a large gap (step), then progressively
 * reduces the gap and repeats until the gap is one.
 *
 * Implementation Steps:
 * 1. Start with a gap of floor(n / 2).
 * 2. For each gap, perform a gapped insertion pass: step through the array
 *    from index gap to n-1, comparing and moving elements that are gap apart.
 * 3. Halve the gap after each pass.
 * 4. Repeat until gap is 1.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'compare': comparison between two values
 *   - 'write': value is placed in its final sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [i - gap, i] for a compare step
 *   - Example: [i] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed
 * - swaps: total number of writes performed
 *
 * Complexity:
 * - Time Complexity: O(n^(3/2)) in the worst and average cases (using Shell's original gap sequence).
 * - Space Complexity: O(1) (it is an in-place sorting algorithm).
 */

import { SortGenerator } from '#/models/sorter'

export function shellSortFunction(array: number[]): void {
    if (array.length <= 1) return;

    for (let gap: number = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let j: number = gap; j < array.length; j++) {
            const key: number = array[j];
            let i: number = j;
            while (i >= gap && array[i - gap] > key) {
                array[i] = array[i - gap];
                i -= gap;
            }
            array[i] = key;
        }
    }
}

// version of sort as Generator. Note the async. Returns Generator object (Iterator)

export async function* shellSort(
      array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0

    if (array.length <= 1) {
        return { comps, swaps }
    }

    for (let gap: number = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let j: number = gap; j < array.length; j++) {
            const key: number = array[j]
            let i: number = j
            while (i >= gap) {
                comps++
                yield { type: 'compare', indices: [i - gap, i] }
                if (array[i - gap] > key) {
                    array[i] = array[i - gap]
                    swaps++
                    yield { type: 'write', indices: [i] }
                    i -= gap
                } else {
                    break
                }
            }
            array[i] = key
            swaps++
            yield { type: 'write', indices: [i] }
        }
    }

    return { comps, swaps }
}
