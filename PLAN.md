Step 1 complete

- The app now renders a basic visualization canvas.
- The initial array is generated as random integers in the range [0..100].
- The next step is to implement the sorting generator and the animation loop.


140826:
refactor
Statistics.vue: Updated to use <script setup lang="ts"> and configured it to accept three props: comparisons, swaps, and statusMessage. It displays these props dynamically.
Main.vue
: Imported the Statistics component, created reactive state for comparisons, swaps, and statusMessage, and passed them down to the <Statistics> component rendered at the bottom of 
Main.vue
.
App.vue: Removed the <Statistics> component and its import, leaving the structural layout management to 
Main.vue
.