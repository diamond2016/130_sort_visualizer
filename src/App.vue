<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>Sort Visualizer</h1>
      <p>Choose an algorithm and run the visualizer.</p>
    </header>

  
    <section class="visualizer">
      <div class="visualizer-placeholder">
        <p>Visualization goes here.</p>
        <small>Use the controls above to select and start a sorting algorithm.</small>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedAlgorithm = ref("bubble");

const startSort = () => {
  console.log("Start sorting with", selectedAlgorithm.value);
};

const resetArray = () => {
  console.log("Reset visualizer array");
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 2rem;
  display: grid;
  gap: 1.5rem;
  background: #0f172a;
  color: #e2e8f0;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.app-header {
  text-align: center;
}

.controls {
  display: grid;
  gap: 1rem;
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.control-row label {
  font-weight: 600;
}

.control-row select,
.control-row button {
  min-width: 160px;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #1e293b;
  color: #e2e8f0;
}

.buttons-row {
  justify-content: flex-end;
}

.buttons-row button {
  cursor: pointer;
}

.visualizer {
  max-width: 960px;
  margin: 0 auto;
  min-height: 320px;
  border-radius: 1rem;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.15);
  display: grid;
  place-items: center;
}

.visualizer-placeholder {
  text-align: center;
  color: #94a3b8;
}
</style>
