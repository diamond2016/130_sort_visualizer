import { Renderer, MAX_VALUE } from '#/models/renderer'
import { SortedYieldResult } from '#/models/sorter';

/**
 * The maximum value used to scale bar heights to the canvas.
 * A bar with value `v` is drawn at height `(v / maxValue) * canvas.height`.
 */
const maxValue = MAX_VALUE;


const drawResting = (array: number[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {}
const drawEvent = (array: number[], event: SortedYieldResult, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {}

  /**
 * Clear the canvas back to a blank frame.
 */
const clear = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * The numbers renderer — implements the {@link Renderer} interface by drawing
 * the array as labelled tiles in a row, with the active indices visually lifted,
 */
export const numbersRenderer: Renderer = {
  drawResting,
  drawEvent,
  clear,
};
