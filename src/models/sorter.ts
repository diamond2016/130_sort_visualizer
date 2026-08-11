export interface SortedYieldResult {
  type: 'compare' | 'swap', 
  indices: number[]
}

export interface SortedReturnResult {
  comps: number, 
  swaps: number
}

