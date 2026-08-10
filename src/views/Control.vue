<!-- area to control visualizer -->
<template>
<section class="controls">
   <div class="control-row control-row">
      <button type="button" @click="start">Start</button>
      <button type="button" @click="stop">Stop</button>
      <button type="button" @click="step">Step</button>
      <button type="button" @click="resume">Reset</button>
    </div>
</section>

<section class="algorithm">
    <div class="algorithm">
    <label for="algorithm">Algorithm</label>
    <select id="algorithm" v-model="selectedAlgorithm">
        <option value="bubble">Bubble Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="selection">Selection Sort</option>
        <option value="merge">Merge Sort</option>
        <option value="quick">Quick Sort</option>
        <option value="heap">Heap Sort</option>
        <option value="shell">shell Sort</option>
        <option value="radix">Radix Sort</option>
    </select>
    </div>
</section>

<section class="display">
    <label for="display">Display</label>
    <select id="display" v-model="selectedDisplay">
        <option value="bars">Bars</option>
        <option value="other">Other</option>
    </select>
    <label for="order">Sample Order</label>
    <select id="display" v-model="selectedOrder">
        <option value="random">Random</option>
        <option value="increasing">Increasing Order</option>
        <option value="decreasing">Decreasing Order</option>
    </select>
    <label for="sample">Sample Size</label>
</section>

<section class="speed">

</section>

<section class="delay">

</section>
</template>