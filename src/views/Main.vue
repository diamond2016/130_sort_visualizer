<script setup lang="ts">
import { onMounted, ref } from "vue";
import { bubbleSort } from "#/utils/bubblesort";
import { SortGenerator, SortedReturnResult } from "#/models/sorter";
import { sleep } from '#/utils/helper'
import Statistics from "#/views/Statistics.vue";
import { useVisualizationSettings } from "#/composables/useVisualizationSettings";

const { settings } = useVisualizationSettings();

// --- State ---
const canvasRef = ref<HTMLCanvasElement | null>(null);
const maxValue = 100;
const speedTime = 200; 

let pauseState = false
let sortingId = 0

const arrayRef = ref<number[]>([])
const comparing = ref<number[]>([])
const swapping = ref<number[]>([])
const writing = ref<number[]>([])
const gen = ref<SortGenerator | null>(null)
const running = ref(false)


// --- Helpers ---
const createRandomArray = (): number[] =>
  Array.from({ length: settings.maxSamples }, () => Math.floor(Math.random() * (maxValue)));


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
async function runSort(gen: SortGenerator, currentSortingId: number): Promise<void>{
  let step = await gen.next()

  while (!step.done) {
    if (sortingId !== currentSortingId) {
      return;
    }

    if (pauseState)  {
      await sleep(speedTime)
      continue
    }

    if (step.value.type === 'compare') {
      compare(arrayRef.value, step.value.indices)
      await sleep(speedTime)
    }

    else if (step.value.type === 'swap') {
      swap(arrayRef.value, step.value.indices)
      await sleep(speedTime)
    }

    else if (step.value.type === 'write') {
      write(arrayRef.value, step.value.indices)
      await sleep(speedTime)
    }

    draw(arrayRef.value); 
    step = await gen.next()
  }

  // final value
  if (sortingId === currentSortingId) {
    statusMessage.value = "Elaborazione completata" 
  }
}


// animation functions
function onCompare(indices: number[]) {
  comparing.value = indices
}

function onSwap(indices: number[]) {
  swapping.value = indices
  const [i, j] = indices
  const tmp = arrayRef.value[i]
  arrayRef.value[i] = arrayRef.value[j]
  arrayRef.value[j] = tmp
}

function onWrite(indices: number[]) {
  writing.value.push(indices[0])
}


// 1. start, 2. pause 3. resume 4. restart 5. step.
// start
async function start() {
  running.value = true
  while (running.value) {
    await step()
    await sleep(200)   // animazione
  }
}

// pause
function pause() {
  running.value = false
}

// resume
function pause() {
  running.value = false
}

// restart
function reset() {
  running.value = false
  numbers.value = [...originalNumbers]
  comparing.value = []
  swapping.value = []
  writing.value = []
  gen.value = bubbleSort(numbers.value)
}

// step: single pass 
async function step() {
  if (!gen.value) return

  const result = await gen.value.next()

  if (!result.done) {
    const { type, indices } = result.value

    if (type === 'compare') onCompare(indices)
    if (type === 'swap') onSwap(indices)
    if (type === 'write') onWrite(indices)
  } else {
    running.value = false
    console.log('Statistiche finali:', result.value)
  }
}


/*
function compare(arr: number[], indices: number[]) {
  comparisons.value++
  status(" Comparing: ", indices)
  
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const barWidth = canvas.width / arr.length;
  indices.forEach((index) => {
    drawBar(ctx, canvas, index, arr[index], barWidth, 'yellow');
  });  
}

function swap(arr: number[], indices: number[]) {
  swaps.value++
  status(" Swapping: ", indices)
  
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const barWidth = canvas.width / arr.length;
  indices.forEach((index) => {
    drawBar(ctx, canvas, index, arr[index], barWidth, 'red');
  });
}


function write(arr: number[], indices: number[]) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const barWidth = canvas.width / arr.length;
  indices.forEach((index) => {
    drawBar(ctx, canvas, index, arr[index], barWidth, 'green');
  });
}
*/
function status(message: string, arr: number[]) {
  statusMessage.value =  message + arr
}


onMounted(() => {
  arrayRef.value = createRandomArray();
  draw(arrayRef.value);
})

</script>



<template>
  <main class="main-view">
    <!-- Wrap the first two sections in a container for the row layout -->
    <div class="controls-row">
    <section class="panel" aria-labelledby="algorithm-heading">
      <h3 id="algorithm-heading">Sorting Algorithm</h3>
      <nav aria-label="Algorithm selector">
        <label for="algorithm-select">Algorithm:&nbsp;</label>
        <select id="algorithm-select">
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
          <option value="shell">Shell Sort</option>
          <option value="radix">Radix Sort</option>
        </select>
      </nav>
    </section>
    <section class="panel" aria-labelledby="playback-heading">
      <h3 id="playback-heading">Playback Controls</h3>
      <nav class="button-group" aria-label="Playback controls">
        <button type="button" @click="start()">Start</button>
        <button type="button" @click="pause()"">Pause</button>
        <button type="button" @click="resume()">Resume</button>
        <button type="button" @click="restart()">Resume</button>
        <button type="button" @click="step()">Resume</button>
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