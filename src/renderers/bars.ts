import { Renderer, MAX_VALUE } from '#/models/renderer'
import { SortedYieldResult } from '#/models/sorter';

/**
 * The maximum value used to scale bar heights to the canvas.
 * A bar with value `v` is drawn at height `(v / maxValue) * canvas.height`.
 */
const maxValue = MAX_VALUE;

/**
 * Helper to draw a single bar on the canvas.
 *
 * @param ctx - The 2D rendering context to draw on.
 * @param canvas - The canvas element (used for dimensions).
 * @param index - The zero-based position of the bar in the array.
 * @param value - The numeric value of the element at `index`.
 * @param barWidth - The pixel width allocated to each bar.
 * @param color - The CSS colour to fill the bar with.
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

/**
 * Draw the array in its resting state: clear the canvas, then render every
 * bar in the resting colour (`skyblue`) using the `maxValue` scaling.
 */
const drawResting = (array: number[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / array.length;
  array.forEach((value, i) => {
    drawBar(ctx, canvas, i, value, barWidth, 'skyblue');
  });
};

/**
 * Draw a single algorithm event: clear the canvas, render all bars in the
 * resting colour (`skyblue`), then redraw the event's `indices` in the
 * colour that matches the event type — `yellow` for compare, `red` for
 * swap, `green` for write.
 */
const drawEvent = (array: number[], event: SortedYieldResult, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / array.length;
  array.forEach((value, i) => {
    drawBar(ctx, canvas, i, value, barWidth, 'skyblue');
  });
  const color = event.type === 'compare' ? 'yellow' : event.type === 'swap' ? 'red' : 'green';
  event.indices.forEach((index) => {
    drawBar(ctx, canvas, index, array[index], barWidth, color);
  });
};

/**
 * Clear the canvas back to a blank frame.
 */
const clear = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * The bars renderer — implements the {@link Renderer} interface by drawing
 * the array as a row of vertical bars.
 */
export const barsRenderer: Renderer = {
  drawResting,
  drawEvent,
  clear,
};
