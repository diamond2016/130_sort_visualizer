import { SortedYieldResult } from "#/models/sorter";

/**
 * Renderer — a type-level rendering contract for the visualization canvas.
 *
 * This interface is the pluggable boundary between the view (`Main.vue`)
 * and the concrete drawing strategies (e.g. the bars and numbers renderers).
 * `Main.vue` delegates *all* canvas drawing to whichever renderer is active
 * and never needs to know which concrete renderer it is, which lets the
 * display mode be switched at any time (including mid-run) without touching
 * the algorithm, stats, or playback state.
 *
 * Each method receives the live array plus the canvas element and its 2D
 * context so the renderer can draw (or clear) the current frame.
 */
export interface Renderer {
  /**
   * Draw the array in its resting state (no active event), e.g. every
   * bar/tile in the resting colour.
   */
  drawResting(array: number[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  /**
   * Draw the array and highlight the event's `indices` in the colour that
   * matches the event type (compare / swap / write).
   */
  drawEvent(array: number[], event: SortedYieldResult, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  /**
   * Clear the canvas back to a blank frame.
   */
  clear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}

export const MAX_VALUE = 100