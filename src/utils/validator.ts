/**
 * Checks whether an array of numbers is sorted in ascending order.
 * Returns true if for all i, arr[i] <= arr[i + 1], otherwise false.
 */
export function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}
