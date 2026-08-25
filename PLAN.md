## Step 1 complete

- The app now renders a basic visualization canvas.
- The initial array is generated as random integers in the range [0..100].
- The next step is to implement the sorting generator and the animation loop.


## Step 2: Implement Sorting Generators and Animation Loop

**Implement Logic Layer (Generators)**: 
- Create a TypeScript file (e.g., `src/algorithms/bubbleSort.ts`) implementing the Bubble Sort algorithm.
- Use the `Generator` pattern to `yield` specific event objects: 

```ts 
{ type: 'compare', indices: [i, j] } 
{ type: 'swap', indices: [i, j] }
{ type 'write', indices: [i,j]} // j==i
```


**Implement Animation Controller**
- In `Main.vue`, implement an asynchronous animation loop (using `requestAnimationFrame` or a controlled `setTimeout` to respect the "animation speed" requirement. 
- The loop should consume the generator, waiting for each `yield` before proceeding to the next step.

**Connect Logic to State**:
- Update the reactive state in `Main.vue` (the array and the statistics) based on the events yielded by the generator.
- Ensure `comparisons` and `swaps` are incremented in the state to update `Statistics.vue` in real-time.

**Integrate Rendering**:
- Ensure the Canvas component reacts to the updated array in `Main.vue` to redraw the bars during the animation.
TODO: ensure that swaps elements are higlighted, tbd for other algorithms.
- a resting/idle colour for bars that aren’t being touched (cyan)
- a comparison colour for the two indices the algorithm is currently comparing (yellow)
- a swap colour for indices that are currently being swapped or written (red)
- a colour for the elemen written (in this case in the correct position (green)
Update your bubble sort so that the right indices are highlighted at the right moment.

**Verification**:
- Confirm that the animation is "pausable" or "steppable" (as suggested by `ARCHITECTURE.md`) by controlling the execution of the generator loop.


### Implementation
1.  modify the swap(), to highlight swapping, refactor to avoid duplications. OK
1.  implement write and comparisons color OK
1.  implement step 2 ok


## Step 3: Playback Controls and Configurable Speed

**Goal**: Implement comprehensive playback controls (Start, Pause, Resume, Reset, Step) and configurable speed settings (presets: Slow, Medium, Fast, plus custom step delay), live wall-clock time measurement, highlight preservation when paused, and array correctness validation on completion.

### 1. State Machine & Controller Refactoring (`Main.vue`)
- Introduce explicit `PlaybackState`: `'idle' | 'running' | 'paused' | 'finished'`.
- Define button states:
  - **Start**: Active when `idle` or `finished`. Initializes array/generator and starts animation loop.
  - **Pause**: Active when `running`. Pauses execution loop without clearing highlights.
  - **Resume**: Active when `paused`. Continues animation loop from current generator state.
  - **Reset**: Active anytime. Resets array to original state, clears highlights, resets stats and timer.
  - **Step**: Active when `idle` or `paused`. Executes a single generator step, updates stats and highlights, and stays `paused`.
- Retain highlights (yellow for comparison, red for swap, green for write) when paused so visual state is preserved.

### 2. Configurable Speed Controller (`useVisualizationSettings.ts` & `VisualizationControl.vue`)
- Connect speed presets (`slow`: 400ms, `medium`: 150ms, `fast`: 20ms) with `settings.delay` input.
- Dynamically read `settings.delay` inside the animation loop sleep function so speed adjustments take effect instantly during playback without restarting.

### 3. Statistics & Wall-Clock Timer (`Statistics.vue` & `Main.vue`)
- Add live wall-clock timer (`elapsedTime`) in `Main.vue` using `performance.now()`.
- Pass `elapsedTime` to `Statistics.vue` and display formatted output (e.g., `0.00s`).
- Pause timer when `paused` or `finished`; reset to `0.00s` on `Reset`.

### 4. Array Correctness Validation (`utils/validator.ts`)
- Create `isSorted(arr: number[]): boolean` helper function.
- Validate array when generator finishes (`done === true`).
- Display clear success message ("Sorted Successfully!") or error message ("Error: Array is not sorted") in `Statistics.vue`.

### Implementation Checklist
1. [ ] Create `src/utils/validator.ts` and unit test `tests/validator.test.ts`.
2. [ ] Update `useVisualizationSettings.ts` for reactive speed preset and delay synchronization.
3. [ ] Update `Statistics.vue` to accept `elapsedTime` prop and render timer.
4. [ ] Refactor `Main.vue` animation loop with state machine (`idle`/`running`/`paused`/`finished`), responsive pause, step action, and highlight preservation.
5. [ ] Verify playback controls, speed slider/presets, timer, and correctness validation end-to-end.



