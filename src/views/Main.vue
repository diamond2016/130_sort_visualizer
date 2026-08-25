<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watch } from "vue";
import { bubbleSort } from "#/utils/bubblesort";
import { isSorted } from "#/utils/validator";
import { SortGenerator, SortingState, SortingAlgorithm } from "#/models/sorter";
import { sleep } from '#/utils/helper'
import Statistics from "#/views/Statistics.vue";
import { useVisualizationSettings } from "#/composables/useVisualizationSettings";

const { settings } = useVisualizationSettings();

// --- State / Reactive state ---
const canvasRef = ref<HTMLCanvasElement | null>(null);
const maxValue = 100;
const sortingState = ref<SortingState>('idle');
const sortingAlgorithm = ref<SortingAlgorithm>('bubbleSort')
const canStart = computed(() => sortingState.value === 'idle');
const canPause = computed(() => sortingState.value === 'running');
const canResume = computed(() => sortingState.value === 'paused');
const canStep = computed(() =>
  sortingState.value === 'idle' || sortingState.value === 'paused'
);

const arrayRef = ref<number[]>([])
let originalArray: number[] = []
const comparing = ref<number[]>([])
const swapping = ref<number[]>([])
const writing = ref<number[]>([])
const gen = ref<SortGenerator | null>(null)
const running = ref(false)
const statusMessage = ref<string>("") 
const comparisons = ref<number>(0)
const swaps = ref<number>(0)
const writes = ref<number>(0)

// Timer state
const elapsedTime = ref<number>(0);
let accumulatedTime = 0;
let startTime = 0;
let timerInterval: number | null = null;

function startTimer() {
  if (timerInterval !== null) return;
  startTime = performance.now();
  timerInterval = window.setInterval(() => {
    const current = performance.now();
    elapsedTime.value = (accumulatedTime + (current - startTime)) / 1000;
  }, 50);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
    const current = performance.now();
    accumulatedTime += current - startTime;
    elapsedTime.value = accumulatedTime / 1000;
  }
}

function resetTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  accumulatedTime = 0;
  elapsedTime.value = 0;
}

// --- Helpers ---
const createRandomArray = (): number[] =>
  Array.from({ length: settings.maxSamples }, () => Math.floor(Math.random() * (maxValue)));

watch(
  () => sortingAlgorithm,
  (newAlgorithm) => {
    console.log(newAlgorithm)
})

/**
 * Helper to draw a single bar on the canvas.
 */
const drawBar = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  index: number,
  value: number,
  barWidth: number,
  color: string
) => {
  const barHeight = (value / maxValue) * canvas.height;
  ctx.fillStyle = color;
  ctx.fillRect(index * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
};


const draw = (array: number[]) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw the bars
  const barWidth = canvas.width / array.length;
  
  array.forEach((value, i) => {
    drawBar(ctx, canvas, i, value, barWidth, 'skyblue');
  });
};



// --- Core Logic ---
// step: single pass 
async function step() {
  if (sortingState.value === 'idle') {
    gen.value = bubbleSort(arrayRef.value)
    sortingState.value = 'paused'
    statusMessage.value = ""
  }
  if (!gen.value) return

  // Clear the previous event only when advancing to the next event.
  draw(arrayRef.value)
  const result = await gen.value.next()

  if (!result.done) {
    const { type, indices } = result.value

    if (type === 'compare') onCompare(indices)
    if (type === 'swap') onSwap(indices)
    if (type === 'write') onWrite(indices)
    
    await sleep(settings.delay)
  
  } else {
    running.value = false
    sortingState.value = 'finished'
    stopTimer();
    draw(arrayRef.value);
    
    const valid = isSorted(arrayRef.value);
    if (valid) {
      statusMessage.value = "Sorted Successfully!";
    } else {
      statusMessage.value = "Error: Array is not sorted!";
    }
  }
}


// animation functions
// compare (yellow)
function onCompare(indices: number[]) {
  comparing.value = indices
  comparisons.value++
  statusMessage.value = `Comparing: ${indices}`
  
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const barWidth = canvas.width / arrayRef.value.length
  indices.forEach((index) => {
    drawBar(ctx, canvas, index, arrayRef.value[index], barWidth, 'yellow');
  })
}

