<script setup lang="ts">
import { useVisualizationSettings } from "#/composables/useVisualizationSettings";

const { settings } = useVisualizationSettings();
</script>

<template>
  <aside class="sidebar" aria-labelledby="controls-heading">
    <section class="panel" aria-labelledby="controls-heading">
      <h3 id="controls-heading">Visualization Controls</h3>
      <form @submit.prevent>
        <fieldset>
          <legend>Display settings</legend>

          <label for="display-mode">Display</label>
          <select id="display-mode" v-model="settings.displayMode">
            <option value="bars">Bars</option>
            <option value="dots">Dots</option>
          </select>

          <label for="order-mode">Sample order</label>
          <select id="order-mode" v-model="settings.orderMode">
            <option value="random">Random</option>
            <option value="increasing">Increasing</option>
            <option value="decreasing">Decreasing</option>
          </select>

          <label for="sample-size">Sample size</label>
          <select id="sample-size" v-model.number="settings.maxSamples">
            <option v-for="n in 50" :key="n" :value="n">
              {{ n }}
            </option>
          </select>

          <div class="speed-group">
            <h4>Speed</h4>
            <label>
              <input type="radio" name="speed" value="slow" v-model="settings.speed" />
              Slow
            </label>
            <label>
              <input type="radio" name="speed" value="medium" v-model="settings.speed" />
              Medium
            </label>
            <label>
              <input type="radio" name="speed" value="fast" v-model="settings.speed" />
              Fast
            </label>
          </div>

          <label for="delay">Delay per step (ms)</label>
          <input id="delay" type="number" min="100" max="1000" v-model.number="settings.delay" />
        </fieldset>
      </form>
    </section>
  </aside>
</template>
<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
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

fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: none;
  padding: 0;
  margin: 0;
}

legend {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

label {
  font-weight: 500;
  font-size: 0.85rem;
}

input,
select {
  padding: 0.4rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
  font-size: 0.85rem;
}

.speed-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.speed-group h4 {
  margin: 0;
  font-size: 0.9rem;
}
</style>
