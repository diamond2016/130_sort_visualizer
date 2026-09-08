import { Renderer } from '#/models/renderer' 
import { SortedYieldResult } from '#/models/sorter';

const maxValue = 100;

/**
 * Helper to draw a single bar on the canvas.
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

const drawResting = (array: number[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / array.length;
  array.forEach((value, i) => {
    drawBar(ctx, canvas, i, value, barWidth, 'skyblue');
  });
};

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

const clear = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const barsRenderer: Renderer = {
  drawResting,
  drawEvent,
  clear,
};
