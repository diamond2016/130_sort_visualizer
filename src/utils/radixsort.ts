/**
 * Radix Sort Algorithm
 *
 * Concept:
 * Radix sort is a non-comparative sorting algorithm that sorts elements by their
 * individual digits. It works by distributing elements based on their digit values
 * at each positional level (ones, tens, hundreds, etc.), performing a stable
 * counting sort at each level.
 *
 * Implementation Steps:
 * 1. Determine the maximum number of digits in the array.
 * 2. For each digit position (from right to left, i.e., ones, tens, hundreds, ...):
 *    a. Count the occurrences of each digit (0-9).
 *    b. Compute the starting position for each digit in the auxiliary array.
 *    c. Place elements into the auxiliary array based on their digit (stable).
 *    d. Copy the auxiliary array back to the main array.
 * 3. Repeat until all digit positions have been processed.
 *
 * Events (yielded values):
 * - type: identifies the action being visualized.
 *   - 'write': value is placed in its sorted position
 * - indices: array of positions involved in the current event.
 *   - Example: [index, index] for a write step
 *
 * Return value:
 * - comps: total number of comparisons performed (always 0 for radix sort)
 * - swaps: total number of swaps performed (always 0 for radix sort)
 *
 * Complexity:
 * - Time Complexity: O(d * (n + k)) where d is the number of digits and k is the base (10).
 * - Space Complexity: O(n) because it uses an auxiliary array while sorting.
 */

import { SortGenerator } from '#/models/sorter'

export function radixSortFunction(array: number[]): void {
    if (array.length <= 1) return;

    const maxVal: number = Math.max(...array)
    const maxDigits: number = maxVal.toString().length

    for (let d: number = 0; d < maxDigits; d++) {
        const exp: number = 10 ** d
        const output: number[] = new Array(array.length).fill(0)
        const count: number[] = new Array(10).fill(0)

        for (let i: number = 0; i < array.length; i++) {
            const digit: number = Math.floor(array[i] / exp) % 10
            count[digit]++
        }

        const pos: number[] = new Array(10).fill(0)
        for (let i: number = 1; i < 10; i++) {
            pos[i] = pos[i - 1] + count[i - 1]
        }

        for (let i: number = 0; i < array.length; i++) {
            const digit: number = Math.floor(array[i] / exp) % 10
            output[pos[digit]] = array[i]
            pos[digit]++
        }

        for (let i: number = 0; i < array.length; i++) {
            array[i] = output[i]
        }
    }
}

const swap = (arr: number[], a: number, b: number): void => {
    const temp: number = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}


// version of sort as Generator. Note the async. Returns Generator object (Iterator)

export async function* radixSort(
      array: number[]
): SortGenerator {
    let comps = 0
    let swaps = 0

    if (array.length <= 1) {
        return { comps, swaps }
    }

    const maxVal: number = Math.max(...array)
    const maxDigits: number = maxVal.toString().length

    for (let d: number = 0; d < maxDigits; d++) {
        const exp: number = 10 ** d
        const output: number[] = new Array(array.length).fill(0)
        const count: number[] = new Array(10).fill(0)

        for (let i: number = 0; i < array.length; i++) {
            const digit: number = Math.floor(array[i] / exp) % 10
            count[digit]++
        }

        const pos: number[] = new Array(10).fill(0)
        for (let i: number = 1; i < 10; i++) {
            pos[i] = pos[i - 1] + count[i - 1]
        }

        for (let i: number = 0; i < array.length; i++) {
            const digit: number = Math.floor(array[i] / exp) % 10
            const dest: number = pos[digit]
            output[dest] = array[i]
            pos[digit]++
            yield { type: 'write', indices: [dest, dest] }
        }

        for (let i: number = 0; i < array.length; i++) {
            array[i] = output[i]
        }
    }

    return { comps, swaps }
}
