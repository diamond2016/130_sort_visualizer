/**
 * Bubble Sort Algorithm
 * 
 * Concept:
 * A simple comparison-based sorting algorithm. It works by repeatedly stepping through 
 * the list, comparing adjacent elements, and swapping them if they are in the wrong order. 
 * The pass through the list is repeated until the list is sorted. The largest unsorted 
 * element "bubbles up" to its correct position at the end of the array in each iteration.
 *
 * Implementation Steps:
 * 1. Loop through the array from the first element to the last (n-1 elements).
 * 2. For each element, compare it with the next element.
 * 3. If the current element is greater than the next element, swap them.
 * 4. Repeat this process for all elements in the array.
 * 5. After each full pass, the largest element in the unsorted portion moves to its final position.
 * 6. (Optimization) If no swaps are made during a complete pass, the array is already sorted.
 *
 * Complexity:
 * - Time Complexity: O(n^2) in the worst and average cases.
 * - Space Complexity: O(1) (it is an in-place sorting algorithm).
 */
import { SortGenerator } from '#/models/sorter'

export function bubbleSortFunction(array: number[]): void {
  
    // 1
    let sorted = false
    while (!sorted) {
        sorted = true

        for (let i = 0; i < array.length - 1; i++) {
            // 2,3
            if (array[i] > array[i + 1]) {
                const dummy: number = array[i]
                array[i] = array [i + 1]
                array[i + 1] = dummy
                sorted = false
            }
        }

        if (sorted)
            break
    } // bubbleSort (in place)
}


// version of bubblesort as Generator. Nothe the async. Returns Generator object (Iterator)

export async function* bubbleSort(
  array: number[]
): SortGenerator {

  let sorted = false
  let comps = 0
  let swaps = 0
  let max_index = 0

  while (!sorted) {
    sorted = true

    for (let i = 0; i < array.length - 1; i++) {
      comps++

      // 1. yield: confronto
      yield { type: 'compare', indices: [i, i + 1] }

      if (array[i] > array[i + 1]) {
        const tmp = array[i]
        array[i] = array[i + 1]
        array[i + 1] = tmp

        max_index = i + 1
        swaps++
        sorted = false

        // 2. yield: swap
        yield { type: 'swap', indices: [i, i + 1] }
      }
    }

    // 3. write; signal the new element correctly positioned
    yield { type: 'write', indices: [max_index, max_index] }
  }

  return { comps, swaps }
}
