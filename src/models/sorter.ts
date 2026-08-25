export interface SortedYieldResult {
  type: 'compare' | 'swap' | 'write', 
  indices: number[]
}

export interface SortedReturnResult {
  comps: number, 
  swaps: number
}

export type SortingState = 'idle' | 'running' | 'paused' | 'finished'

export type SortGenerator = AsyncGenerator<SortedYieldResult, SortedReturnResult, void>
