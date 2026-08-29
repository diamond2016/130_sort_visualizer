# Project Guidelines

This project is a TypeScript + Vue sorting visualizer built with Vite and Vitest. The goal is to keep the code easy to reason about, testable, and aligned with the event-driven visualization model already used by the app.

## 1. General development principles

### Keep the architecture simple
- Prefer small, focused modules under `src/utils/` and `src/views/`.
- Each sorting algorithm should live in its own file, such as `bubblesort.ts`, `mergesort.ts`, or `quicksort.ts`.
- Keep algorithm logic separate from UI concerns.
- Do not mix rendering logic with sorting logic.

### TypeScript best practices
- Use explicit types for function arguments and return values.
- Favor `number[]` and known interfaces over `any`.
- Keep the code strict and readable; this project already uses `strict: true` in TypeScript.
- Prefer clear, descriptive names for functions and variables.
- Use type aliases and interfaces for shared contracts instead of repeating inline shapes.

### Vue best practices
- Keep Vue components focused on composition, state wiring, and rendering.
- Use reusable computed values and simple methods instead of spreading complex logic inside templates.
- Avoid adding business logic directly into components when it belongs in utility modules.
- Keep the data flow predictable: sort algorithms emit state changes; the view consumes those events and renders them.

### Maintainability
- Preserve the current event-driven pattern: sorting functions yield events such as `compare`, `swap`, and `write`.
- Follow existing naming conventions consistently across new algorithms.
- Keep JSDoc comments in utility files when documenting algorithm concept, steps, and complexity.
- When adding a new algorithm, match the structure of existing implementations rather than inventing a different style.

---

## 2. Project-specific conventions

### Sorting algorithm contract
The sorting utilities in this project follow the contract defined in `src/models/sorter.ts`.

- Plain algorithm functions should sort the array in place.
- Generator-style algorithm functions should be async generators.
- Generator functions return a `SortGenerator` object containing:
  - yielded event objects shaped like `{ type: 'compare' | 'swap' | 'write', indices: number[] }`
  - a final return value shaped like `{ comps: number, swaps: number }`

Example pattern:
- `bubbleSortFunction(array: number[]): void`
- `bubbleSort(array: number[]): SortGenerator`

### Event semantics
- `compare`: used when values are compared during sorting.
- `swap`: used when the order of two array values changes.
- `write`: used when an element is placed into its final or current target position.

All new algorithms should follow these semantics and keep the event sequence intuitive for the visualization layer.

### Array mutation rules
- Sorting utilities should operate on the input array in place unless the algorithm design explicitly requires a copied working array.
- The project expects mutating algorithms; avoid returning a new array when the established pattern is in-place sorting.
- When copying is necessary for internal logic, ensure the original input is still updated before completion.

### UI compatibility
- Do not change the renderer contract without a strong reason.
- The app is designed to work with the existing event-driven view in `src/views/Main.vue` without requiring renderer-level refactors.
- If a new algorithm produces a visualization pattern, it should fit the same event model rather than requiring new frontend code.

### File organization
- Add utility implementations under `src/utils/`.
- Add tests under `tests/` with names matching the algorithm, such as `bubblesort.test.ts`.
- Keep imports aligned with the project alias setup using `#/` and `@/` where appropriate.
- Prefer tiny, well-named helper functions over large monolithic implementations.

---

## 3. Testing guidelines

### Test framework and usage
- Use Vitest for all project tests.
- Keep tests in the `tests/` folder and name files according to the function or algorithm under test.
- Run the suite with `npm test`.
- Run a TypeScript build check with `npm run build` before finishing larger changes.

### Test cases to cover
For every sorting algorithm, include the following cases when relevant:
- empty array
- single element array
- already sorted array
- reverse sorted array
- array with duplicate values
- array with negative numbers
- random unsorted array

This project already follows that pattern and new implementations should preserve it.

### Assertions and behavior
- Assert on the final sorted array, not on internal implementation details.
- Avoid mock-heavy tests for sorting logic; prefer real inputs and real output comparisons.
- Keep tests deterministic and simple.
- Check edge cases before larger random cases.

### Performance and correctness
- Focus on correctness first and stable behavior second.
- Ensure the algorithm handles edge cases gracefully.
- For generator implementations, validate that the yielded event stream remains structurally consistent with the contract.

---

## 4. Code review expectations

When contributing to this project, reviewers should expect:
- clear algorithm documentation
- consistent naming and structure
- strict TypeScript types
- test coverage for edge cases
- UI compatibility with the current visualization model
- no unnecessary changes outside the relevant module or test file

---

## 5. Working rules for this codebase

### Do
- follow the established sort utility pattern
- keep algorithms in place and deterministic
- use real data and actual sorting assertions in tests
- preserve event semantics for the visualization layer
- document complexity and concept clearly

### Avoid
- using `any` where a specific type is known
- adding renderer-specific logic into sorting utilities
- broad refactors unrelated to the active task
- changing the event contract without updating all consumers
- testing implementation details instead of end behavior

---

## 6. Recommended workflow

1. Implement or update the algorithm in the relevant utility file.
2. Add or update unit tests for edge cases and typical values.
3. Run the test suite with `npm test`.
4. Run the TypeScript build check with `npm run build`.
5. Verify the UI still behaves as expected for the sorting animation.

This project is intentionally small and algorithm-focused, so clarity and consistency matter more than clever abstractions.
