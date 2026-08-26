export interface SortedYieldResult {
  type: 'compare' | 'swap' | 'write', 
  indices: number[]
}

export interface SortedReturnResult {
  comps: number, 
  swaps: number
}
export type SortGenerator = AsyncGenerator<SortedYieldResult, SortedReturnResult, void>

export type SortingState = 'idle' | 'running' | 'paused' | 'finished'
export type SortingAlgorithmFn = (array: number[]) => SortGenerator;

export interface SortingAlgorithm {
  name: string, 
  impl: SortingAlgorithmFn
}


