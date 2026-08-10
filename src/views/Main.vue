<template>
  <main class="main-view">
    <section class="panel" aria-labelledby="algorithm-heading">
      <h2 id="algorithm-heading">Sorting Algorithm</h2>
      <nav aria-label="Algorithm selector">
        <label for="algorithm-select">Algorithm</label>
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
      <h2 id="playback-heading">Playback Controls</h2>
      <nav class="button-group" aria-label="Playback controls">
        <button type="button">Start</button>
        <button type="button">Pause</button>
        <button type="button">Step</button>
        <button type="button">Reset</button>
      </nav>
    </section>

    <section class="panel" aria-labelledby="visualization-heading">
      <h2 id="visualization-heading">Visualization Area</h2>
      <figure class="canvas-card">
        <canvas aria-label="Sorting visualization"></canvas>
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