// swap (red)
function onSwap(indices: number[]) {
  swapping.value = indices
  swaps.value++
  statusMessage.value = `Swapping: ${indices}`
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const barWidth = canvas.width / arrayRef.value.length;
  indices.forEach((index) => {
    drawBar(ctx, canvas, index, arrayRef.value[index], barWidth, 'red');
  })
}

// write (green)
function onWrite(indices: number[]) {
  writing.value = indices
  writes.value++
  statusMessage.value = `Writing: ${indices}`
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const barWidth = canvas.width / arrayRef.value.length;

  writing.value.push(indices[0])
   indices.forEach((index) => {
    drawBar(ctx, canvas, index, arrayRef.value[index], barWidth, 'green');
  })
}



// Commands: 1. start, 2. pause 3. resume 4. restart 5. step.
// start
async function start() {
  if (!canStart.value) return
  resetTimer();
  running.value = true
  sortingState.value = 'running'
  statusMessage.value = "" 
  startTimer();
  gen.value = bubbleSort(arrayRef.value)
  while (running.value) {
    await step() // animate
  }
}

// pause
function pause() {
  if (!canPause.value) return
  running.value = false
  sortingState.value = 'paused'
  stopTimer();
}

// resume
async function resume() {
  if (!canResume.value) return
  running.value = true
  sortingState.value = 'running'
  startTimer();
  while (running.value) {
    await step() // animate
  }
}

// reset
function reset() {
  running.value = false
  sortingState.value = 'idle'
  gen.value = null
  resetTimer();
  arrayRef.value = [...originalArray]
  draw(arrayRef.value)
  comparing.value = []
  swapping.value = []
  writing.value = []
  statusMessage.value = "press Start" 
  comparisons.value = 0
  swaps.value = 0
  writes.value = 0
}


onMounted(() => {
  arrayRef.value = createRandomArray();
  originalArray = [...arrayRef.value]
  draw(arrayRef.value);
})

onUnmounted(() => {
  resetTimer();
});

</script>



<template>
  <main class="main-view">
    <!-- Wrap the first two sections in a container for the row layout -->
    <div class="controls-row">
    <section class="panel" aria-labelledby="algorithm-heading">
      <h3 id="algorithm-heading">Sorting Algorithm</h3>
      <nav aria-label="Algorithm selector">
        <form @submit.prevent>
          <label for="algorithm-select">Algorithm:&nbsp;</label>
          <select id="algorithm-select" v-model="sortingAlgorithm">
            <option value="bubbleSort">Bubble Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
            <option value="heapSort">Heap Sort</option>
            <option value="shellSort">Shell Sort</option>
            <option value="radixSort">Radix Sort</option>
          </select>
        </form>
      </nav>
    </section>
    <section class="panel" aria-labelledby="playback-heading">
      <h3 id="playback-heading">Playback Controls</h3>
      <nav class="button-group" aria-label="Playback controls">
        <button type="button" :disabled="!canStart" @click="start()">Start</button>
        <button type="button" :disabled="!canPause" @click="pause()">Pause</button>
        <button type="button" :disabled="!canResume" @click="resume()">Resume</button>
        <button type="button" @click="reset()">Reset</button>
        <button type="button" :disabled="!canStep" @click="step()">Step</button>
      </nav>
    </section>
    </div>

    <section class="panel" aria-labelledby="visualization-heading">
      <h3 id="visualization-heading">Visualization Area</h3>
      <figure class="canvas-card">
        <canvas ref="canvasRef" aria-label="Sorting visualization"></canvas>
        <figcaption>Live view of the current array state.</figcaption>
      </figure>
    </section>

    <Statistics 
      :comparisons="comparisons" 
      :swaps="swaps" 
      :writes="writes"
      :elapsedTime="elapsedTime"
      :statusMessage="statusMessage" 
    />
  </main>
</template>
<style scoped>
.main-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.controls-row {
  display: flex;
  gap: 0.75rem;
}

.controls-row .panel {
  flex: 1;
}

.panel {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem;
  background: #f9fafb;
}

.panel h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

button,
select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
  font-size: 0.85rem;
}

.canvas-card {
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  background: #fff;
}

canvas {
  width: 100%;
  min-height: 200px;
  border-radius: 6px;
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}
</style>