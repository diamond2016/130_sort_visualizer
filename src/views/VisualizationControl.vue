<template>
  <aside class="sidebar" aria-labelledby="controls-heading">
    <section class="panel" aria-labelledby="controls-heading">
      <h2 id="controls-heading">Visualization Controls</h2>
      <fieldset>
        <legend>Display settings</legend>

        <label for="display-mode">Display</label>
        <select id="display-mode">
          <option value="bars">Bars</option>
          <option value="dots">Dots</option>
        </select>

        <label for="order-mode">Sample order</label>
        <select id="order-mode">
          <option value="random">Random</option>
          <option value="increasing">Increasing</option>
          <option value="decreasing">Decreasing</option>
        </select>

        <label for="sample-size">Sample size</label>
        <input id="sample-size" type="range" min="10" max="100" value="50" />

        <div class="speed-group">
          <h3>Speed</h3>
          <label>
            <input type="radio" name="speed" value="slow" />
            Slow
          </label>
          <label>
            <input type="radio" name="speed" value="medium" checked />
            Medium
          </label>
          <label>
            <input type="radio" name="speed" value="fast" />
            Fast
          </label>
        </div>

        <label for="delay">Delay per step (ms)</label>
        <input id="delay" type="number" min="100" max="1000" value="250" />
      </fieldset>
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
  border-radius: 12px;
  padding: 1rem;
  background: #f9fafb;
}

.panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
  padding: 0;
  margin: 0;
}

legend {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

label {
  font-weight: 500;
}

input,
select {
  padding: 0.6rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.speed-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.speed-group h3 {
  margin: 0;
  font-size: 1rem;
}
</style>
