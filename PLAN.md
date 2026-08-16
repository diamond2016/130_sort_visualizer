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


**Verification**:
- Confirm that the animation is "pausable" or "steppable" (as suggested by `ARCHITECTURE.md`) by controlling the execution of the generator loop.

TODO: step to-be implemented.

### Implementation
1.  modify the swap(), to highlight, refactor to avoid duplications.