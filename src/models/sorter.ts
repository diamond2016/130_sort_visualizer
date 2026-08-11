export interface SortedYieldResult {
  type: 'compare' | 'swap', 
  indices: number[]
}

export interface SortedReturnResult {
  comps: number, 
  swaps: number
}

export type SortGenerator = AsyncGenerator<SortedYieldResult, SortedReturnResult, void>