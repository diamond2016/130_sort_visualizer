<script setup lang="ts">
import { onMounted, ref } from "vue";
import { bubbleSort } from "#/utils/bubblesort";

// step1: visualize array of integers
const canvasRef = ref<HTMLCanvasElement | null>(null);
const maxValue = 100;
const maxSamples = 15;
const redDrawTime = 100; // ms
let initialArray: number[] | undefined 
let arrayRef=ref<number[] | undefined>()

const createRandomArray = (): number[] =>
  Array.from({ length: maxSamples }, () => Math.floor(Math.random() * (maxValue)));

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
    const barHeight = (value / maxValue) * canvas.height;
    ctx.fillStyle = 'skyblue'; // The "resting" color
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
  });
};

const start = (array: number[] | undefined) => {
  if (initialArray) {
    bubbleSort(initialArray)
    draw(initialArray)
  }
}

const reset = (array: number[] | undefined) => {
  initialArray = createRandomArray();
  draw(initialArray);
  }

onMounted(() => {
  initialArray = createRandomArray();
  draw(initialArray);
  arrayRef=ref<number[]>(initialArray)

});

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
        <button type="button" @click="start(arrayRef)">Start</button>
        <button type="button">Pause</button>
        <button type="button">Step</button>
        <button type="button" @click="reset(arrayRef)">Reset</button>
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
  </main>
</template>

<style scoped>
.main-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.controls-row {
  display: flex;
  gap: 1rem;
}

.controls-row .panel {
  flex: 1;
}

.panel {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 1rem;
  background: #f9fafb;
}

.panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button,
select {
  padding: 0.6rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.canvas-card {
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  background: #fff;
}

canvas {
  width: 100%;
  min-height: 260px;
  border-radius: 8px;
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}
</style>
