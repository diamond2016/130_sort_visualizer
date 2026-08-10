<script setup lang="ts">
import MainView from "#/views/Main.vue";
import VisualizationControl from "#/views/VisualizationControl.vue";
import Statistics from "#/views/Statistics.vue";
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>Sort Visualizer</h1>
      <p>Explore sorting algorithms with playback controls and live statistics.</p>
    </header>

    <div class="app-body">
      <MainView />
      <VisualizationControl />
    </div>

    <Statistics />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
}

.app-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
}

.app-header p {
  margin: 0;
  color: #4b5563;
}

.app-body {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
}

@media (max-width: 800px) {
  .app-body {
    grid-template-columns: 1fr;
  }
}
</style>
