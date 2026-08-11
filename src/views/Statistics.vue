<script lang="ts">
// Default Props & Loading State
const props = defineProps<{ comparisons: number; swaps: number }>()
</script>

<template>
  <footer class="stats-footer" aria-labelledby="stats-heading">
    <section class="panel" aria-labelledby="stats-heading">
      <h3 id="stats-heading">Statistics</h3>
      <div class="stats-row">
      <p>Comparisons: <span>{{ props.comparisons }}</span></p>
      <p>Swaps: <span>{{ props.swaps }}</span></p>
      <p class="status">Status: Ready</p>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.stats-footer {
  display: flex;
}

.stats-row {
  display: flex;
  justify-content: space-between;
}

.panel {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 1rem;
  background: #f9fafb;
}

.panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.panel p {
  margin: 0.25rem 0;
}

.status {
  margin-top: 0.75rem;
  font-weight: 300;
}
</style>
