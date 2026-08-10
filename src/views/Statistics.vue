<template>
  <footer class="stats-footer" aria-labelledby="stats-heading">
    <section class="panel" aria-labelledby="stats-heading">
      <h2 id="stats-heading">Statistics</h2>
      <p>Comparisons: <span>0</span></p>
      <p>Swaps: <span>0</span></p>
      <p class="status">Status: Ready</p>
    </section>
  </footer>
</template>

<style scoped>
.stats-footer {
  display: flex;
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
  font-weight: 600;
}
</style>
