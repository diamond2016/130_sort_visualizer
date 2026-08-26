/**
 * Selection Sort Algorithm
 *
 * Concept:
 *
 * Selection Sort is an intuitive, in-place sorting algorithm that sorts an array by conceptually dividing the structure into two parts: 
 * a sorted subsequence (initially empty, on the left) and an unsorted subsequence (initially containing the entire array, on the right).
 *
 * Implementation Steps:
 *
 * 1. Starting from the first element of the array until second last element
 *   1.1 look for min of A[i..n] -> k;
     1.2 swap A[k] with A[i]
 * 2. Repeat until the entire array is sorted.
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
export function selectionSortFunction(array: number[]): void {
    if (array.length <= 1)
        return
    const n = array.length

    for (let index = 0; index < n -1; index++) {
        // Find min in subarray
        let index_min: number = index;
        for (let j = index+1; j < n; j++) { 
            // compare to find min
            if (array[j] < array[index_min]) 
                index_min = j;
        }
        // swap min with first (index) element
        swap(array,index_min, index);
    }
}

const swap = (arr: number[], a: number, b: number): void => {
    const temp: number = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}


// version of sort as Generator. Note the async. Returns Generator object (Iterator)

export async function* selectionSort(
      array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0
    if (array.length <= 1)
        return { comps, swaps }
    const n = array.length

    for (let index = 0; index < n -1; index++)  {
        // Find min in subarray
        let index_min: number = index;
        for (let j = index+1; j < n; j++) { 
            // compare to find min
            if (array[j] < array[index_min]) {
                comps++
                yield { type: 'compare', indices: [j, index_min] }
                index_min = j 
            }
        }    
        // swap min with first (index) element
        swaps++
        yield { type: 'swap', indices: [index_min, index] }
        swap(array,index_min, index);
    }
   return { comps, swaps } 
}